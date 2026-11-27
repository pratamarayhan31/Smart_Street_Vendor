---
name: smart-street-vendor-design
description: Panduan desain UI/UX untuk Smart Street Vendor Kota Bandar Lampung berdasarkan implementasi HTML/Tailwind yang diberikan. Gunakan saat membuat, memperbaiki, atau memperluas halaman antarmuka aplikasi agar konsisten dengan desain yang sudah ada dan tetap sesuai ruang lingkup PRD.
---

# Smart Street Vendor — Design Skill

## 1. Tujuan Skill

Gunakan panduan ini untuk merancang dan mengembangkan antarmuka **Smart Street Vendor**, yaitu sistem pendataan, pengelolaan, verifikasi, dan pemetaan Pedagang Kaki Lima (PKL) di Kota Bandar Lampung.

Desain harus:
- Konsisten dengan kode antarmuka yang menjadi acuan.
- Terlihat modern, rapi, profesional, dan mudah digunakan.
- Mengutamakan keterbacaan data dan kemudahan navigasi.
- Mendukung tiga jenis pengguna: admin pemerintah, pedagang PKL, dan masyarakat.
- Responsif pada desktop, tablet, dan ponsel.
- Tidak menambahkan fitur di luar ruang lingkup PRD tanpa persetujuan.

Skill ini adalah pedoman desain UI/UX, bukan spesifikasi backend atau jaminan bahwa elemen visual sudah berfungsi.

## 2. Prinsip Desain

1. **Dashboard-first untuk admin** — informasi ringkasan, antrean verifikasi, dan akses ke halaman utama harus mudah ditemukan.
2. **Formulir sederhana untuk pedagang** — bagi formulir menjadi beberapa bagian yang jelas, gunakan label yang mudah dipahami, dan tampilkan status pengajuan.
3. **Peta sebagai fitur utama** — lokasi PKL harus mudah dicari dan dibaca melalui peta serta daftar.
4. **Public-friendly** — masyarakat dapat mencari pedagang tanpa harus memahami istilah administrasi.
5. **Konsisten** — gunakan warna, tipografi, radius, jarak, tombol, tabel, dan status yang sama di seluruh halaman.
6. **Jujur terhadap data** — data contoh harus diberi penanda simulasi; jangan menampilkan angka atau status contoh seolah-olah data resmi.
7. **Aksesibel** — pastikan kontras teks memadai, ukuran target tombol nyaman disentuh, label form jelas, dan status tidak dibedakan hanya dengan warna.

## 3. Identitas Visual

### 3.1 Palet warna

Gunakan warna dari konfigurasi Tailwind pada kode acuan.

| Token | Hex | Penggunaan |
|---|---|---|
| `primary` | `#002548` | Warna utama teks, tombol utama, dan elemen identitas |
| `primary-container` | `#173B63` | Sidebar dan bidang identitas utama |
| `secondary` | `#0058BE` | Aksi sekunder, tautan, ikon aktif |
| `secondary-container` | `#2170E4` | Menu aktif dan tombol sekunder yang menonjol |
| `background` | `#F8FAFC` | Latar utama halaman |
| `surface` | `#FFFFFF` | Kartu, panel, modal, dan area konten |
| `surface-container-low` | `#EFF4FF` | Latar lembut untuk input dan panel sekunder |
| `surface-container` | `#E5EEFF` | Permukaan alternatif dan elemen informasi |
| `surface-container-high` | `#DCE9FF` | Hover, latar badge, dan penekanan ringan |
| `text-primary` | `#0F172A` | Teks utama |
| `text-muted` | `#64748B` | Teks bantuan dan metadata |
| `border-subtle` | `#E2E8F0` | Garis batas dan pemisah |
| `success` | `#16A34A` | Status berhasil/terverifikasi |
| `success-surface` | `#F0FDF4` | Latar status berhasil |
| `warning` | `#F59E0B` | Status menunggu/perlu perhatian |
| `warning-surface` | `#FFFBEB` | Latar status peringatan |
| `danger` | `#DC2626` | Aksi berbahaya, penolakan, dan kesalahan |
| `danger-surface` | `#FEF2F2` | Latar status kesalahan |

