# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Smart Street Vendor

**Sistem Informasi Pendataan dan Pemetaan Pedagang Kaki Lima Berbasis
Web di Kota Bandar Lampung**

  -----------------------------------------------------------------------
  Informasi                           Keterangan
  ----------------------------------- -----------------------------------
  Nama Produk                         Smart Street Vendor

  Versi Dokumen                       1.0

  Status                              Draft

  Jenis Produk                        Aplikasi berbasis web

  Kategori                            Smart City

  Wilayah Penerapan                   Kota Bandar Lampung

  Target Pengguna                     Admin pemerintah daerah, pedagang
                                      PKL, dan masyarakat
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 1. Pendahuluan

### 1.1 Latar Belakang

Pedagang kaki lima (PKL) merupakan bagian dari kegiatan ekonomi
masyarakat perkotaan. Keberadaan PKL menyediakan berbagai kebutuhan
sehari-hari dan menjadi salah satu sumber mata pencaharian masyarakat.

Pengelolaan informasi pedagang dan lokasi berjualan membutuhkan data
yang terstruktur dan mudah diperbarui. Apabila data masih tersebar atau
dicatat secara manual, proses pencarian, pemeriksaan, pemetaan, dan
pembuatan laporan dapat menjadi kurang efisien.

Smart Street Vendor dirancang sebagai sistem informasi berbasis web
untuk membantu pendataan dan pemetaan PKL di Kota Bandar Lampung. Sistem
ini menyediakan sarana bagi pedagang untuk mendaftarkan informasi usaha,
bagi admin untuk memeriksa dan mengelola data, serta bagi masyarakat
untuk mencari informasi pedagang yang telah dipublikasikan.

Permasalahan tersebut merupakan dasar kebutuhan awal produk dan perlu
divalidasi lebih lanjut melalui observasi atau wawancara dengan calon
pengguna dan pihak terkait.

### 1.2 Tujuan Produk

1.  Menyediakan sistem pendataan PKL secara digital dan terpusat.
2.  Memudahkan pedagang mendaftarkan serta memperbarui informasi usaha.
3.  Membantu admin memeriksa dan mengelola data pedagang.
4.  Menampilkan persebaran lokasi PKL melalui peta digital.
5.  Memudahkan masyarakat mencari pedagang berdasarkan nama, wilayah,
    atau kategori dagangan.
6.  Menyediakan rekapitulasi data pedagang untuk kebutuhan pemantauan.

### 1.3 Sasaran Produk

-   Pemerintah daerah atau instansi terkait yang berwenang melakukan
    pendataan dan penataan PKL.
-   Pedagang kaki lima di Kota Bandar Lampung.
-   Masyarakat yang membutuhkan informasi lokasi dan jenis dagangan PKL.

## 2. Ruang Lingkup Produk

### 2.1 Cakupan Versi Pertama (MVP)

Versi pertama aplikasi mencakup:

-   Registrasi dan login pedagang.
-   Pengelolaan profil pedagang dan informasi usaha.
-   Pengajuan data usaha dan lokasi berjualan.
-   Pemeriksaan dan verifikasi data oleh admin.
-   Pengelolaan kategori dagangan.
-   Peta persebaran lokasi pedagang yang telah diverifikasi dan layak
    dipublikasikan.
-   Pencarian dan filter pedagang.
-   Dashboard admin dan laporan rekapitulasi.

### 2.2 Di Luar Cakupan MVP

Fitur berikut belum termasuk dalam pengembangan versi pertama:

-   Pembayaran retribusi atau pajak secara online.
-   Penerbitan izin usaha atau izin lokasi.
-   Integrasi langsung dengan sistem pemerintahan.
-   Pelacakan pedagang secara real-time.
-   Aplikasi Android atau iOS.
-   Integrasi perangkat Internet of Things (IoT).
-   Analisis menggunakan kecerdasan buatan (AI).
-   Sistem transaksi atau pemesanan makanan.

