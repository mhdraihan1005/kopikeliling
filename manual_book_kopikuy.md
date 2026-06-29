# BUKU PANDUAN PENGGUNA (USER MANUAL / MANUAL BOOK)
## APLIKASI LAYANAN KOPI KELILING - KOPIKUY

---

## 1. PENDAHULUAN
**KopiKuy** adalah platform aplikasi web modern yang dirancang untuk menjembatani pecinta kopi dengan gerobak kopi keliling (mobile coffee carts). Aplikasi ini menyediakan dua antarmuka utama, yaitu antarmuka **Pelanggan (Customer)** untuk memesan menu kopi berkualitas premium, dan antarmuka **Administrator (Mitra/Owner)** untuk mengelola menu, pesanan, pengguna, serta laporan penjualan secara real-time.

Buku panduan ini disusun secara sistematis untuk memudahkan pengguna dalam memahami alur kerja aplikasi, mulai dari pendaftaran akun hingga proses keluar (*logout*) dari sistem.

---

## 2. PANDUAN PENGGUNAAN - ROLE PELANGGAN (CUSTOMER)

### Langkah 1: Registrasi Akun Baru (Register)
Sebelum dapat melakukan transaksi, pengguna baru diwajibkan untuk mendaftarkan akun terlebih dahulu.
1. Buka browser dan arahkan ke alamat halaman pendaftaran (contoh: `http://localhost:3000/register`).
2. Isi formulir pendaftaran dengan data diri lengkap:
   * **Nama Lengkap**
   * **Alamat Email**
   * **Nomor WhatsApp/Telepon**
   * **Kata Sandi (Password)**
3. Klik tombol **Daftar Akun**.
4. Setelah pendaftaran berhasil, Anda akan dialihkan secara otomatis ke halaman Login.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman register, lalu sisipkan di sini.*

---

### Langkah 2: Masuk ke Akun (Login)
1. Akses halaman masuk aplikasi di `http://localhost:3000/login`.
2. Masukkan **Alamat Email** dan **Kata Sandi** yang telah didaftarkan sebelumnya.
3. Klik tombol **Masuk**.
4. Sistem akan melakukan autentikasi. Jika berhasil, Anda akan diarahkan ke Halaman Utama (Landing Page/Dashboard).

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman login, lalu sisipkan di sini.*

---

### Langkah 3: Menjelajahi Halaman Utama (Landing Page)
Setelah sukses login, pelanggan disambut oleh Halaman Utama.
* Halaman ini berisi banner promosi (seperti *Welcome Discount*), penjelasan singkat keunggulan KopiKuy, serta tombol pintas untuk langsung melakukan pemesanan.
* Gunakan bilah navigasi (navbar) di bagian atas untuk berpindah halaman (**Home, Menu, Riwayat, Logout**).

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman utama/landing page pelanggan.*

---

### Langkah 4: Memilih Menu dan Melakukan Pemesanan (Halaman Menu)
1. Klik menu **Order Now** atau pilih tab **Menu** pada navbar.
2. Anda akan diarahkan ke katalog produk kopi yang tersedia.
3. Pilih produk yang diinginkan, atur kuantitas (*quantity*), lalu klik **Tambah ke Keranjang (Add to Cart)**.
4. Periksa ringkasan pesanan di keranjang belanja.
5. Klik **Lanjutkan Pembayaran (Checkout)** jika pesanan sudah sesuai.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman katalog menu dan keranjang belanja.*

---

### Langkah 5: Pembayaran dan Halaman Invoice
1. Setelah checkout, sistem akan memproses pesanan dan mengalihkan Anda ke halaman **Invoice** (dengan ID transaksi unik).
2. Halaman ini memuat detail pesanan, rincian biaya, metode pembayaran, serta nomor pembayaran.
3. Simpan atau catat nomor invoice untuk melakukan konfirmasi fisik kepada barista gerobak keliling saat kopi diserahkan.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman detail Invoice pasca pemesanan.*