Aturan penggunaan:
- Gunakan navy sebagai identitas utama dan biru sebagai aksen interaksi.
- Gunakan latar halaman abu-abu kebiruan yang sangat terang.
- Kartu konten umumnya putih dengan border tipis atau shadow ringan.
- Hijau hanya untuk keberhasilan/terverifikasi, kuning-oranye untuk menunggu/perlu tindakan, dan merah untuk kesalahan/penolakan.
- Jangan menggunakan warna status tanpa label teks yang menjelaskan status.

### 3.2 Tipografi

- Font utama: **Inter** dari Google Fonts.
- Gunakan bobot 400 untuk isi, 500 untuk label, 600 untuk judul komponen, dan 700 untuk judul utama/angka penting.
- Skala tipografi acuan:

| Token | Ukuran | Line height | Penggunaan |
|---|---:|---:|---|
| `display-lg` | 36 px | 44 px | Angka KPI atau judul display desktop |
| `display-lg-mobile` | 28 px | 36 px | Judul/angka display pada layar kecil |
| `headline-lg` | 24 px | 32 px | Judul halaman atau bagian utama |
| `headline-md` | 20 px | 28 px | Judul panel |
| `headline-sm` | 18 px | 26 px | Judul kartu/section |
| `title-md` | 16 px | 24 px | Judul kecil dan tombol penting |
| `body-lg` | 16 px | 24 px | Isi penting |
| `body-md` | 14 px | 20 px | Isi standar |
| `body-sm` | 13 px | 18 px | Deskripsi dan metadata |
| `label-md` | 13 px | 18 px | Label form dan tabel |
| `label-sm` | 12 px | 16 px | Label kecil dan badge |

Jangan menggunakan terlalu banyak ukuran font dalam satu halaman. Pastikan hierarki judul, isi, dan metadata jelas.

### 3.3 Ikon

- Gunakan **Material Symbols Outlined**, sesuai kode acuan.
- Ikon harus mudah dikenali dan konsisten ukurannya.
- Ukuran umum: 18–20 px untuk navigasi/aksi kecil, 22–26 px untuk ikon kartu.
- Ikon tidak boleh menggantikan label pada aksi penting.

## 4. Layout dan Spacing

### 4.1 Pola halaman admin dan pedagang

Untuk halaman internal, gunakan pola:
- Sidebar navigasi di sisi kiri.
- Header horizontal di bagian atas area konten.
- Area utama menggunakan latar `background`.
- Konten disusun dalam section dan kartu putih.
- Sidebar desktop pada acuan memiliki lebar sekitar 256 px.
- Header desktop pada acuan memiliki tinggi sekitar 64 px.
- Beri ruang konten yang cukup; jangan membuat tabel atau formulir terlalu rapat.

Sidebar:
- Latar `primary-container`.
- Logo/identitas produk di bagian atas.
- Kelompok menu menggunakan judul kecil uppercase.
- Item menu menggunakan ikon dan teks.
- Menu aktif memakai `secondary-container` dengan teks putih.
- Menu tidak aktif memakai teks putih lembut dan hover yang jelas.
- Sediakan tautan kembali ke portal publik jika sesuai konteks.

Header:
- Latar putih dengan sedikit transparansi dan bayangan tipis.
- Tampilkan nama sistem dan label wilayah “Kota Bandar Lampung”.
- Sisi kanan dapat menampilkan notifikasi dan identitas pengguna.
- Jangan menampilkan informasi profil yang tidak diperlukan.

### 4.2 Grid dan jarak

- Gunakan grid responsif: satu kolom di ponsel, dua kolom di tablet bila sesuai, dan beberapa kolom di desktop.
- Gunakan jarak antar-section yang konsisten, sekitar 24–32 px.
- Padding kartu umum sekitar 16–24 px.
- Gunakan radius:
  - `rounded-lg` / 8 px untuk input dan kontrol kecil.
  - `rounded-xl` / 12 px untuk kartu dan panel.
  - `rounded-2xl` / 16 px untuk panel/visual besar.
- Shadow ringan saja; hindari bayangan gelap atau efek berlebihan.
- Jangan menyembunyikan scrollbar jika hal itu menghambat pengguna memahami bahwa konten dapat digulir.

## 5. Komponen UI

### 5.1 Tombol