## 3. Identifikasi Pengguna dan Hak Akses

### 3.1 Admin

Admin merupakan petugas dari instansi yang ditunjuk untuk mengelola
aplikasi.

Hak akses:

-   Login ke dashboard admin.
-   Melihat statistik dan data pedagang.
-   Memeriksa pengajuan pendaftaran.
-   Menyetujui, menolak, atau meminta perbaikan data.
-   Mengelola kategori dagangan.
-   Melihat dan mengelola informasi wilayah.
-   Memantau lokasi pedagang melalui peta.
-   Membuat dan mengunduh laporan.
-   Mengelola status publikasi data.

### 3.2 Pedagang

Pedagang merupakan pengguna yang mendaftarkan dan mengelola informasi
usaha miliknya.

Hak akses:

-   Membuat akun dan login.
-   Mengisi identitas pedagang.
-   Mengisi informasi usaha.
-   Memilih kategori dagangan.
-   Menentukan titik lokasi berjualan pada peta.
-   Mengunggah foto usaha.
-   Melihat status pengajuan.
-   Memperbaiki data apabila diminta admin.
-   Memperbarui informasi usaha.

### 3.3 Masyarakat

Masyarakat merupakan pengguna umum yang mengakses informasi publik tanpa
harus membuat akun.

Hak akses:

-   Melihat peta lokasi PKL.
-   Mencari pedagang berdasarkan nama.
-   Memfilter pedagang berdasarkan kategori atau wilayah.
-   Melihat detail informasi usaha yang telah dipublikasikan.

## 4. Kebutuhan Fungsional

### 4.1 Fitur Admin

  -----------------------------------------------------------------------
  ID                      Fitur                   Deskripsi
  ----------------------- ----------------------- -----------------------
  ADM-01                  Login Admin             Admin masuk menggunakan
                                                  akun yang terdaftar.

  ADM-02                  Dashboard               Menampilkan ringkasan
                                                  jumlah pedagang,
                                                  pengajuan, dan status
                                                  verifikasi.

  ADM-03                  Data Pedagang           Admin melihat,
                                                  menambah, mengubah, dan
                                                  mengelola data
                                                  pedagang.

  ADM-04                  Verifikasi Data         Admin memeriksa
                                                  kelengkapan data dan
                                                  menentukan status
                                                  pengajuan.

  ADM-05                  Kategori Dagangan       Admin mengelola
                                                  kategori jenis
                                                  dagangan.

  ADM-06                  Data Wilayah            Admin mengelola
                                                  referensi kecamatan dan
                                                  kelurahan yang
                                                  digunakan sistem.

  ADM-07                  Peta PKL                Admin melihat
                                                  persebaran lokasi
                                                  pedagang.

  ADM-08                  Laporan                 Admin melihat dan
                                                  mengunduh rekapitulasi
                                                  data pedagang.

  ADM-09                  Publikasi Data          Admin mengatur data
                                                  usaha yang dapat
                                                  ditampilkan kepada
                                                  masyarakat.
  -----------------------------------------------------------------------

### 4.2 Fitur Pedagang

  -----------------------------------------------------------------------
  ID                      Fitur                   Deskripsi
  ----------------------- ----------------------- -----------------------
  PKL-01                  Registrasi              Pedagang membuat akun
                                                  menggunakan informasi
                                                  yang diperlukan.

  PKL-02                  Login                   Pedagang masuk ke akun
                                                  masing-masing.

  PKL-03                  Profil Pedagang         Pedagang mengisi dan
                                                  memperbarui identitas.

  PKL-04                  Informasi Usaha         Pedagang mengisi nama
                                                  usaha, kategori, dan
                                                  deskripsi singkat.

  PKL-05                  Lokasi Usaha            Pedagang menentukan
                                                  titik lokasi berjualan
                                                  pada peta.

  PKL-06                  Foto Usaha              Pedagang mengunggah
                                                  foto usaha sesuai
                                                  ketentuan aplikasi.

  PKL-07                  Status Pengajuan        Pedagang melihat status
                                                  pemeriksaan data.

  PKL-08                  Perbaikan Data          Pedagang memperbaiki
                                                  data berdasarkan
                                                  catatan admin.
  -----------------------------------------------------------------------

