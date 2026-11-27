import bcrypt from 'bcryptjs';
import { User, Vendor, Category, VerificationStatus, Role } from '@/types';
import { 
  getStoredVendors, 
  saveVendors, 
  getStoredCategories, 
  saveCategories, 
  addOrUpdateVendor, 
  toggleVendorPublication, 
  updateVendorStatus as storeUpdateVendorStatus 
} from './store';

const TOKEN_KEY = 'ssv_auth_token_v1';
const USER_KEY = 'ssv_current_user_v1';
const LOCAL_USERS_KEY = 'ssv_registered_users_v2';
const RESET_TOKENS_KEY = 'ssv_reset_tokens_v1';

interface StoredUserAccount extends User {
  passwordHash: string;
}

// Akun bawaan terenkripsi (fallback untuk lingkungan static seperti Vercel atau saat server offline)
const DEFAULT_ACCOUNTS: StoredUserAccount[] = [
  {
    id: 'admin-1',
    name: 'Petugas Administrator Pemkot',
    email: 'admin@bandarlampungkota.go.id',
    phone: '08117210001',
    role: 'admin',
    // Hash bcrypt untuk 'admin123'
    passwordHash: '$2a$10$wE86.0F.82aD6s9aGgJ3..5gLd8aX6M1o3l1qW8/aY2gO8zO8i1S6',
  },
  {
    id: 'user-joko',
    name: 'Pak Joko Santoso',
    email: 'joko@gmail.com',
    phone: '081278912345',
    role: 'pedagang',
    vendorId: 'PKL-001',
    // Hash bcrypt untuk 'password123'
    passwordHash: '$2a$10$V8J105iRzL.V10.zQ8X6m.6K7v9s2k4M0l9o1P3q4R5s6T7u8V9w0',
  },
];