Jenis tombol:
- **Primary**: latar navy `primary`, teks putih; untuk aksi utama seperti Simpan, Kirim Pendaftaran, atau Masuk.
- **Secondary**: latar biru `secondary` atau `secondary-container`; untuk aksi pendukung yang penting.
- **Tertiary/Ghost**: tanpa latar kuat; untuk aksi ringan seperti Batal atau Kembali.
- **Danger**: merah untuk aksi yang menghapus atau menolak.

Aturan:
- Tinggi kontrol utama minimal sekitar 44 px.
- Gunakan kata kerja yang spesifik: “Simpan Data”, “Kirim Pendaftaran”, “Lihat Detail”.
- Beri hover, focus, disabled, dan loading state saat relevan.
- Jangan membuat tombol yang terlihat aktif tetapi tidak memiliki tindakan.

### 5.2 Kartu

Kartu standar:
- Latar putih.
- Radius 12 px.
- Padding 20–24 px.
- Shadow tipis atau border `border-subtle`.
- Judul dan deskripsi singkat.
- Ikon boleh berada di kanan atas dalam kotak latar lembut.

Kartu KPI admin:
- Nama metrik di bagian atas.
- Angka utama terlihat jelas.
- Keterangan periode/perbandingan di bawah angka jika datanya tersedia.
- Progress bar hanya digunakan jika benar-benar mewakili nilai yang jelas.
- Jangan mengarang persentase atau tren.

### 5.3 Badge status

Gunakan label status yang konsisten:
- `Menunggu Verifikasi` — latar `warning-surface`, teks `warning`.
- `Sedang Ditinjau` — latar biru lembut, teks `primary`/`secondary`.
- `Perlu Perbaikan` — latar `warning-surface`, teks `warning`.
- `Terverifikasi` — latar `success-surface`, teks `success`.
- `Ditolak` — latar `danger-surface`, teks `danger`.

Status harus disertai teks. Jangan mengandalkan warna atau ikon saja. Jangan memakai kata “legal”, “izin resmi”, “bersertifikat”, atau “binaan” sebagai konsekuensi otomatis dari verifikasi data.

### 5.4 Formulir

- Gunakan label di atas input, bukan placeholder sebagai satu-satunya label.
- Tandai kolom wajib dengan `*` dan jelaskan jika ada aturan khusus.
- Gunakan helper text untuk format atau contoh isian.
- Kelompokkan formulir menjadi bagian seperti:
  1. Data pedagang.
  2. Data usaha.
  3. Kategori dagangan.
  4. Wilayah dan lokasi.
  5. Foto usaha.
- Gunakan tab atau langkah bertahap jika formulir panjang.
- Validasi harus menampilkan pesan dekat kolom yang bermasalah.
- Sediakan ringkasan sebelum pengiriman jika formulir memiliki beberapa tahap.
- Jangan meminta NIK, nomor telepon, atau data pribadi lain jika tidak diperlukan oleh kebutuhan produk yang sudah disetujui.

### 5.5 Tabel data

- Gunakan header tabel dengan latar lembut dan teks sekunder.
- Beri garis pemisah horizontal tipis.
- Gunakan hover row secara halus.
- Sediakan pencarian, filter, dan pagination jika jumlah data besar.
- Kolom yang mungkin digunakan: ID pengajuan, tanggal, nama pedagang, nama usaha, kategori, wilayah, status, dan aksi.
- Pada layar kecil, gunakan horizontal scroll yang jelas atau ubah menjadi daftar kartu.
- Data sensitif seperti NIK dan nomor telepon tidak boleh ditampilkan penuh tanpa kebutuhan dan otorisasi yang jelas.

### 5.6 Pencarian dan filter

- Input pencarian memiliki ikon pencarian dan placeholder yang menjelaskan kata kunci.
- Filter wilayah menggunakan dropdown.
- Filter kategori menggunakan dropdown atau chip.
- Sediakan tombol “Terapkan Filter” dan “Reset” jika filter lebih dari satu.
- Tampilkan hasil kosong yang informatif saat tidak ada data.

### 5.7 Peta dan marker