### 4.3 Fitur Masyarakat

  -----------------------------------------------------------------------
  ID                      Fitur                   Deskripsi
  ----------------------- ----------------------- -----------------------
  PUB-01                  Peta Lokasi             Menampilkan lokasi
                                                  pedagang yang telah
                                                  disetujui untuk
                                                  dipublikasikan.

  PUB-02                  Pencarian               Mencari pedagang
                                                  berdasarkan nama atau
                                                  nama usaha.

  PUB-03                  Filter Kategori         Menyaring pedagang
                                                  berdasarkan jenis
                                                  dagangan.

  PUB-04                  Filter Wilayah          Menyaring pedagang
                                                  berdasarkan kecamatan
                                                  atau kelurahan.

  PUB-05                  Detail Usaha            Menampilkan informasi
                                                  usaha yang ditetapkan
                                                  sebagai informasi
                                                  publik.
  -----------------------------------------------------------------------

## 5. Alur Proses Bisnis

### 5.1 Alur Pendaftaran Pedagang

1.  Pedagang membuka website Smart Street Vendor.
2.  Pedagang membuat akun.
3.  Pedagang login ke dalam aplikasi.
4.  Pedagang mengisi identitas dan informasi usaha.
5.  Pedagang memilih kategori dagangan.
6.  Pedagang menentukan lokasi berjualan pada peta.
7.  Pedagang mengunggah foto usaha jika diperlukan.
8.  Pedagang mengirim pengajuan.
9.  Admin memeriksa data yang masuk.
10. Admin menyetujui, menolak, atau meminta perbaikan data.
11. Pedagang melihat hasil pemeriksaan melalui akun.
12. Data yang disetujui dan diizinkan untuk dipublikasikan ditampilkan
    pada peta publik.

### 5.2 Alur Verifikasi Admin

1.  Admin login ke dashboard.
2.  Admin membuka daftar pengajuan pedagang.
3.  Admin memeriksa identitas, informasi usaha, kategori, dan lokasi.
4.  Admin memilih salah satu hasil pemeriksaan: disetujui, ditolak, atau
    perlu perbaikan.
5.  Admin menambahkan catatan apabila diperlukan.
6.  Sistem menyimpan status dan waktu pemeriksaan.
7.  Pedagang dapat melihat status dan catatan tersebut.

### 5.3 Alur Pencarian oleh Masyarakat

1.  Masyarakat membuka halaman peta PKL.
2.  Sistem menampilkan lokasi usaha yang dipublikasikan.
3.  Masyarakat mencari nama pedagang atau memilih kategori.
4.  Masyarakat dapat menerapkan filter wilayah.
5.  Masyarakat memilih penanda lokasi pada peta.
6.  Sistem menampilkan detail usaha yang bersifat publik.

## 6. Aturan Bisnis

1.  Pedagang harus memiliki akun untuk mengajukan data usaha.
2.  Setiap akun pedagang hanya dapat mengelola data yang menjadi hak
    aksesnya.
3.  Data usaha harus memiliki nama usaha dan kategori dagangan.
4.  Lokasi usaha harus dilengkapi alamat atau keterangan lokasi serta
    koordinat apabila menggunakan peta.
5.  Setiap pengajuan harus melalui proses pemeriksaan admin.
6.  Admin dapat menyetujui, menolak, atau meminta perbaikan data.
7.  Pedagang dapat memperbaiki pengajuan berdasarkan catatan admin.
8.  Data yang belum disetujui tidak ditampilkan pada peta publik.
9.  Data yang telah disetujui belum tentu otomatis layak dipublikasikan;
    admin harus memastikan informasi tersebut memang boleh ditampilkan.
