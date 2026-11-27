# Smart Street Vendor (Kota Bandar Lampung)

**Sistem Informasi Pendataan, Verifikasi, dan Pemetaan Spasial Pedagang Kaki Lima Berbasis Web**

Proyek kolaborasi riset dan pengabdian masyarakat antara **Pemerintah Kota Bandar Lampung** dan **Universitas Teknokrat Indonesia**.

---

## 🌟 Ringkasan Aplikasi

Smart Street Vendor dibangun berdasarkan **Product Requirements Document (PRD v1.0)** dan **Desain UI/UX Google Stitch** dengan standar modern:
- **Design System Google Stitch**: Token warna resmi Navy (`#002548`), Blue Container (`#173B63`), Interactive Blue (`#0058BE`), Font *Inter*, dan komponen berstandar UI/UX modern.
- **Dua Logo Resmi Institusi**: Terintegrasi proporsional tanpa distorsi pada navigasi header, footer, dan modul dashboard:
  1. *Logo Pemerintah Kota Bandar Lampung*
  2. *Logo Universitas Teknokrat Indonesia*
- **Peta Spasial Digital**: Menggunakan OpenStreetMap (OSM) dan Leaflet.js dengan titik koordinat presisi lapak PKL di 14+ kecamatan Kota Bandar Lampung.
- **Manajemen Alur Verifikasi Data**: Alur 5 status verifikasi (*Menunggu Verifikasi*, *Sedang Ditinjau*, *Perlu Perbaikan*, *Terverifikasi*, *Ditolak*) dengan fitur catatan perbaikan dari admin.
- **Perlindungan Privasi**: Data pribadi sensitif seperti NIK dan nomor kontak pedagang dirahasiakan dari tampilan masyarakat umum.

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Menjalankan Mode Development
Buka terminal di folder proyek ini dan jalankan:
```bash
npm run dev
```
Aplikasi akan aktif dan dapat dibuka langsung melalui browser di:
`http://localhost:3000` (atau port yang ditampilkan di terminal).

### 2. Membangun & Menjalankan Versi Produksi
```bash
npm run build
npm run preview
```

---

## 🧭 Panduan Navigasi & Uji Coba Peran Pengguna

Aplikasi telah dilengkapi **One-Click Role Switcher** pada halaman login dan header untuk memudahkan evaluasi:

### A. Portal Publik (Masyarakat)
- **Beranda (`/#/`)**: Hero pencarian lapak, statistik PKL terdata, peta persebaran interaktif, dan katalog kuliner/dagangan.
- **Peta Digital PKL (`/#/peta`)**: Peta layar penuh dengan penanda lokasi, panel filter kecamatan & kategori, serta drawer rincian lapak.
- **Detail Lapak**: Klik tombol "Lihat Rincian" pada kartu atau penanda peta untuk melihat foto lapak, jam operasional, dan lokasi.

### B. Portal Admin Pemkot (`/#/admin/dashboard`)
*Akses Instan: Klik tombol **Admin** di navbar atas atau tombol **Masuk Admin** di halaman login.*
- **Dashboard Command Center (`/#/admin/dashboard`)**: Metrik KPI jumlah pedagang, antrean baru, sebaran per kecamatan, dan status sistem.
- **Verifikasi Pengajuan (`/#/admin/verifikasi`)**: Antrean pengajuan dengan split layout. Petugas dapat:
  - *Setujui & Verifikasi* (lapak langsung aktif di peta publik)
  - *Minta Perbaikan Data* (mengirim catatan instruksi revisi ke pedagang)
  - *Tolak Pengajuan* (disertai alasan penolakan)
- **Data Master Pedagang (`/#/admin/pedagang`)**: Tabel pencarian, filter, tambah data baru, dan tombol toggle publikasi data lapak.
- **Kategori Dagangan (`/#/admin/kategori`)**: Kelola master klasifikasi kategori dagangan.
- **Wilayah Administratif (`/#/admin/wilayah`)**: Referensi 14+ Kecamatan dan Kelurahan Kota Bandar Lampung.
- **Peta Monitoring Spasial (`/#/admin/peta`)**: Pemantauan spasial seluruh lapak dengan filter status verifikasi.
- **Rekapitulasi Laporan (`/#/admin/laporan`)**: Tabel rekapitulasi lengkap dengan fitur **Cetak Laporan** dan **Ekspor CSV**.

### C. Portal Mandiri Pedagang PKL (`/#/pedagang/dashboard`)
*Akses Instan: Klik tombol **Portal Pedagang** di navbar atas atau tombol **Masuk Pedagang** di halaman login.*
- **Dashboard Usaha (`/#/pedagang/dashboard`)**: Ringkasan status verifikasi, identitas usaha, dan notifikasi catatan revisi dari admin.
- **Profil & Data Usaha (`/#/pedagang/profil`)**: Pengisian data pedagang, nama lapak, kategori, jam buka-tutup, dan unggah foto tempat usaha.
- **Titik Lokasi Peta (`/#/pedagang/lokasi`)**: Penentuan lokasi presisi menggunakan pin peta interaktif (Leaflet draggable pin) yang otomatis menangkap Latitude & Longitude.
- **Status & Perbaikan Data (`/#/pedagang/status`)**: Timeline tahapan pemeriksaan berkas dan formulir kirim balik perbaikan data ke admin.

---

## 📋 Catatan Penafian & Etika Sistem
1. Data nama lapak, pedagang, dan koordinat dalam prototipe ini berstatus **Data Simulasi** untuk keperluan riset dan pengujian fungsionalitas sistem informasi.
2. Status verifikasi dalam aplikasi ini merupakan validasi pendataan sistem, bukan izin usaha resmi atau penetapan legalitas pemakaian lahan oleh pemerintah.

---
*Dikembangkan dengan dedikasi untuk kemajuan Smart City Kota Bandar Lampung.*