Peta merupakan elemen utama produk.
- Gunakan peta Bandar Lampung dengan marker lokasi PKL.
- Sediakan pencarian nama usaha/pedagang, filter kategori, dan filter kecamatan.
- Marker dapat dibedakan menurut kategori atau status yang relevan, tetapi harus memiliki legenda.
- Klik marker membuka popup atau panel detail ringkas.
- Detail dapat memuat nama usaha, kategori, wilayah, jam operasional jika tersedia, dan foto.
- Pada peta publik, hanya tampilkan data yang sudah diverifikasi dan memang diizinkan untuk dipublikasikan.
- Jangan menampilkan nomor telepon atau data pribadi secara default.
- Lokasi contoh harus diberi keterangan sebagai data simulasi.
- Jangan menampilkan zonasi legal, status izin, atau kelayakan lokasi kecuali sumber resmi dan ruang lingkup produk memang mendukungnya.

### 5.8 Grafik

- Gunakan grafik sederhana untuk jumlah pedagang per kategori atau distribusi per kecamatan.
- Judul grafik harus menjelaskan metrik yang ditampilkan.
- Sertakan angka atau label agar grafik tidak bergantung pada warna.
- Hindari grafik dekoratif tanpa makna operasional.
- Data grafik harus berasal dari data aplikasi atau diberi label “Data Simulasi”.

### 5.9 Foto dan ilustrasi

- Gunakan foto yang relevan dengan pedagang kaki lima dan suasana Bandar Lampung.
- Foto usaha sebaiknya berbentuk landscape atau rasio konsisten pada kartu.
- Gunakan `object-fit: cover` agar gambar memenuhi area tanpa merusak proporsi.
- Berikan alt text deskriptif.
- Jangan memakai logo Pemerintah Kota atau Universitas sebagai identitas resmi aplikasi tanpa izin penggunaan. Jika belum ada aset resmi, gunakan wordmark teks sederhana “PKL Smart”.

## 6. Panduan Per Halaman

### 6.1 Admin — Dashboard Ringkasan

Tujuan: memberi gambaran cepat tentang data PKL dan pekerjaan admin.

Susunan:
1. Sidebar admin.
2. Header sistem dan identitas operator.
3. Banner sambutan dengan judul “Admin Command Center Pengelolaan PKL Kota Bandar Lampung”.
4. Kartu KPI: total pedagang terdaftar, terverifikasi, menunggu verifikasi, dan jumlah kategori.
5. Ringkasan kategori dagangan.
6. Ringkasan distribusi per kecamatan.
7. Pintasan ke laporan dan peta.
8. Tabel pengajuan terbaru.

Catatan:
- Angka statistik dan grafik pada prototipe harus diberi label simulasi jika bukan data nyata.
- Jangan menggunakan istilah “legalitas PKL”, “QR binaan”, atau “sertifikasi sanitasi” sebagai fitur inti kecuali telah ditetapkan dan didukung sumber resmi.
- Jangan menampilkan klaim sinkronisasi real-time jika belum benar-benar tersedia.

### 6.2 Admin — Data Pedagang

Tujuan: mengelola daftar data pedagang.

Elemen:
- Judul halaman dan deskripsi singkat.
- Tombol tambah data jika admin memang memiliki kewenangan tersebut.
- Pencarian nama usaha/pedagang.
- Filter kategori, kecamatan, dan status.
- Tabel daftar pedagang.
- Aksi lihat detail dan edit sesuai hak akses.

### 6.3 Admin — Verifikasi Pendaftaran

Tujuan: memeriksa data yang dikirim pedagang.

Layout acuan:
- Area kiri untuk antrean pengajuan, pencarian, dan filter.
- Area kanan untuk detail pengajuan yang dipilih.
- Tampilkan data pedagang, data usaha, kategori, foto, dan titik lokasi.
- Sediakan aksi: setujui/verifikasi, minta perbaikan, atau tolak.
- Saat meminta perbaikan atau menolak, admin harus mengisi alasan/catatan.
- Tampilkan status dan riwayat keputusan.

Penting: verifikasi di aplikasi hanya berarti pemeriksaan data dalam sistem. Verifikasi bukan izin berdagang, bukan izin penggunaan lahan, dan bukan persetujuan legal dari pemerintah.

### 6.4 Admin — Peta Persebaran PKL

Tujuan: melihat distribusi lokasi PKL.

Elemen:
- Peta sebagai area utama.
- Panel pencarian dan filter kategori/kecamatan.
- Legenda marker.
- Popup atau drawer detail usaha.
- Tombol reset tampilan peta bila diperlukan.
- Keterangan sumber dan status data.