10. Perubahan informasi lokasi harus diperiksa kembali oleh admin.
11. Sistem menyimpan riwayat status pemeriksaan agar perubahan dapat
    ditelusuri.
12. Status verifikasi aplikasi bukan merupakan izin resmi untuk
    berjualan dan tidak menggantikan proses perizinan atau penetapan
    lokasi oleh instansi berwenang.

## 7. Rancangan Data dan Database

Database versi pertama menggunakan MySQL. Rancangan tabel awal adalah
sebagai berikut.

  -----------------------------------------------------------------------
  Nama Tabel                          Fungsi
  ----------------------------------- -----------------------------------
  users                               Menyimpan akun, email, password,
                                      dan peran pengguna.

  vendors                             Menyimpan identitas pedagang.

  businesses                          Menyimpan informasi usaha dan
                                      kategori dagangan.

  categories                          Menyimpan daftar kategori dagangan.

  locations                           Menyimpan alamat dan koordinat
                                      lokasi usaha.

  verifications                       Menyimpan status, catatan, petugas,
                                      dan waktu verifikasi.

  vendor_photos                       Menyimpan referensi foto usaha.

  districts                           Menyimpan referensi wilayah
                                      kecamatan dan kelurahan.
  -----------------------------------------------------------------------

### 7.1 Gambaran Relasi Data

-   Satu akun pedagang terhubung dengan data pedagang.
-   Data pedagang terhubung dengan informasi usaha.
-   Setiap usaha memiliki kategori dagangan.
-   Informasi usaha terhubung dengan lokasi berjualan.
-   Pengajuan pedagang dapat memiliki beberapa catatan atau riwayat
    verifikasi.
-   Data usaha dapat memiliki beberapa foto.
-   Data pedagang dapat dihubungkan dengan referensi wilayah.

Struktur ini merupakan rancangan awal. Kardinalitas dan kebutuhan tabel
dapat disesuaikan saat desain database rinci dibuat.

### 7.2 Data yang Dicatat

**Data pedagang:** - Nama lengkap. - Nomor kontak. - Informasi akun. -
Wilayah tempat tinggal jika diperlukan.

**Data usaha:** - Nama usaha. - Kategori dagangan. - Deskripsi usaha. -
Alamat atau keterangan lokasi. - Kecamatan dan kelurahan. - Latitude dan
longitude. - Foto usaha. - Status pengajuan.

Informasi pribadi seperti nomor kontak dan data identitas tidak
ditampilkan secara terbuka kepada masyarakat.

## 8. Kebutuhan Nonfungsional

  -----------------------------------------------------------------------
  Aspek                               Kebutuhan
  ----------------------------------- -----------------------------------
  Keamanan                            Password harus disimpan menggunakan
                                      mekanisme hashing yang aman.

  Hak Akses                           Admin, pedagang, dan masyarakat
                                      memiliki hak akses berbeda.

  Privasi                             Data pribadi hanya dapat diakses
                                      oleh pihak yang berwenang.

  Responsif                           Website dapat digunakan melalui
                                      komputer, tablet, dan smartphone.

  Kemudahan Penggunaan                Navigasi dan formulir dibuat
                                      sederhana dan mudah dipahami.

  Kinerja                             Halaman, pencarian, dan data peta
                                      dapat dimuat secara wajar.

  Validasi                            Sistem memeriksa format dan
                                      kelengkapan input.

  Backup                              Database dicadangkan secara
                                      berkala.

  Kompatibilitas                      Website mendukung browser modern.
  -----------------------------------------------------------------------

