# Smart Street Vendor (Kota Bandar Lampung)

**Sistem Informasi Pendataan, Verifikasi, dan Pemetaan Spasial Pedagang Kaki Lima Berbasis Web**

Proyek kolaborasi riset dan pengabdian masyarakat antara **Pemerintah Kota Bandar Lampung** dan **Universitas Teknokrat Indonesia**.

---

## 🌟 Ringkasan Aplikasi

Smart Street Vendor dibangun berdasarkan **Product Requirements Document (PRD v1.0)** dengan standar UI/UX modern, profesional, dan responsif:
- **Design System Profesional**: Palet warna elegan Merah Utama (`#C62828`), Merah Sekunder (`#E04444`), Putih (`#FFFFFF`), Biru Muda (`#DCEEFF`), dan Biru Sangat Muda (`#F2F8FF`), dengan tipografi yang bersih dan nyaman dibaca.
- **Dua Logo Resmi Institusi**: Terintegrasi proporsional tanpa distorsi pada navigasi header, footer, dan modul dashboard:
  1. *Logo Pemerintah Kota Bandar Lampung*
  2. *Logo Universitas Teknokrat Indonesia*
- **Autentikasi Penuh & Aman (Fullstack Security)**:
  - Database lokal SQLite (`sql.js`) dengan penyimpanan data terenkripsi.
  - Hashing kata sandi satu arah dengan algoritma `bcryptjs`.
  - Token sesi digital berbasis JSON Web Token (JWT) 24 jam.
  - Validasi ketat pada saat login (menolak akun fiktif atau kata sandi yang salah).
  - Fitur registrasi pedagang baru langsung terhubung ke database.
  - Fitur **Ganti Kata Sandi** (*Change Password*) dan **Lupa Kata Sandi** (*Reset Password*).
  - Proteksi rute halaman (*Protected Routes*) berdasarkan peran (Admin vs Pedagang).
- **Peta Spasial Digital**: Menggunakan OpenStreetMap (OSM) dan Leaflet.js dengan titik penanda bulat (*circular pin*) berikon rumah putih dan warna status terstandar:
  - 🟢 **Hijau (`#16A34A`)**: Lapak Disetujui / Terverifikasi.
  - 🟡 **Kuning (`#EAB308`)**: Lapak Menunggu Pemeriksaan.
  - 🔴 **Merah (`#DC2626`)**: Lapak Ditolak / Non-Zonasi.
- **Katalog Pedagang Lengkap**: Halaman eksplorasi PKL dengan pencarian nama usaha, filter kategori, filter kecamatan, pengurutan, pagination responsif, dan modal rincian pedagang.
- **Manajemen Alur Verifikasi Data**: Alur status verifikasi (*Menunggu Verifikasi*, *Sedang Ditinjau*, *Perlu Perbaikan*, *Terverifikasi*, *Ditolak*) dengan fitur catatan perbaikan dari admin.
- **Perlindungan Privasi**: Data sensitif seperti NIK pedagang dirahasiakan dari publik dan hanya dapat diakses oleh petugas admin dinas terkait.

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Menjalankan Mode Development (Frontend + Backend Sekaligus)
Buka terminal di folder proyek ini dan jalankan:
```bash
npm run dev
```
Perintah ini akan secara otomatis menyalakan:
- **Server Backend API (Express + SQLite):** `http://localhost:4000`
- **Aplikasi Web Frontend (Vite + React):** `http://localhost:3000`

Buka browser Anda di `http://localhost:3000`.

### 2. Membangun Versi Produksi
```bash
npm run build
npm run preview
```

---

## 🔐 Kredensial Akun untuk Pengujian Sistem

| Peran | Identifier (Email / No. HP) | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| **Admin Pemkot** | `admin@bandarlampungkota.go.id` | `admin123` | Dashboard Command Center, Verifikasi Berkas Pengajuan, Master Data PKL, Manajemen Kategori, Peta Pantau, Laporan Rekapitulasi & Cetak/CSV. |
| **Pedagang Terdaftar** | `081278912345` *(atau `joko@gmail.com`)* | `password123` | Dashboard Lapak Mandiri, Perbarui Profil Usaha & Foto, Penyesuaian Titik Pin Peta (GPS), Kirim Catatan Revisi, Ganti Kata Sandi. |
| **Pedagang Baru** | Daftar mandiri melalui menu **"Daftar Usaha Baru"** di `/register` | Dibuat saat registrasi | Mengelola lapak baru yang didaftarkan secara mandiri. |

> **Catatan Keamanan:** Sistem menerapkan validasi kredensial nyata. Jika nomor HP/email atau kata sandi tidak cocok, login akan ditolak dengan pesan kesalahan yang sesuai.

---

## 🧭 Struktur Halaman Utama

### A. Portal Publik (Masyarakat & Wisatawan)
- **Beranda (`/#/`)**: Hero pencarian lapak, statistik PKL terdata, peta persebaran interaktif, dan galeri produk UMKM.
- **Peta Digital PKL (`/#/peta`)**: Peta layar penuh dengan penanda lokasi, panel filter kecamatan & kategori, serta drawer rincian lapak.
- **Katalog Pedagang (`/#/katalog`)**: Pusat pencarian dan eksplorasi data PKL Kota Bandar Lampung dengan filter lengkap dan kartu rincian usaha.

### B. Portal Admin Pemkot (`/#/admin/dashboard`)
- **Dashboard Command Center (`/#/admin/dashboard`)**: Metrik KPI jumlah pedagang, antrean pengajuan, sebaran wilayah, dan aktivitas terkini.
- **Verifikasi Pengajuan (`/#/admin/verifikasi`)**: Tinjau berkas, setujui lapak, minta revisi dengan catatan instruksi, atau tolak pengajuan.
- **Data Master Pedagang (`/#/admin/pedagang`)**: Tabel pencarian, filter, tambah pedagang baru, dan tombol toggle publikasi ke peta publik.
- **Kategori Dagangan (`/#/admin/kategori`)**: Tambah dan hapus klasifikasi jenis dagangan PKL.
- **Wilayah Administratif (`/#/admin/wilayah`)**: Referensi 14+ Kecamatan dan Kelurahan se-Kota Bandar Lampung.
- **Peta Monitoring Spasial (`/#/admin/peta`)**: Pemantauan titik seluruh lapak PKL di atas peta digital.
- **Rekapitulasi Laporan (`/#/admin/laporan`)**: Tabel rekapitulasi lengkap dengan fitur **Cetak Laporan** dan **Ekspor CSV**.

### C. Portal Mandiri Pedagang PKL (`/#/pedagang/dashboard`)
- **Dashboard Usaha (`/#/pedagang/dashboard`)**: Ringkasan status pendaftaran lapak, kartu status, dan catatan instruksi petugas dinas.
- **Profil & Data Usaha (`/#/pedagang/profil`)**: Kelola identitas pemilik, NIK, nama usaha, jam operasional, dan unggah foto lapak.
- **Titik Lokasi Peta (`/#/pedagang/lokasi`)**: Penentuan titik koordinat lapak dengan pin peta interaktif (Leaflet draggable marker).
- **Status & Perbaikan Data (`/#/pedagang/status`)**: Pantau alur 3 tahap verifikasi dan kirim konfirmasi perbaikan data setelah revisi.

---

## 📋 Ketentuan Sistem
1. Pendataan dan verifikasi dalam sistem ini berfungsi untuk pemetaan digital, pembinaan UMKM, dan evaluasi penataan tata ruang Smart City Kota Bandar Lampung.

---
*Dikembangkan dengan dedikasi untuk kemajuan Smart City Kota Bandar Lampung.*
