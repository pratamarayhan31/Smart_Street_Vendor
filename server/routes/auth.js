import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne, queryAll, runSql, runTransaction } from '../db.js';
import { requireAuth, signAuthToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

function sanitizeUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    vendorId: u.vendor_id || undefined,
  };
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { identifier, password, role } = req.body || {};

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email / Nomor HP dan Kata Sandi wajib diisi.' });
  }

  const cleanId = String(identifier).trim().toLowerCase();
  const rawPhone = String(identifier).trim();

  const user = queryOne(
    'SELECT * FROM users WHERE LOWER(email) = ? OR phone = ?',
    [cleanId, rawPhone]
  );

  if (!user) {
    return res.status(401).json({
      message: 'Akun dengan email atau nomor HP tersebut tidak ditemukan.',
    });
  }

  const isPasswordValid = bcrypt.compareSync(String(password), user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Kata sandi yang Anda masukkan salah.',
    });
  }

  const token = signAuthToken(user);
  return res.json({
    message: 'Login berhasil.',
    token,
    user: sanitizeUser(user),
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const {
    ownerName,
    phone,
    email,
    nik,
    password,
    businessName,
    category,
    district,
    subDistrict,
    address,
    description,
  } = req.body || {};

  if (!ownerName || !phone || !password || !businessName || !category || !district) {
    return res.status(400).json({
      message: 'Nama pemilik, nomor HP, kata sandi, nama usaha, kategori, dan kecamatan wajib diisi.',
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Kata sandi minimal 6 karakter.' });
  }

  const cleanPhone = String(phone).trim();
  const cleanEmail = String(email || `${cleanPhone}@pkl-lampung.id`).trim().toLowerCase();

  const existing = queryOne(
    'SELECT id FROM users WHERE LOWER(email) = ? OR phone = ?',
    [cleanEmail, cleanPhone]
  );
  if (existing) {
    return res.status(409).json({
      message: 'Email atau Nomor HP sudah terdaftar. Silakan gunakan data lain atau masuk ke akun Anda.',
    });
  }

  const now = new Date().toISOString();
  const allVendors = queryAll('SELECT id FROM vendors');
  const nextNum = allVendors.length + 1;
  const vendorId = `PKL-${String(nextNum).padStart(3, '0')}-${Date.now().toString().slice(-3)}`;
  const userId = `user-${Date.now()}`;
  const passwordHash = bcrypt.hashSync(String(password), 10);

  const created = runTransaction(() => {
    runSql(
      `INSERT INTO vendors (
        id, user_id, nik, owner_name, phone, business_name, category, description,
        operating_hours, address, district, sub_district, latitude, longitude,
        photo_url, status, is_public, notes, submitted_at, verified_at, verified_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendorId,
        userId,
        nik ? String(nik).trim() : null,
        String(ownerName).trim(),
        cleanPhone,
        String(businessName).trim(),
        String(category).trim(),
        description || `Usaha ${category} oleh ${ownerName}. Menyediakan produk berkualitas.`,
        '16:00 - 22:00 WIB',
        address || `Jl. Protokol ${district}, Bandar Lampung`,
        String(district).trim(),
        subDistrict || 'Kelurahan',
        -5.4297,
        105.2625,
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        'menunggu',
        0,
        null,
        now,
        null,
        null,
      ],
      false
    );

    runSql(
      `INSERT INTO users (id, name, email, phone, password_hash, role, vendor_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pedagang', ?, ?, ?)`,
      [userId, String(ownerName).trim(), cleanEmail, cleanPhone, passwordHash, vendorId, now, now],
      false
    );

    return queryOne('SELECT * FROM users WHERE id = ?', [userId]);
  });

  const token = signAuthToken(created);
  return res.status(201).json({
    message: 'Pendaftaran akun dan usaha PKL berhasil!',
    token,
    user: sanitizeUser(created),
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = queryOne('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ message: 'Akun tidak ditemukan.' });
  }
  return res.json({ user: sanitizeUser(user) });
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body || {};

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Seluruh kolom kata sandi wajib diisi.' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: 'Kata sandi baru minimal 6 karakter.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Konfirmasi kata sandi baru tidak cocok.' });
  }

  if (newPassword === oldPassword) {
    return res.status(400).json({ message: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.' });
  }

  const user = queryOne('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ message: 'Akun tidak ditemukan.' });
  }

  const isOldValid = bcrypt.compareSync(String(oldPassword), user.password_hash);
  if (!isOldValid) {
    return res.status(401).json({ message: 'Kata sandi lama tidak sesuai.' });
  }

  const newHash = bcrypt.hashSync(String(newPassword), 10);
  runSql('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [
    newHash,
    new Date().toISOString(),
    user.id,
  ]);

  return res.json({
    message: 'Kata sandi berhasil diperbarui! Gunakan kata sandi baru untuk login berikutnya.',
  });
});

// POST /api/auth/forgot-password/verify
router.post('/forgot-password/verify', (req, res) => {
  const { email, phone, securityHint } = req.body || {};

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email dan Nomor HP terdaftar wajib diisi.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(phone).trim();

  const user = queryOne(
    'SELECT * FROM users WHERE LOWER(email) = ? AND phone = ?',
    [cleanEmail, cleanPhone]
  );

  if (!user) {
    return res.status(404).json({
      message: 'Kombinasi Email dan Nomor HP tidak cocok dengan akun manapun.',
    });
  }

  // Untuk pedagang, verifikasi tambahan menggunakan NIK atau Nama Usaha jika tersedia
  if (user.role === 'pedagang' && user.vendor_id) {
    const vendor = queryOne('SELECT nik, business_name FROM vendors WHERE id = ?', [user.vendor_id]);
    const hint = String(securityHint || '').trim().toLowerCase();
    if (!hint) {
      return res.status(400).json({
        message: 'Masukkan Nama Usaha atau NIK terdaftar untuk verifikasi keamanan akun pedagang.',
      });
    }
    const matchesBusiness = vendor?.business_name?.toLowerCase() === hint;
    const matchesNik = vendor?.nik && vendor.nik.toLowerCase() === hint;
    if (!matchesBusiness && !matchesNik) {
      return res.status(401).json({
        message: 'Nama Usaha atau NIK tidak sesuai dengan data akun terdaftar.',
      });
    }
  }

  const resetToken = jwt.sign(
    { id: user.id, purpose: 'password-reset' },
    JWT_SECRET,
    { expiresIn: '10m' }
  );

  return res.json({
    message: 'Identitas terverifikasi. Silakan buat kata sandi baru Anda.',
    resetToken,
    userName: user.name,
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body || {};

  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Token reset dan kata sandi baru wajib diisi.' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: 'Kata sandi baru minimal 6 karakter.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Konfirmasi kata sandi baru tidak cocok.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Token reset sudah kadaluarsa atau tidak valid. Silakan ulangi verifikasi.' });
  }

  if (decoded.purpose !== 'password-reset' || !decoded.id) {
    return res.status(401).json({ message: 'Token reset tidak valid.' });
  }

  const newHash = bcrypt.hashSync(String(newPassword), 10);
  runSql('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?', [
    newHash,
    new Date().toISOString(),
    decoded.id,
  ]);

  return res.json({
    message: 'Kata sandi berhasil direset! Silakan login menggunakan kata sandi baru Anda.',
  });
});

export default router;

