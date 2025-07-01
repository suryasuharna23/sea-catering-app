SEA Catering App
Selamat datang di repositori aplikasi SEA Catering! Aplikasi ini dibangun sebagai bagian dari tantangan teknis untuk menyediakan platform pemesanan makanan sehat yang dapat disesuaikan untuk pelanggan di seluruh Indonesia.

Aplikasi ini mencakup fungsionalitas dari Level 1 hingga Level 5, termasuk halaman statis, navigasi interaktif, sistem berlangganan dengan integrasi database, autentikasi pengguna, dan dashboard untuk pengguna dan admin.

Fitur Utama
Homepage: Halaman beranda yang menarik dengan informasi bisnis, slogan, fitur utama, dan detail kontak.

Menu / Meal Plans: Tampilan interaktif rencana makanan dengan detail modal.

Testimonials: Bagian testimonial yang menampilkan ulasan pelanggan dan formulir untuk mengirimkan testimonial baru (disimpan di Firestore).

Subscription System: Formulir berlangganan yang komprehensif dengan perhitungan harga otomatis dan penyimpanan data ke Firestore.

User Authentication & Authorization:

Registrasi, login, dan logout pengguna.

Validasi kata sandi yang kuat.

Hanya pengguna terautentikasi yang dapat mengakses fitur berlangganan dan dashboard pengguna.

User Dashboard: Pengguna dapat melihat langganan aktif mereka, serta menjeda, membatalkan, atau mengaktifkan kembali langganan.

Admin Dashboard: Dashboard untuk admin untuk melihat metrik bisnis utama seperti langganan baru, MRR, reaktivasi, dan pertumbuhan langganan, dengan filter tanggal.

Teknologi yang Digunakan
Frontend Framework: Next.js (dengan React)

Styling: Tailwind CSS

Database & Authentication: Google Firebase (Firestore, Authentication)

Persyaratan Sistem
Pastikan Anda memiliki Node.js (versi 18.17 atau lebih tinggi) dan npm (atau Yarn/pnpm) terinstal di sistem Anda.

Pengaturan Proyek
Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek secara lokal:

1. Kloning Repositori
git clone https://github.com/YOUR_USERNAME/sea-catering-app.git
cd sea-catering-app

Ganti YOUR_USERNAME dengan username GitHub Anda.

2. Instal Dependensi
npm install
# atau
yarn install
# atau
pnpm install