## 9. Teknologi yang Digunakan

  -----------------------------------------------------------------------
  Komponen                Teknologi               Kegunaan
  ----------------------- ----------------------- -----------------------
  Frontend                HTML, CSS, Bootstrap    Membangun tampilan
                                                  website.

  Interaksi               JavaScript              Mengatur interaksi
                                                  halaman.

  Backend                 PHP dengan Laravel      Mengelola proses dan
                                                  logika aplikasi.

  Database                MySQL                   Menyimpan data
                                                  aplikasi.

  Peta                    Leaflet.js              Menampilkan peta dan
                                                  penanda lokasi.

  Peta Dasar              OpenStreetMap           Menyediakan data peta
                                                  dasar.

  Server Lokal            XAMPP atau lingkungan   Menjalankan aplikasi
                          PHP yang sesuai         selama pengembangan.
  -----------------------------------------------------------------------

## 10. Gambaran Arsitektur Sistem

1.  Pengguna mengakses aplikasi melalui browser.
2.  Frontend menampilkan halaman sesuai peran pengguna.
3.  Backend Laravel memproses permintaan dan memeriksa hak akses.
4.  MySQL menyimpan serta menyediakan data aplikasi.
5.  Leaflet.js menampilkan peta dan titik koordinat yang diperoleh dari
    database.
6.  Masyarakat hanya menerima informasi yang telah ditetapkan sebagai
    informasi publik.

## 11. Ruang Lingkup MVP

Fitur yang wajib diselesaikan pada versi pertama:

-   [ ] Registrasi dan login pedagang.
-   [ ] Login admin.
-   [ ] Dashboard admin.
-   [ ] Pengelolaan data pedagang.
-   [ ] Pengelolaan kategori dagangan.
-   [ ] Formulir pendaftaran usaha.
-   [ ] Penentuan titik lokasi pada peta.
-   [ ] Unggah foto usaha.
-   [ ] Verifikasi dan catatan perbaikan.
-   [ ] Peta lokasi PKL untuk masyarakat.
-   [ ] Pencarian dan filter pedagang.
-   [ ] Laporan rekapitulasi data.

Fitur di luar daftar MVP dapat dipertimbangkan untuk pengembangan
berikutnya setelah fungsi utama berjalan dengan baik.

## 12. Rancangan Halaman Aplikasi

### 12.1 Halaman Publik

-   Landing page.
-   Halaman peta persebaran PKL.
-   Halaman pencarian pedagang.
-   Halaman detail usaha.
-   Halaman login dan registrasi.

### 12.2 Halaman Pedagang

-   Dashboard pedagang.
-   Profil pedagang.
-   Formulir data usaha.
-   Formulir penentuan lokasi.
-   Unggah foto usaha.
-   Halaman status pengajuan.
-   Halaman perbaikan data.

### 12.3 Halaman Admin

-   Dashboard admin.
-   Daftar pedagang.
-   Detail data pedagang.
-   Daftar pengajuan.
-   Halaman verifikasi.
-   Pengelolaan kategori.
-   Pengelolaan wilayah.
-   Peta persebaran PKL.
-   Halaman laporan.

## 13. Kriteria Keberhasilan

MVP dinyatakan memenuhi kebutuhan apabila:

1.  Pedagang dapat membuat akun dan login.
2.  Pedagang dapat mengirim data usaha beserta lokasi.
3.  Admin dapat melihat dan memeriksa pengajuan.
4.  Admin dapat menyetujui, menolak, atau meminta perbaikan.
5.  Pedagang dapat melihat status pengajuan.
6.  Lokasi usaha yang dipublikasikan dapat ditampilkan pada peta.
7.  Masyarakat dapat mencari dan memfilter informasi pedagang.
8.  Admin dapat melihat dan mengunduh laporan.
9.  Hak akses setiap jenis pengguna berjalan sesuai ketentuan.
10. Informasi pribadi pedagang tidak terbuka kepada pengguna publik
    tanpa dasar dan persetujuan yang sesuai.

## 14. Rencana Pengembangan

