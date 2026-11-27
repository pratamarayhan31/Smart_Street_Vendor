import express from 'express';
import { queryAll, queryOne, runSql, mapVendorRow } from '../db.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/vendors - publik bisa membaca daftar lapak, NIK hanya dibuka untuk Admin atau pemilik sendiri
router.get('/', optionalAuth, (req, res) => {
  const rows = queryAll('SELECT * FROM vendors ORDER BY submitted_at DESC');
  const isAdmin = req.user?.role === 'admin';
  const currentVendorId = req.user?.vendorId;

  const vendors = rows.map((row) => {
    const mapped = mapVendorRow(row);
    if (!isAdmin && mapped.id !== currentVendorId) {
      delete mapped.nik;
    }
    return mapped;
  });

  return res.json({ vendors });
});

// GET /api/vendors/my - khusus pedagang yang sedang login
router.get('/my', requireAuth, requireRole('pedagang'), (req, res) => {
  if (!req.user.vendorId) {
    return res.status(404).json({ message: 'Data lapak untuk akun ini tidak ditemukan.' });
  }
  const row = queryOne('SELECT * FROM vendors WHERE id = ?', [req.user.vendorId]);
  if (!row) {
    return res.status(404).json({ message: 'Lapak tidak ditemukan.' });
  }
  return res.json({ vendor: mapVendorRow(row) });
});

// PUT /api/vendors/my - pedagang memperbarui profil, lokasi, atau konfirmasi revisi miliknya sendiri
router.put('/my', requireAuth, requireRole('pedagang'), (req, res) => {
  const vendorId = req.user.vendorId;
  if (!vendorId) {
    return res.status(404).json({ message: 'Akun pedagang ini belum terhubung ke data lapak.' });
  }

  const existing = queryOne('SELECT * FROM vendors WHERE id = ?', [vendorId]);
  if (!existing) {
    return res.status(404).json({ message: 'Data lapak tidak ditemukan.' });
  }

  const body = req.body || {};
  const now = new Date().toISOString();

  const updatedOwner = body.ownerName !== undefined ? body.ownerName : existing.owner_name;
  const updatedPhone = body.phone !== undefined ? body.phone : existing.phone;
  const updatedNik = body.nik !== undefined ? body.nik : existing.nik;
  const updatedBusiness = body.businessName !== undefined ? body.businessName : existing.business_name;
  const updatedCategory = body.category !== undefined ? body.category : existing.category;
  const updatedDesc = body.description !== undefined ? body.description : existing.description;
  const updatedHours = body.operatingHours !== undefined ? body.operatingHours : existing.operating_hours;
  const updatedAddress = body.address !== undefined ? body.address : existing.address;
  const updatedDistrict = body.district !== undefined ? body.district : existing.district;
  const updatedSubDistrict = body.subDistrict !== undefined ? body.subDistrict : existing.sub_district;
  const updatedLat = body.latitude !== undefined ? Number(body.latitude) : existing.latitude;
  const updatedLng = body.longitude !== undefined ? Number(body.longitude) : existing.longitude;
  const updatedPhoto = body.photoUrl !== undefined ? body.photoUrl : existing.photo_url;

  // Jika pedagang mengirim ulang revisi atau mengubah data penting, status kembali menunggu peninjauan
  const nextStatus = body.resubmitRevision ? 'menunggu' : 'menunggu';
  const nextNotes = body.resubmitRevision ? null : existing.notes;

  runSql(
    `UPDATE vendors SET
      owner_name = ?, phone = ?, nik = ?, business_name = ?, category = ?,
      description = ?, operating_hours = ?, address = ?, district = ?, sub_district = ?,
      latitude = ?, longitude = ?, photo_url = ?, status = ?, notes = ?, submitted_at = ?
     WHERE id = ?`,
    [
      updatedOwner,
      updatedPhone,
      updatedNik,
      updatedBusiness,
      updatedCategory,
      updatedDesc,
      updatedHours,
      updatedAddress,
      updatedDistrict,
      updatedSubDistrict,
      updatedLat,
      updatedLng,
      updatedPhoto,
      nextStatus,
      nextNotes,
      now,
      vendorId,
    ]
  );

  // Sinkronkan nama pemilik ke tabel users jika berubah
  if (body.ownerName) {
    runSql('UPDATE users SET name = ?, updated_at = ? WHERE id = ?', [
      body.ownerName,
      now,
      req.user.id,
    ]);
  }

  const updatedRow = queryOne('SELECT * FROM vendors WHERE id = ?', [vendorId]);
  return res.json({
    message: 'Data usaha berhasil diperbarui.',
    vendor: mapVendorRow(updatedRow),
  });
});