Jangan menambahkan pengelolaan zonasi atau penetapan lokasi resmi jika tidak ada dalam PRD.

### 6.5 Admin — Kategori Dagangan

Tujuan: mengelola kategori yang digunakan dalam pendaftaran dan pencarian.

Elemen:
- Daftar kategori.
- Pencarian kategori.
- Tombol tambah kategori.
- Aksi edit dan nonaktifkan/hapus sesuai aturan data.
- Konfirmasi sebelum penghapusan.
- Hindari kategori duplikat.

### 6.6 Admin — Laporan

Tujuan: menampilkan rekap data pedagang.

Elemen:
- Filter rentang tanggal, kategori, dan kecamatan jika data mendukung.
- Ringkasan total data.
- Grafik atau tabel rekap.
- Ekspor PDF/Excel hanya ditampilkan sebagai aksi jika fitur tersebut akan diimplementasikan.
- Beri keterangan waktu pembaruan dan sumber data.

### 6.7 Pedagang — Dashboard Usaha

Tujuan: membantu pedagang memantau profil dan status pendaftaran.

Elemen:
- Sapaan singkat.
- Ringkasan status pengajuan.
- Informasi data yang belum lengkap.
- Pintasan ke Profil & Data Usaha, Titik Lokasi Peta, dan Status Pendaftaran.
- Catatan admin jika ada perbaikan yang harus dilakukan.

### 6.8 Pedagang — Profil & Data Usaha

Tujuan: mengisi dan memperbarui informasi pedagang dan usahanya.

Elemen:
- Form data pedagang.
- Form nama usaha, kategori, deskripsi dagangan, dan jam operasional jika diperlukan.
- Upload foto usaha.
- Penanda kolom wajib.
- Tombol simpan draft dan kirim pengajuan jika alur mendukung.
- Tampilkan pesan validasi.

### 6.9 Pedagang — Titik Lokasi Peta

Tujuan: menentukan lokasi usaha pada peta.

Elemen:
- Pilihan kecamatan/kelurahan sesuai referensi wilayah yang valid.
- Kolom alamat.
- Peta interaktif dengan pin yang dapat dipindahkan.
- Koordinat latitude/longitude jika dibutuhkan.
- Petunjuk cara memilih lokasi.
- Tombol simpan lokasi.

Jangan menyatakan titik lokasi “diizinkan”, “legal”, atau “zonasi diperbolehkan” hanya berdasarkan input peta.

### 6.10 Pedagang — Status Pendaftaran

Tujuan: memberi informasi perkembangan pengajuan.

Elemen:
- Status saat ini.
- Tanggal pengajuan dan pembaruan.
- Catatan admin.
- Tombol perbaiki data jika status meminta perbaikan.
- Riwayat status jika tersedia.

### 6.11 Masyarakat — Portal Publik

Tujuan: memudahkan masyarakat menemukan pedagang PKL.

Elemen:
- Header publik dengan identitas PKL Smart.
- Hero dengan judul sederhana, misalnya “Temukan Pedagang Kaki Lima di Sekitarmu”.
- Pencarian nama pedagang/usaha atau produk.
- Filter kecamatan dan kategori.
- Tombol “Jelajahi Peta Digital PKL”.
- Daftar kartu pedagang.
- Peta persebaran.
- Footer berisi informasi aplikasi.

Kartu pedagang dapat menampilkan foto, nama usaha, kategori, kecamatan, dan tombol detail. Kontak hanya ditampilkan bila pedagang telah menyetujui publikasi.

## 7. Responsivitas

### Desktop
- Sidebar tetap terlihat.
- Konten memanfaatkan lebar layar dengan batas lebar yang nyaman.
- Tabel dan grafik dapat tampil berdampingan.
- Peta memiliki ruang yang cukup.

### Tablet
- Sidebar dapat diperkecil atau diubah menjadi drawer.
- Grid dua kolom jika masih terbaca.
- Tabel tetap dapat digulir secara horizontal.

