import { User, Vendor, Category, VerificationStatus, Role } from '@/types';

const TOKEN_KEY = 'ssv_auth_token_v1';
const USER_KEY = 'ssv_current_user_v1';

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

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && path !== '/api/auth/login' && path !== '/api/auth/change-password' && !path.startsWith('/api/auth/forgot-password') && path !== '/api/auth/reset-password') {
      // Token expired or invalid on protected endpoints
      clearAuthSession();
    }
    throw new Error(data.message || `Permintaan gagal (${res.status})`);
  }

  return data as T;
}

// === AUTH API ===

export async function loginApi(identifier: string, password: string, role?: Role) {
  const data = await apiRequest<{ message: string; token: string; user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password, role }),
  });
  setAuthSession(data.token, data.user);
  return data;
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
  const data = await apiRequest<{ message: string; token: string; user: User }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setAuthSession(data.token, data.user);
  return data;
}

export async function fetchMeApi() {
  const data = await apiRequest<{ user: User }>('/api/auth/me');
  updateStoredSessionUser(data.user);
  return data.user;
}

export async function changePasswordApi(oldPassword: string, newPassword: string, confirmPassword: string) {
  return apiRequest<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  });
}

export async function verifyForgotPasswordApi(email: string, phone: string, securityHint?: string) {
  return apiRequest<{ message: string; resetToken: string; userName: string }>('/api/auth/forgot-password/verify', {
    method: 'POST',
    body: JSON.stringify({ email, phone, securityHint }),
  });
}

export async function resetPasswordApi(resetToken: string, newPassword: string, confirmPassword: string) {
  return apiRequest<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
  });
}

// === VENDORS API ===

export async function fetchVendorsApi(): Promise<Vendor[]> {
  const data = await apiRequest<{ vendors: Vendor[] }>('/api/vendors');
  return data.vendors;
}

export async function fetchMyVendorApi(): Promise<Vendor> {
  const data = await apiRequest<{ vendor: Vendor }>('/api/vendors/my');
  return data.vendor;
}

export async function updateMyVendorApi(payload: Partial<Vendor> & { resubmitRevision?: boolean }): Promise<Vendor> {
  const data = await apiRequest<{ message: string; vendor: Vendor }>('/api/vendors/my', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data.vendor;
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
  const data = await apiRequest<{ message: string; vendor: Vendor }>('/api/vendors', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.vendor;
}

export async function updateVendorStatusApi(
  id: string,
  status: VerificationStatus,
  notes?: string,
  adminName?: string
): Promise<Vendor> {
  const data = await apiRequest<{ message: string; vendor: Vendor }>(`/api/vendors/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes, adminName }),
  });
  return data.vendor;
}

export async function toggleVendorPublicApi(id: string): Promise<Vendor> {
  const data = await apiRequest<{ message: string; vendor: Vendor }>(`/api/vendors/${id}/toggle-public`, {
    method: 'PATCH',
  });
  return data.vendor;
}

// === CATEGORIES API ===

export async function fetchCategoriesApi(): Promise<Category[]> {
  const data = await apiRequest<{ categories: Category[] }>('/api/categories');
  return data.categories;
}

export async function createCategoryApi(name: string, description: string): Promise<Category> {
  const data = await apiRequest<{ message: string; category: Category }>('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return data.category;
}

export async function deleteCategoryApi(id: string): Promise<void> {
  await apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