// POST /api/vendors - Admin menambah data pedagang langsung
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const {
    ownerName,
    businessName,
    category,
    district,
    subDistrict,
    phone,
    address,
  } = req.body || {};

  if (!ownerName || !businessName || !category || !district || !phone) {
    return res.status(400).json({ message: 'Data wajib pedagang belum lengkap.' });
  }

  const now = new Date().toISOString();
  const allVendors = queryAll('SELECT id FROM vendors');
  const newId = `PKL-${String(allVendors.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-3)}`;

  runSql(
    `INSERT INTO vendors (
      id, user_id, nik, owner_name, phone, business_name, category, description,
      operating_hours, address, district, sub_district, latitude, longitude,
      photo_url, status, is_public, notes, submitted_at, verified_at, verified_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newId,
      req.user.id,
      null,
      String(ownerName).trim(),
      String(phone).trim(),
      String(businessName).trim(),
      String(category).trim(),
      `Usaha ${category} oleh ${ownerName}.`,
      '16:00 - 22:00 WIB',
      address || `Jl. Utama ${district}`,
      String(district).trim(),
      subDistrict || 'Pusat',
      -5.4297,
      105.2625,
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      'terverifikasi',
      1,
      null,
      now,
      now,
      'Admin Dinas Koperasi & UMKM',
    ]
  );

  const created = queryOne('SELECT * FROM vendors WHERE id = ?', [newId]);
  return res.status(201).json({
    message: 'Data pedagang berhasil ditambahkan.',
    vendor: mapVendorRow(created),
  });
});

// PATCH /api/vendors/:id/status - Admin memverifikasi / meminta revisi / menolak
router.patch('/:id/status', requireAuth, requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { status, notes, adminName } = req.body || {};

  const allowed = ['menunggu', 'ditinjau', 'revisi', 'terverifikasi', 'ditolak'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Status verifikasi tidak valid.' });
  }

  const existing = queryOne('SELECT * FROM vendors WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Data pedagang tidak ditemukan.' });
  }

  const now = new Date().toISOString();
  const isPublic = status === 'terverifikasi' ? 1 : 0;
  const nextNotes = notes !== undefined ? notes : existing.notes;
  const verifier = adminName || 'Admin Dinas Koperasi & UMKM';

  runSql(
    `UPDATE vendors SET status = ?, notes = ?, is_public = ?, verified_at = ?, verified_by = ? WHERE id = ?`,
    [status, nextNotes, isPublic, now, verifier, id]
  );

  const updated = queryOne('SELECT * FROM vendors WHERE id = ?', [id]);
  return res.json({
    message: 'Status pengajuan berhasil diperbarui.',
    vendor: mapVendorRow(updated),
  });
});

// PATCH /api/vendors/:id/toggle-public - Admin ubah visibilitas publik
router.patch('/:id/toggle-public', requireAuth, requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const existing = queryOne('SELECT * FROM vendors WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ message: 'Data pedagang tidak ditemukan.' });
  }

  const nextPublic = existing.is_public ? 0 : 1;
  runSql('UPDATE vendors SET is_public = ? WHERE id = ?', [nextPublic, id]);

  const updated = queryOne('SELECT * FROM vendors WHERE id = ?', [id]);
  return res.json({
    message: 'Status publikasi diperbarui.',
    vendor: mapVendorRow(updated),
  });
});

export default router;