### Mobile
- Gunakan navigasi drawer atau menu ringkas.
- Konten satu kolom.
- Kartu KPI dapat menjadi dua kolom jika ukuran cukup, selain itu satu kolom.
- Tombol utama lebar penuh bila dibutuhkan.
- Peta dan formulir harus tetap dapat digunakan tanpa zoom berlebihan.
- Jangan memotong label, tombol, atau informasi status.

## 8. Interaksi dan State

Setiap komponen interaktif harus memiliki state visual:
- Default.
- Hover.
- Focus.
- Active/selected.
- Disabled.
- Loading.
- Success.
- Error/empty.

Contoh interaksi:
- Item sidebar berubah gaya saat aktif.
- Filter memperbarui hasil daftar/peta.
- Marker membuka detail pedagang.
- Form menampilkan validasi.
- Tombol verifikasi meminta konfirmasi bila keputusan berdampak penting.
- Upload foto menampilkan preview dan opsi mengganti foto.

Jangan membuat elemen yang hanya tampak interaktif tetapi tidak memiliki fungsi. Jika masih berupa prototype, beri keterangan bahwa interaksi menggunakan data simulasi.

## 9. Batasan Produk yang Wajib Dijaga

Jangan menambahkan fitur berikut sebagai bagian inti desain tanpa revisi PRD:
- Pembayaran pajak atau retribusi online.
- Penerbitan izin resmi.
- Integrasi langsung ke sistem pemerintah.
- Pelacakan lokasi real-time.
- Aplikasi mobile native.
- IoT atau AI.
- Pemesanan makanan, keranjang, checkout, atau transaksi jual beli.

Jangan mengubah aplikasi menjadi sistem penertiban, perizinan, atau penetapan zonasi. Fokus produk adalah pendataan, pengelolaan, verifikasi data, pencarian, dan pemetaan PKL.

## 10. Aturan Data dan Konten

- Gunakan Bahasa Indonesia yang sederhana dan konsisten.
- Gunakan istilah “pedagang”, “usaha”, “kategori dagangan”, “kecamatan”, “lokasi”, dan “status pendaftaran”.
- Hindari istilah administratif yang tidak dijelaskan kepada pengguna.
- Jangan menampilkan data pribadi secara publik.
- Semua nama, alamat, koordinat, angka statistik, dan profil contoh harus ditandai sebagai data simulasi pada prototipe.
- Jangan mengklaim data berasal dari Pemerintah Kota Bandar Lampung kecuali benar-benar ada sumber dan izin penggunaannya.
- Gunakan nama wilayah yang sudah divalidasi; jangan menganggap jumlah kecamatan atau batas wilayah dari contoh desain sebagai data resmi.

## 11. Checklist Sebelum Desain Diserahkan

- [ ] Warna dan tipografi mengikuti design system.
- [ ] Navigasi konsisten antarhalaman.
- [ ] Status memiliki label teks dan warna yang konsisten.
- [ ] Form memiliki label, validasi, dan pesan bantuan.
- [ ] Tabel memiliki pencarian/filter bila diperlukan.
- [ ] Peta memiliki legenda, filter, dan detail marker.
- [ ] Tampilan mobile dapat digunakan.
- [ ] Data contoh diberi label simulasi.
- [ ] Data pribadi tidak tampil pada portal publik secara default.
- [ ] Verifikasi tidak digambarkan sebagai izin resmi.
- [ ] Tidak ada fitur di luar ruang lingkup PRD.
- [ ] Semua tombol dan kontrol memiliki fungsi atau diberi label sebagai prototype.

## 12. Instruksi untuk AI Design Assistant

Saat menerima permintaan desain:
1. Identifikasi aktor dan halaman yang sedang dibuat.
2. Pertahankan palet warna, font Inter, Material Symbols Outlined, radius, spacing, dan pola layout pada skill ini.
3. Ikuti struktur halaman pada bagian 6.
4. Gunakan komponen yang sudah ada sebelum menciptakan pola baru.
5. Pastikan seluruh konten sesuai dengan kebutuhan Smart Street Vendor dan ruang lingkup PRD.
6. Jangan mengarang data resmi, status legal, statistik, atau integrasi.
7. Jika kebutuhan baru bertentangan dengan PRD, tandai sebagai usulan perubahan, bukan langsung memasukkannya.
8. Hasil akhir harus responsif, konsisten, mudah dipahami, dan siap diterjemahkan ke implementasi frontend.