Estimasi pengembangan awal selama 30 hari.

  Tahap   Kegiatan                                  Estimasi
  ------- ----------------------------------------- -------------
  1       Analisis kebutuhan dan finalisasi PRD     Hari 1--3
  2       Desain UI/UX dan database                 Hari 4--7
  3       Persiapan proyek dan autentikasi          Hari 8--11
  4       Pengembangan modul admin                  Hari 12--16
  5       Pengembangan modul pedagang               Hari 17--20
  6       Integrasi peta digital                    Hari 21--23
  7       Pengembangan halaman publik dan laporan   Hari 24--26
  8       Pengujian dan perbaikan                   Hari 27--29
  9       Finalisasi dan dokumentasi                Hari 30

Jadwal dapat berubah sesuai kemampuan tim, kompleksitas implementasi,
dan hasil pengujian.

## 15. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Koordinat lokasi tidak tepat        Sediakan pemilihan titik pada peta
                                      dan pemeriksaan admin.

  Data pedagang ganda                 Terapkan validasi dan pemeriksaan
                                      data sebelum persetujuan.

  Foto berukuran terlalu besar        Batasi ukuran dan jenis file
                                      unggahan.

  Penyalahgunaan akun                 Terapkan autentikasi, hashing
                                      password, dan pembatasan hak akses.

  Peta tidak dapat dimuat             Tampilkan pesan kesalahan dan
                                      informasi alamat sebagai
                                      alternatif.

  Data pribadi tersebar               Terapkan pembatasan akses dan
                                      pemilahan data publik.

  Data tidak diperbarui               Sediakan fitur pembaruan data dan
                                      pemeriksaan berkala.
  -----------------------------------------------------------------------

## 16. Asumsi dan Ketergantungan

1.  Proyek versi pertama merupakan prototipe aplikasi berbasis web.
2.  Data pedagang untuk pengembangan dan pengujian dapat menggunakan
    data simulasi.
3.  Penerapan nyata membutuhkan koordinasi dengan instansi pemerintah
    daerah yang berwenang.
4.  Data wilayah harus menggunakan referensi administratif yang benar
    dan diperiksa sebelum dimasukkan ke sistem.
5.  Penggunaan peta digital membutuhkan koneksi internet ketika
    mengambil peta dasar dari penyedia layanan.
6.  Ketersediaan dan ketentuan penggunaan layanan peta mengikuti
    kebijakan penyedianya.
7.  Aplikasi tidak menentukan legalitas lokasi berjualan secara
    otomatis.

## 17. Pengembangan Selanjutnya

Setelah MVP berhasil dibuat dan diuji, fitur berikut dapat
dipertimbangkan:

-   Notifikasi perubahan status pengajuan.
-   Riwayat perubahan data usaha.
-   Ekspor laporan ke Excel atau PDF.
-   Statistik persebaran PKL berdasarkan wilayah.
-   Pengelolaan beberapa usaha dalam satu akun.
-   Modul pendataan dan pemantauan lokasi oleh petugas lapangan.
-   Integrasi dengan layanan pemerintah apabila telah memperoleh
    persetujuan dan akses resmi.

## 18. Penutup

Smart Street Vendor merupakan rancangan sistem informasi berbasis web
yang bertujuan membantu pendataan, pengelolaan, dan pemetaan pedagang
kaki lima di Kota Bandar Lampung. Aplikasi ini menyediakan layanan bagi
admin pemerintah daerah, pedagang, dan masyarakat melalui fitur yang
disesuaikan dengan kebutuhan masing-masing pengguna.

Pengembangan tahap pertama difokuskan pada pendaftaran pedagang,
pengelolaan informasi usaha, verifikasi data, pemetaan lokasi,
pencarian, dan laporan. Dengan ruang lingkup yang terarah, aplikasi
diharapkan dapat dikembangkan secara bertahap, diuji menggunakan data
simulasi, dan selanjutnya dievaluasi bersama calon pengguna serta
instansi terkait.

------------------------------------------------------------------------

**Akhir Dokumen PRD Smart Street Vendor --- Versi 1.0**