function getLocalUsers(): StoredUserAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) {
    // Generate valid hashes once and persist
    const seeded = [
      {
        id: 'admin-1',
        name: 'Petugas Administrator Pemkot',
        email: 'admin@bandarlampungkota.go.id',
        phone: '08117210001',
        role: 'admin' as Role,
        passwordHash: bcrypt.hashSync('admin123', 8),
      },
      {
        id: 'user-joko',
        name: 'Pak Joko Santoso',
        email: 'joko@gmail.com',
        phone: '081278912345',
        role: 'pedagang' as Role,
        vendorId: 'PKL-001',
        passwordHash: bcrypt.hashSync('password123', 8),
      },
    ];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveLocalUsers(users: StoredUserAccount[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredSessionUser(): User | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function updateStoredSessionUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function isSpecificBackendError(err: any): boolean {
  if (!err || !err.message) return false;
  const msg = String(err.message);
  if (
    msg === 'BACKEND_UNAVAILABLE' ||
    msg.includes('BACKEND_UNAVAILABLE') ||
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('Load failed') ||
    msg.includes('405') ||
    msg.includes('404') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('Permintaan gagal')
  ) {
    return false;
  }
  return true;
}

/**
 * Melakukan panggilan API ke backend Express jika tersedia.
 * Jika backend tidak tersedia (misal di Vercel static atau server belum jalan),
 * melempar error khusus agar ditangani oleh fallback engine lokal.
 */
async function tryApiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(path, { ...options, headers });
  } catch {
    throw new Error('BACKEND_UNAVAILABLE');
  }

  // Jika status 404 (Not Found), 405 (Method Not Allowed pada Vercel static), atau 5xx
  if (res.status === 404 || res.status === 405 || res.status >= 500) {
    throw new Error('BACKEND_UNAVAILABLE');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('BACKEND_UNAVAILABLE');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    throw new Error('BACKEND_UNAVAILABLE');
  }

  return data as T;
}

// === AUTH API (HYBRID: SERVER UTAMA + LOCAL CLIENT FALLBACK) ===

export async function loginApi(identifier: string, password: string, _role?: Role) {
  try {
    const data = await tryApiRequest<{ message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setAuthSession(data.token, data.user);
    return data;
  } catch (err: any) {
    // Jika error adalah pesan validasi resmi dari backend (misal kata sandi salah), lemparkan ke UI
    if (isSpecificBackendError(err)) {
      throw err;
    }

    // === FALLBACK CLIENT-SIDE ENGINE (Untuk Vercel / Mode Offline) ===
    const cleanId = String(identifier).trim().toLowerCase();
    const rawPhone = String(identifier).trim();
    const users = getLocalUsers();

    const user = users.find(
      (u) => (u.email && u.email.toLowerCase() === cleanId) || (u.phone && u.phone === rawPhone)
    );

    if (!user) {
      throw new Error('Akun dengan email atau nomor HP tersebut tidak ditemukan.');
    }

    const isValid = bcrypt.compareSync(String(password), user.passwordHash);
    if (!isValid) {
      throw new Error('Kata sandi yang Anda masukkan salah.');
    }

    const sanitizedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      vendorId: user.vendorId,
    };

    const mockToken = `ssv_token_${Date.now()}_${user.id}`;
    setAuthSession(mockToken, sanitizedUser);

    return {
      message: 'Login berhasil.',
      token: mockToken,
      user: sanitizedUser,
    };
  }
}

export async function registerApi(payload: {
  ownerName: string;
  phone: string;
  email: string;
  nik?: string;
  password: string;
  businessName: string;
  category: string;
  district: string;
  subDistrict?: string;
  address?: string;
  description?: string;
}) {
  try {
    const data = await tryApiRequest<{ message: string; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthSession(data.token, data.user);
    return data;
  } catch (err: any) {
    if (isSpecificBackendError(err)) {
      throw err;
    }

    // === FALLBACK CLIENT-SIDE ENGINE ===
    const users = getLocalUsers();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanPhone = payload.phone.trim();

    const existing = users.find(
      (u) => (u.email && u.email.toLowerCase() === cleanEmail) || (u.phone && u.phone === cleanPhone)
    );

    if (existing) {
      throw new Error('Nomor HP atau alamat email ini sudah terdaftar.');
    }

    const newUserId = `user-${Date.now()}`;
    const newVendorId = `PKL-${String(getStoredVendors().length + 1).padStart(3, '0')}`;
    const passwordHash = bcrypt.hashSync(payload.password, 8);

    const newUser: StoredUserAccount = {
      id: newUserId,
      name: payload.ownerName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'pedagang',
      vendorId: newVendorId,
      passwordHash,
    };

    saveLocalUsers([...users, newUser]);

    // Tambah data vendor ke daftar lokal
    addOrUpdateVendor({
      id: newVendorId,
      userId: newUserId,
      ownerName: payload.ownerName,
      phone: cleanPhone,
      nik: payload.nik,
      businessName: payload.businessName,
      category: payload.category,
      district: payload.district,
      subDistrict: payload.subDistrict || 'Pusat',
      address: payload.address || `Kota Bandar Lampung`,
      description: payload.description || 'Lapak PKL terdaftar di Kota Bandar Lampung.',
      status: 'menunggu',
      isPublic: false,
    });

    const sanitizedUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      vendorId: newUser.vendorId,
    };

    const mockToken = `ssv_token_${Date.now()}_${newUser.id}`;
    setAuthSession(mockToken, sanitizedUser);

    return {
      message: 'Registrasi berhasil. Akun Anda telah siap digunakan.',
      token: mockToken,
      user: sanitizedUser,
    };
  }
}

export async function fetchMeApi(): Promise<User> {
  try {
    const data = await tryApiRequest<{ user: User }>('/api/auth/me');
    updateStoredSessionUser(data.user);
    return data.user;
  } catch {
    const current = getStoredSessionUser();
    if (!current) throw new Error('Sesi tidak ditemukan.');
    return current;
  }
}

export async function changePasswordApi(oldPassword: string, newPassword: string, confirmPassword: string) {
  if (newPassword.length < 6) {
    throw new Error('Kata sandi baru minimal 6 karakter.');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('Konfirmasi kata sandi baru tidak cocok.');
  }

  try {
    return await tryApiRequest<{ message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    });
  } catch (err: any) {
    if (isSpecificBackendError(err)) {
      throw err;
    }

    // === FALLBACK CLIENT-SIDE ENGINE ===
    const currentUser = getStoredSessionUser();
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.');

    const users = getLocalUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) throw new Error('Akun tidak ditemukan.');

    const user = users[userIndex];
    const isOldValid = bcrypt.compareSync(oldPassword, user.passwordHash);
    if (!isOldValid) {
      throw new Error('Kata sandi lama yang Anda masukkan tidak sesuai.');
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 8);
    users[userIndex] = user;
    saveLocalUsers(users);

    return { message: 'Kata sandi berhasil diperbarui.' };
  }
}

export async function verifyForgotPasswordApi(email: string, phone: string, securityHint?: string) {
  try {
    return await tryApiRequest<{ message: string; resetToken: string; userName: string }>('/api/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify({ email, phone, securityHint }),
    });
  } catch (err: any) {
    if (isSpecificBackendError(err)) {
      throw err;
    }

    // === FALLBACK CLIENT-SIDE ENGINE ===
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const users = getLocalUsers();

    const user = users.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail && u.phone === cleanPhone
    );

    if (!user) {
      throw new Error('Data verifikasi tidak cocok. Periksa kembali email dan nomor HP Anda.');
    }

    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(RESET_TOKENS_KEY, JSON.stringify({ token: resetToken, userId: user.id }));
    }

    return {
      message: 'Identitas terverifikasi. Silakan masukkan kata sandi baru Anda.',
      resetToken,
      userName: user.name,
    };
  }
}