---

### Langkah 6: Riwayat Transaksi (Riwayat)
1. Klik tab **Riwayat** di bilah navigasi atas.
2. Halaman ini menyajikan tabel daftar pesanan yang pernah Anda lakukan sebelumnya.
3. Anda dapat melihat status transaksi (misal: *Pending, Completed, Cancelled*).
4. Klik **Detail** pada salah satu baris untuk melihat kembali invoice transaksi lama.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman Riwayat Transaksi.*

---

### Langkah 7: Keluar dari Sistem (Logout)
1. Untuk mengakhiri sesi penggunaan aplikasi, klik tombol **Logout** pada bilah navigasi atas.
2. Sistem akan menghapus sesi login Anda secara aman dan mengembalikan Anda ke halaman login/landing page umum.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) notifikasi/transisi setelah logout.*

---

## 3. PANDUAN PENGGUNAAN - ROLE ADMINISTRATOR (MITRA/OWNER)

### Langkah 1: Login Administrator
1. Akses portal admin (biasanya dikonfigurasi melalui rute login khusus, seperti `/login` dengan akun berstatus Admin).
2. Masukkan kredensial administrator.
3. Klik **Masuk**. Anda akan masuk ke layout khusus admin dengan sidebar navigasi.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman login khusus admin.*

---

### Langkah 2: Dashboard Panel Admin
Setelah login berhasil, admin akan diarahkan ke halaman statistik/dashboard admin (`/admin`).
* Halaman ini memuat ringkasan ringkas berupa grafik/metrik jumlah pesanan harian, total pendapatan harian/bulanan, total pelanggan aktif, serta jumlah pesanan masuk yang perlu diproses.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) dashboard utama admin.*

---

### Langkah 3: Manajemen Menu (Menu Management)
Akses menu **Menu** di panel navigasi samping (sidebar):
1. **Tambah Produk Baru**: Klik tombol *Tambah Menu*, isi form nama kopi, deskripsi, harga, kategori, dan upload foto produk. Lalu klik *Simpan*.
2. **Edit Produk**: Klik ikon pensil di samping daftar produk untuk mengubah harga atau ketersediaan stok kopi.
3. **Hapus Produk**: Klik ikon tempat sampah untuk menghapus menu dari katalog pelanggan.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman pengelolaan data menu.*

---

### Langkah 4: Mengelola Pesanan (Orders Management)
Akses menu **Orders** di sidebar:
1. Admin dapat memantau pesanan masuk secara real-time.
2. Terdapat rincian nama pembeli, item pesanan, total harga, dan status.
3. Klik tombol status untuk mengubah dari **Pending** -> **Processing** -> **Completed** jika kopi sudah disajikan ke pembeli.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman manajemen pesanan pelanggan.*

---

### Langkah 5: Laporan Keuangan (Reports)
Akses menu **Reports** di sidebar:
* Menyajikan ringkasan data transaksi per bulan/minggu dalam bentuk tabel ekspor atau grafik penjualan.
* Admin dapat menggunakan data ini untuk evaluasi penjualan harian gerobak kopi keliling.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) halaman laporan keuangan penjualan.*

---

### Langkah 6: Pengaturan Akun dan Logout Admin
1. Akses halaman **Settings** untuk mengganti profil mitra atau informasi gerobak.
2. Jika semua pekerjaan manajemen telah selesai, klik tombol **Logout** di pojok kiri bawah sidebar untuk mengamankan panel admin dari akses ilegal.

> **[TEMPATKAN SCREENSHOT DI SINI]**
> *Ambil tangkapan layar (screenshot) tombol logout admin dan halaman setelah sukses keluar.*

---
> [!NOTE]
> Seluruh ilustrasi antarmuka di atas wajib disesuaikan dengan skema warna premium KopiKuy (perpaduan warna hitam elegan dan sentuhan emas/amber).
