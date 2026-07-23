MANUAL BOOK
APLIKASI  - KOPIKUY


















PETUNJUK PENGGUNAAN APLIKASI 
KopiKuy




















KopiKuy  adalah platform aplikasi web modern yang dirancang untuk menjembatani pecinta kopi dengan gerobak kopi keliling (mobile coffee carts). Aplikasi ini menyediakan dua antarmuka utama, yaitu antarmuka Pelanggan (Customer)untuk memesan menu kopi berkualitas premium, dan antarmuka  Administrator (Mitra/Owner) untuk mengelola menu, pesanan, pengguna, serta laporan penjualan secara real-time.

Buku panduan ini disusun secara sistematis untuk memudahkan pengguna dalam memahami alur kerja aplikasi, mulai dari pendaftaran akun hingga proses keluar (logout) dari sistem.


PANDUAN PENGGUNAAN - ROLE PELANGGAN (CUSTOMER)

 Langkah 1: Registrasi Akun Baru (Register)
Sebelum dapat melakukan transaksi, pengguna baru diwajibkan untuk mendaftarkan akun terlebih dahulu.
1. Buka browser dan arahkan ke alamat halaman pendaftaran (contoh: `http://localhost:3000/register`).


2. Isi formulir pendaftaran dengan data diri lengkap:

* Nama Lengkap
* Alamat Email   
* Kata Sandi (Password)

3. Klik tombol Daftar Akun


4. Setelah pendaftaran berhasil, Anda akan dialihkan secara otomatis ke halaman Login.




Langkah 2: Masuk ke Akun (Login)
1. Akses halaman masuk aplikasi di `http://localhost:3000/login
`.
2. Masukkan Alamat Email  dan Kata Sandi yang telah didaftarkan sebelumnya.

3. Klik tombol Masuk


4. Sistem akan melakukan autentikasi. Jika berhasil, Anda akan diarahkan ke Halaman Utama (Landing Page/Dashboard).



Langkah 3: Menjelajahi Halaman Utama (Landing Page)
Setelah sukses login, pelanggan disambut oleh Halaman Utama.
 Halaman ini berisi banner promosi (seperti Welcome Discount), penjelasan singkat keunggulan KopiKuy, serta tombol pintas untuk langsung melakukan pemesanan.
Gunakan bilah navigasi (navbar) di bagian atas untuk berpindah halaman (Home, Menu, Riwayat, Logout).





 Langkah 4: Memilih Menu dan Melakukan Pemesanan dan pembayaran(Halaman Menu)
1. tab Menu pada navbar.

2. Anda akan diarahkan ke katalog produk kopi yang tersedia.

3. Klik Order


4. Periksa ringkasan pesanan di keranjang belanja 
5. Atur Kuantias 

6. Pilih Metode Dine in/pickup

7. Klik Lanjutkan Pembayaran (Checkout) jika pesanan sudah sesuai.

8. Pilih Metode Pembayaran


9. Lalu bayar





---

Langkah 5: Halaman Invoice
Setelah checkout, sistem akan memproses pesanan dan mengalihkan Anda ke halaman Invoice (dengan ID transaksi unik) dapat melihat status transaksi (misal: Pending, Completed, Cancelled).
1. 



2. Halaman ini memuat detail pesanan, rincian biaya, metode pembayaran, serta nomor pembayaran.


3. Rating







Langkah 6: Keluar dari Sistem (Logout)
1. Untuk mengakhiri sesi penggunaan aplikasi, klik tombol Logout pada bilah navigasi atas



2. Sistem akan menghapus sesi login Anda secara aman dan mengembalikan Anda ke halaman login/landing page umum. 


 3. PANDUAN PENGGUNAAN - ROLE ADMINISTRATOR (MITRA/OWNER)

Langkah 1: Login Administrator
1. Akses portal admin (biasanya dikonfigurasi melalui rute login khusus, seperti `/login` dengan akun berstatus Admin).
2. Masukkan kredensial administrator.
3. Klik Masuk. Anda akan masuk ke layout khusus admin dengan sidebar navigasi.


Langkah 2: Dashboard Panel Admin
Setelah login berhasil, admin akan diarahkan ke halaman statistik/dashboard admin (`/admin`).
 Halaman ini memuat ringkasan ringkas berupa grafik/metrik jumlah pesanan harian, total pendapatan harian/bulanan, total pelanggan aktif, serta jumlah pesanan masuk yang perlu diproses.

 Langkah 3: Manajemen Menu (Menu Management)
Akses menu Menu di panel navigasi samping (sidebar):
1.Tambah Produk Baru: Klik tombol Tambah Menu, isi form nama kopi, deskripsi, harga, kategori, dan upload foto produk. Lalu klik Simpan.
2. Edit Produk: Klik ikon pensil di samping daftar produk untuk mengubah harga atau ketersediaan stok kopi.
3. Hapus Produk: Klik ikon tempat sampah untuk menghapus menu dari katalog pelanggan.



 Langkah 4: Mengelola Pesanan (Orders Management)
Akses menu Orders di sidebar:
1. Admin dapat memantau pesanan masuk secara real-time.
2. Terdapat rincian nama pembeli, item pesanan, total harga, dan status.
3. Klik tombol status untuk mengubah dari Pending > Processing > Completed jika kopi sudah disajikan ke pembeli.


Langkah 5: Laporan Keuangan (Reports)
Akses menu Reports di sidebar:
Menyajikan ringkasan data transaksi per bulan/minggu dalam bentuk tabel ekspor atau grafik penjualan.
Admin dapat menggunakan data ini untuk evaluasi penjualan harian gerobak kopi keliling.



 Langkah 6: Pengaturan Akun dan Logout Admin
1. Akses halaman Settings untuk mengganti profil mitra atau informasi gerobak.
2. Jika semua pekerjaan manajemen telah selesai, klik tombol Logout di pojok kiri bawah sidebar untuk mengamankan panel admin dari akses ilegal.