export async function resetPasswordApi(resetToken: string, newPassword: string, confirmPassword: string) {
  if (newPassword.length < 6) {
    throw new Error('Kata sandi baru minimal 6 karakter.');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('Konfirmasi kata sandi baru tidak cocok.');
  }

  try {
    return await tryApiRequest<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
    });
  } catch (err: any) {
    if (isSpecificBackendError(err)) {
      throw err;
    }

    // === FALLBACK CLIENT-SIDE ENGINE ===
    if (typeof window === 'undefined') throw new Error('Token tidak valid.');
    const raw = sessionStorage.getItem(RESET_TOKENS_KEY);
    if (!raw) throw new Error('Token reset tidak valid atau sudah kedaluwarsa.');

    const tokenData = JSON.parse(raw);
    if (tokenData.token !== resetToken) {
      throw new Error('Token reset tidak valid.');
    }

    const users = getLocalUsers();
    const userIndex = users.findIndex((u) => u.id === tokenData.userId);
    if (userIndex === -1) throw new Error('Pengguna tidak ditemukan.');

    users[userIndex].passwordHash = bcrypt.hashSync(newPassword, 8);
    saveLocalUsers(users);
    sessionStorage.removeItem(RESET_TOKENS_KEY);

    return { message: 'Kata sandi berhasil direset. Silakan login kembali dengan kata sandi baru.' };
  }
}

// === VENDORS API ===

export async function fetchVendorsApi(): Promise<Vendor[]> {
  try {
    const data = await tryApiRequest<{ vendors: Vendor[] }>('/api/vendors');
    saveVendors(data.vendors);
    return data.vendors;
  } catch {
    return getStoredVendors();
  }
}

export async function fetchMyVendorApi(): Promise<Vendor> {
  try {
    const data = await tryApiRequest<{ vendor: Vendor }>('/api/vendors/my');
    return data.vendor;
  } catch {
    const currentUser = getStoredSessionUser();
    const vendors = getStoredVendors();
    if (currentUser?.vendorId) {
      const found = vendors.find((v) => v.id === currentUser.vendorId);
      if (found) return found;
    }
    if (currentUser?.id) {
      const found = vendors.find((v) => v.userId === currentUser.id);
      if (found) return found;
    }
    return vendors[0];
  }
}

export async function updateMyVendorApi(payload: Partial<Vendor> & { resubmitRevision?: boolean }): Promise<Vendor> {
  try {
    const data = await tryApiRequest<{ message: string; vendor: Vendor }>('/api/vendors/my', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return data.vendor;
  } catch {
    const currentUser = getStoredSessionUser();
    const vendorId = currentUser?.vendorId || 'PKL-001';
    const updated = addOrUpdateVendor({
      id: vendorId,
      ...payload,
      status: payload.resubmitRevision ? 'menunggu' : undefined,
      notes: payload.resubmitRevision ? undefined : payload.notes,
    });
    return updated;
  }
}

export async function createVendorAdminApi(payload: {
  ownerName: string;
  businessName: string;
  category: string;
  district: string;
  subDistrict?: string;
  phone: string;
  address?: string;
}): Promise<Vendor> {
  try {
    const data = await tryApiRequest<{ message: string; vendor: Vendor }>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.vendor;
  } catch {
    return addOrUpdateVendor({
      ...payload,
      status: 'terverifikasi',
      isPublic: true,
    });
  }
}

export async function updateVendorStatusApi(
  id: string,
  status: VerificationStatus,
  notes?: string,
  adminName: string = 'Admin Dinas Koperasi & UMKM'
): Promise<Vendor> {
  try {
    const data = await tryApiRequest<{ message: string; vendor: Vendor }>(`/api/vendors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, adminName }),
    });
    return data.vendor;
  } catch {
    const updatedList = storeUpdateVendorStatus(id, status, notes, adminName);
    const found = updatedList.find((v) => v.id === id);
    if (!found) throw new Error('Vendor tidak ditemukan.');
    return found;
  }
}

export async function toggleVendorPublicApi(id: string): Promise<Vendor> {
  try {
    const data = await tryApiRequest<{ message: string; vendor: Vendor }>(`/api/vendors/${id}/toggle-public`, {
      method: 'PATCH',
    });
    return data.vendor;
  } catch {
    const updatedList = toggleVendorPublication(id);
    const found = updatedList.find((v) => v.id === id);
    if (!found) throw new Error('Vendor tidak ditemukan.');
    return found;
  }
}

// === CATEGORIES API ===

export async function fetchCategoriesApi(): Promise<Category[]> {
  try {
    const data = await tryApiRequest<{ categories: Category[] }>('/api/categories');
    saveCategories(data.categories);
    return data.categories;
  } catch {
    return getStoredCategories();
  }
}

export async function createCategoryApi(name: string, description: string): Promise<Category> {
  try {
    const data = await tryApiRequest<{ message: string; category: Category }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    return data.category;
  } catch {
    const list = getStoredCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      description,
    };
    saveCategories([...list, newCat]);
    return newCat;
  }
}

export async function deleteCategoryApi(id: string): Promise<void> {
  try {
    await tryApiRequest<{ message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  } catch {
    const list = getStoredCategories();
    saveCategories(list.filter((c) => c.id !== id));
  }
}
