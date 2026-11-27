import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.sqlite');

let db = null;

export function persistDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export function runSql(sql, params = [], autoPersist = true) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  if (autoPersist) persistDb();
}

export function runTransaction(fn) {
  db.run('BEGIN TRANSACTION;');
  try {
    const result = fn();
    db.run('COMMIT;');
    persistDb();
    return result;
  } catch (err) {
    db.run('ROLLBACK;');
    throw err;
  }
}

export async function initDatabase() {
  if (db) return db;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'pedagang')),
      vendor_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      nik TEXT,
      owner_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      business_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      operating_hours TEXT NOT NULL,
      address TEXT NOT NULL,
      district TEXT NOT NULL,
      sub_district TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      photo_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'menunggu',
      is_public INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      submitted_at TEXT NOT NULL,
      verified_at TEXT,
      verified_by TEXT
    );
  `);

  // Seed initial data if empty
  const catCount = queryOne('SELECT COUNT(*) as cnt FROM categories');
  if (!catCount || catCount.cnt === 0) {
    const initialCategories = [
      { id: 'kuliner', name: 'Kuliner & Makanan Berat', description: 'Nasi goreng, pecel lele, mie ayam, sate padang, soto, dll.' },
      { id: 'minuman', name: 'Minuman & Kopi', description: 'Es teh, jus buah, kopi keliling, es doger, boba, dll.' },
      { id: 'jajanan', name: 'Jajanan & Camilan', description: 'Gorengan, martabak, pentol, cilok, tela-tela, batagor, dll.' },
      { id: 'buah', name: 'Buah & Hasil Tani', description: 'Pedagang buah potong, buah segar, hasil bumi musiman.' },
      { id: 'fashion', name: 'Pakaian & Sandang', description: 'Kaos, pakaian harian, topi, alas kaki, jilbab.' },
      { id: 'jasa', name: 'Jasa & Aksesoris', description: 'Sol sepatu, servis jam, aksesoris hp, kacamata, stiker.' },
    ];
    for (const c of initialCategories) {
      runSql('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [c.id, c.name, c.description], false);
    }
  }

  const vendorCount = queryOne('SELECT COUNT(*) as cnt FROM vendors');
  if (!vendorCount || vendorCount.cnt === 0) {
    const initialVendors = [
      {
        id: 'PKL-001', user_id: 'user-pkl-1', nik: '1871012304850001', owner_name: 'Pak Joko Santoso',
        phone: '081278912345', business_name: 'Soto Betawi Bang Joko', category: 'Kuliner & Makanan Berat',
        description: 'Soto betawi kuah susu & santan gurih dengan daging sapi segar dan emping melinjo renyah khas Bandar Lampung.',
        operating_hours: '16:00 - 23:00 WIB', address: 'Jl. R.A. Kartini No. 45 (Depan Apotek Enggal)',
        district: 'Tanjung Karang Pusat', sub_district: 'Palapa', latitude: -5.4215, longitude: 105.2582,
        photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi', is_public: 1, notes: null, submitted_at: '2026-11-10T14:20:00Z',
        verified_at: '2026-11-12T09:15:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
      {
        id: 'PKL-002', user_id: 'user-pkl-2', nik: '1871021508900003', owner_name: 'Ibu Siti Rahmawati',
        phone: '085376543210', business_name: 'Es Seruput Segar Way Halim', category: 'Minuman & Kopi',
        description: 'Menjual aneka racikan es tebu murni, es kelapa muda gula aren, dan es kuwut Bali segar.',
        operating_hours: '10:00 - 18:00 WIB', address: 'Jl. Ki Maja (Samping Lapangan Way Halim)',
        district: 'Way Halim', sub_district: 'Perumnas Way Halim', latitude: -5.3942, longitude: 105.2715,
        photo_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi', is_public: 1, notes: null, submitted_at: '2026-11-12T11:00:00Z',
        verified_at: '2026-11-13T10:00:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
      {
        id: 'PKL-003', user_id: 'user-pkl-3', nik: '1871041103880002', owner_name: 'Ahmad Faisal',
        phone: '082199887766', business_name: 'Martabak Manis & Telur Sahabat', category: 'Jajanan & Camilan',
        description: 'Martabak bangka lembut dengan aneka topping keju, coklat, kacang, dan martabak telur daging cincang tebal.',
        operating_hours: '17:00 - 24:00 WIB', address: 'Jl. Z.A. Pagar Alam No. 12 (Dekat Kampus Teknokrat)',
        district: 'Kedaton', sub_district: 'Kedaton', latitude: -5.3789, longitude: 105.2536,
        photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi', is_public: 1, notes: null, submitted_at: '2026-11-15T15:30:00Z',
        verified_at: '2026-11-16T13:45:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
      {
        id: 'PKL-004', user_id: 'user-pkl-4', nik: '1871052007920005', owner_name: 'Bambang Supriyanto',
        phone: '081366554433', business_name: 'Pecel Lele & Ayam Penyet Mas Bambang', category: 'Kuliner & Makanan Berat',
        description: 'Pecel lele goreng garing, bebek goreng renyah dengan sambal terasi lamongan pedas nampol khas tenda kaki lima.',
        operating_hours: '17:30 - 01:00 WIB', address: 'Jl. Teuku Umar No. 88',
        district: 'Kedaton', sub_district: 'Sidodadi', latitude: -5.3905, longitude: 105.2589,
        photo_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
        status: 'menunggu', is_public: 0, notes: null, submitted_at: '2026-11-25T16:00:00Z',
        verified_at: null, verified_by: null,
      },
      {
        id: 'PKL-005', user_id: 'user-pkl-5', nik: '1871060904830004', owner_name: 'Iskandar Muda',
        phone: '085211223344', business_name: 'Kopi Tarik & Roti Bakar Aceh', category: 'Minuman & Kopi',
        description: 'Kopi saring tubruk aceh asli, teh tarik buih melimpah, dan roti bakar srikaya pandan.',
        operating_hours: '15:00 - 02:00 WIB', address: 'Jl. Wolter Monginsidi No. 19',
        district: 'Teluk Betung Utara', sub_district: 'Kupang Teba', latitude: -5.4389, longitude: 105.2638,
        photo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        status: 'revisi', is_public: 0,
        notes: 'Mohon perbarui foto lapak agar terlihat papan nama usaha dan tampak depan tempat berjualan dengan jelas.',
        submitted_at: '2026-11-20T10:15:00Z', verified_at: '2026-11-21T14:00:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
      {
        id: 'PKL-006', user_id: 'user-pkl-6', nik: '1871071801890001', owner_name: 'Dedi Kurniawan',
        phone: '089612345678', business_name: 'Gorengan Renyah Mas Dedi', category: 'Jajanan & Camilan',
        description: 'Tahu jeletot pedas, bakwan sayur renyah, pisang goreng tanduk, dan tempe mendoan hangat setiap sore.',
        operating_hours: '14:00 - 21:00 WIB', address: 'Jl. Raden Intan (Dekat Bundaran Gajah / Tugu Adipura)',
        district: 'Enggal', sub_district: 'Enggal', latitude: -5.4248, longitude: 105.2608,
        photo_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi', is_public: 1, notes: null, submitted_at: '2026-11-18T13:00:00Z',
        verified_at: '2026-11-19T10:30:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
      {
        id: 'PKL-007', user_id: 'user-pkl-7', nik: '1871082205950007', owner_name: 'Hendra Gunawan',
        phone: '087799001122', business_name: 'Kacamata & Aksesoris Trendi Lapangan Merah', category: 'Jasa & Aksesoris',
        description: 'Menjual kacamata hitam gaya, tali kacamata, dompet, dan aksesoris harian pria & wanita.',
        operating_hours: '16:00 - 22:00 WIB', address: 'Jl. Jendral Sudirman No. 34',
        district: 'Enggal', sub_district: 'Pahoman', latitude: -5.4321, longitude: 105.2674,
        photo_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
        status: 'ditolak', is_public: 0,
        notes: 'Titik koordinat berada di bahu jalan protokol yang terlarang untuk lapak permanen. Silakan ajukan di zona binaan.',
        submitted_at: '2026-11-17T09:00:00Z', verified_at: '2026-11-18T11:00:00Z', verified_by: 'Admin Satpol PP / Bappeda',
      },
      {
        id: 'PKL-008', user_id: 'user-pkl-8', nik: '1871091402800008', owner_name: 'Ibu Ratna Juwita',
        phone: '081298765432', business_name: 'Buah Segar Potong Bu Ratna', category: 'Buah & Hasil Tani',
        description: 'Semangka merah, melon, pepaya California manis dingin, dan nanas madu siap santap higienis.',
        operating_hours: '09:00 - 17:00 WIB', address: 'Jl. Pangeran Antasari No. 71',
        district: 'Kedamaian', sub_district: 'Kedamaian', latitude: -5.4098, longitude: 105.2795,
        photo_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
        status: 'terverifikasi', is_public: 1, notes: null, submitted_at: '2026-11-19T10:00:00Z',
        verified_at: '2026-11-20T11:15:00Z', verified_by: 'Admin Dinas Koperasi & UMKM',
      },
    ];

    for (const v of initialVendors) {
      runSql(
        `INSERT INTO vendors (
          id, user_id, nik, owner_name, phone, business_name, category, description,
          operating_hours, address, district, sub_district, latitude, longitude,
          photo_url, status, is_public, notes, submitted_at, verified_at, verified_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          v.id, v.user_id, v.nik, v.owner_name, v.phone, v.business_name, v.category, v.description,
          v.operating_hours, v.address, v.district, v.sub_district, v.latitude, v.longitude,
          v.photo_url, v.status, v.is_public, v.notes, v.submitted_at, v.verified_at, v.verified_by,
        ],
        false
      );
    }
  }

  const userCount = queryOne('SELECT COUNT(*) as cnt FROM users');
  if (!userCount || userCount.cnt === 0) {
    const now = new Date().toISOString();
    const adminHash = bcrypt.hashSync('admin123', 10);
    const vendorHash = bcrypt.hashSync('password123', 10);

    const initialUsers = [
      { id: 'admin-1', name: 'Petugas Administrator Pemkot', email: 'admin@bandarlampungkota.go.id', phone: '081122334455', password_hash: adminHash, role: 'admin', vendor_id: null },
      { id: 'user-pkl-1', name: 'Pak Joko Santoso', email: 'joko@gmail.com', phone: '081278912345', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-001' },
      { id: 'user-pkl-2', name: 'Ibu Siti Rahmawati', email: 'siti@gmail.com', phone: '085376543210', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-002' },
      { id: 'user-pkl-3', name: 'Ahmad Faisal', email: 'faisal@gmail.com', phone: '082199887766', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-003' },
      { id: 'user-pkl-4', name: 'Bambang Supriyanto', email: 'bambang@gmail.com', phone: '081366554433', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-004' },
      { id: 'user-pkl-5', name: 'Iskandar Muda', email: 'iskandar@gmail.com', phone: '085211223344', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-005' },
      { id: 'user-pkl-6', name: 'Dedi Kurniawan', email: 'dedi@gmail.com', phone: '089612345678', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-006' },
      { id: 'user-pkl-7', name: 'Hendra Gunawan', email: 'hendra@gmail.com', phone: '087799001122', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-007' },
      { id: 'user-pkl-8', name: 'Ibu Ratna Juwita', email: 'ratna@gmail.com', phone: '081298765432', password_hash: vendorHash, role: 'pedagang', vendor_id: 'PKL-008' },
    ];

    for (const u of initialUsers) {
      runSql(
        `INSERT INTO users (id, name, email, phone, password_hash, role, vendor_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.vendor_id, now, now],
        false
      );
    }
  }

  persistDb();
  return db;
}

export function mapVendorRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    nik: row.nik || undefined,
    ownerName: row.owner_name,
    phone: row.phone,
    businessName: row.business_name,
    category: row.category,
    description: row.description,
    operatingHours: row.operating_hours,
    address: row.address,
    district: row.district,
    subDistrict: row.sub_district,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    photoUrl: row.photo_url,
    status: row.status,
    isPublic: Boolean(row.is_public),
    notes: row.notes || undefined,
    submittedAt: row.submitted_at,
    verifiedAt: row.verified_at || undefined,
    verifiedBy: row.verified_by || undefined,
  };
}

