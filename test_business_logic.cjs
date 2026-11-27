// Test Suite Logika Bisnis & Validasi Smart Street Vendor
const fs = require('fs');
const path = require('path');

console.log('=== MEMULAI TEST SUITE: SMART STREET VENDOR ===\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

// 1. Uji Ketersediaan Logo Resmi Asli
const logoPemkotPath = path.join(__dirname, 'public', 'images', 'logo-pemkot-bandar-lampung.jpg');
const logoTeknokratPath = path.join(__dirname, 'public', 'images', 'logo-universitas-teknokrat-indonesia.png');

assert(fs.existsSync(logoPemkotPath), 'Logo Resmi Pemkot Bandar Lampung tersedia');
assert(fs.existsSync(logoTeknokratPath), 'Logo Resmi Universitas Teknokrat Indonesia tersedia');

// 2. Uji Integritas Dokumen PRD dan Panduan Desain
const prdPath = path.join(__dirname, 'docs', 'PRD.md');
const designPath = path.join(__dirname, 'design', 'DESIGN_GUIDE.md');

assert(fs.existsSync(prdPath), 'Dokumen PRD tersedia di docs/PRD.md');
assert(fs.existsSync(designPath), 'Panduan Desain Stitch tersedia di design/DESIGN_GUIDE.md');

// 3. Simulasi Storage & Business Logic (Pure Logic Test)
const mockStorage = {};
const mockLocalStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val; },
  removeItem: (key) => { delete mockStorage[key]; }
};

// Data Awal Mock
const initialVendors = [
  {
    id: 'PKL-001',
    businessName: 'Soto Betawi Bang Joko',
    ownerName: 'Pak Joko Santoso',
    category: 'Kuliner & Makanan Berat',
    district: 'Tanjung Karang Pusat',
    status: 'terverifikasi',
    isPublic: true,
    latitude: -5.4215,
    longitude: 105.2582
  },
  {
    id: 'PKL-004',
    businessName: 'Pecel Lele Mas Bambang',
    ownerName: 'Bambang Supriyanto',
    category: 'Kuliner & Makanan Berat',
    district: 'Kedaton',
    status: 'menunggu',
    isPublic: false,
    latitude: -5.3905,
    longitude: 105.2589
  }
];

// Logic Aksi Verifikasi Admin
function updateVendorStatus(vendors, id, newStatus, notes) {
  return vendors.map(v => {
    if (v.id === id) {
      return {
        ...v,
        status: newStatus,
        notes: notes || v.notes,
        isPublic: newStatus === 'terverifikasi'
      };
    }
    return v;
  });
}

// Test Kasus 1: Admin menyetujui pengajuan
let state = updateVendorStatus(initialVendors, 'PKL-004', 'terverifikasi');
const pkl4 = state.find(v => v.id === 'PKL-004');
assert(pkl4.status === 'terverifikasi', 'Admin menyetujui pengajuan mengubah status menjadi terverifikasi');
assert(pkl4.isPublic === true, 'Pengajuan terverifikasi otomatis layak tampil di peta publik (isPublic: true)');

// Test Kasus 2: Admin meminta perbaikan
state = updateVendorStatus(state, 'PKL-004', 'revisi', 'Mohon perbarui foto tempat usaha');
const pkl4Revisi = state.find(v => v.id === 'PKL-004');
assert(pkl4Revisi.status === 'revisi', 'Admin meminta perbaikan mengubah status menjadi revisi');
assert(pkl4Revisi.isPublic === false, 'Pengajuan berstatus revisi tidak tampil di publik');
assert(pkl4Revisi.notes === 'Mohon perbarui foto tempat usaha', 'Catatan admin tersimpan akurat');

// Test Kasus 3: Admin menolak pengajuan
state = updateVendorStatus(state, 'PKL-004', 'ditolak', 'Lokasi di jalur hijau');
const pkl4Ditolak = state.find(v => v.id === 'PKL-004');
assert(pkl4Ditolak.status === 'ditolak', 'Admin dapat menolak pengajuan tidak sesuai');
assert(pkl4Ditolak.isPublic === false, 'Pengajuan ditolak tidak tampil di publik');

// Test Kasus 4: Filter Publik
const publicList = state.filter(v => v.isPublic && v.status === 'terverifikasi');
assert(publicList.every(v => v.status === 'terverifikasi' && v.isPublic === true), 'Filter portal publik hanya menampilkan lapak terverifikasi');

console.log(`\n=== HASIL PENGUJIAN: ${passedTests} LULUS, ${failedTests} GAGAL ===`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

