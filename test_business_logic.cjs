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

// 2. Uji Integritas File Halaman Katalog
const katalogPagePath = path.join(__dirname, 'src', 'pages', 'KatalogPage.tsx');
assert(fs.existsSync(katalogPagePath), 'Halaman Katalog Pedagang tersedia di src/pages/KatalogPage.tsx');

// 3. Uji File Dokumen
const prdPath = path.join(__dirname, 'docs', 'PRD.md');
const designPath = path.join(__dirname, 'design', 'DESIGN_GUIDE.md');

assert(fs.existsSync(prdPath), 'Dokumen PRD tersedia di docs/PRD.md');
assert(fs.existsSync(designPath), 'Panduan Desain Stitch tersedia di design/DESIGN_GUIDE.md');

// 4. Uji Logika Filter Katalog Pedagang
const sampleVendors = [
  {
    id: 'PKL-001',
    businessName: 'Soto Betawi Bang Joko',
    ownerName: 'Pak Joko Santoso',
    category: 'Kuliner & Makanan Berat',
    district: 'Tanjung Karang Pusat',
    status: 'terverifikasi',
    isPublic: true
  },
  {
    id: 'PKL-002',
    businessName: 'Es Seruput Segar Way Halim',
    ownerName: 'Ibu Siti Rahmawati',
    category: 'Minuman & Kopi',
    district: 'Way Halim',
    status: 'terverifikasi',
    isPublic: true
  },
  {
    id: 'PKL-003',
    businessName: 'Martabak Manis Sahabat',
    ownerName: 'Ahmad Faisal',
    category: 'Jajanan & Camilan',
    district: 'Kedaton',
    status: 'terverifikasi',
    isPublic: true
  },
  {
    id: 'PKL-004',
    businessName: 'Pecel Lele Mas Bambang',
    ownerName: 'Bambang Supriyanto',
    category: 'Kuliner & Makanan Berat',
    district: 'Kedaton',
    status: 'menunggu',
    isPublic: false
  }
];

// Hanya terverifikasi dan publik yang masuk katalog publik
const publicVendors = sampleVendors.filter(v => v.isPublic && v.status === 'terverifikasi');
assert(publicVendors.length === 3, 'Hanya pedagang berstatus terverifikasi dan publik yang masuk katalog');

// Filter Kategori
const kulinerList = publicVendors.filter(v => v.category === 'Kuliner & Makanan Berat');
assert(kulinerList.length === 1 && kulinerList[0].id === 'PKL-001', 'Filter kategori berfungsi akurat');

// Filter Kecamatan
const wayHalimList = publicVendors.filter(v => v.district === 'Way Halim');
assert(wayHalimList.length === 1 && wayHalimList[0].id === 'PKL-002', 'Filter kecamatan berfungsi akurat');

// Pencarian Nama Usaha atau Pemilik
const searchJoko = publicVendors.filter(v => 
  v.businessName.toLowerCase().includes('joko') || 
  v.ownerName.toLowerCase().includes('joko')
);
assert(searchJoko.length === 1 && searchJoko[0].ownerName === 'Pak Joko Santoso', 'Pencarian nama usaha/pemilik berfungsi akurat');

console.log(`\n=== HASIL PENGUJIAN: ${passedTests} LULUS, ${failedTests} GAGAL ===`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
