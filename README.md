# SEA Catering: Makanan Sehat, Kapan Saja, Di Mana Saja
## Gambaran Umum Proyek

SEA Catering adalah aplikasi web modern yang dibangun dengan Next.js dan Firebase, dirancang untuk memberikan pengalaman yang mulus bagi pengguna untuk berlangganan paket makanan sehat dan mengirimkannya langsung ke pintu mereka. Misi kami adalah membuat makan sehat dapat diakses dan nyaman bagi semua orang, menawarkan pilihan makanan yang dapat disesuaikan dan informasi nutrisi yang terperinci.

## Fitur Utama

### Fitur untuk Pengguna:

* **Halaman Utama**: Halaman utama yang menarik yang menampilkan misi kami, menyoroti manfaat utama seperti kustomisasi makanan dan pengiriman nasional, serta menampilkan testimonial pelanggan. Pengguna juga dapat mengirimkan ulasan dan peringkat mereka sendiri.
* **Paket Makanan**: Jelajahi berbagai paket makanan sehat, termasuk Diet Plan, Protein Plan, dan Royal Plan, masing-masing dengan deskripsi terperinci dan harga.
* **Manajemen Langganan**: Berlangganan paket makanan dengan mudah, pilih jenis makanan yang disukai (Sarapan, Makan Siang, Makan Malam), pilih hari pengiriman, dan tentukan alergi atau batasan diet apa pun.
* **Dasbor Pengguna**: Dasbor yang dipersonalisasi bagi pengguna untuk melihat dan mengelola langganan aktif mereka, dengan opsi untuk menjeda, membatalkan, atau mengaktifkan kembali paket.
* **Autentikasi Aman**: Fungsionalitas pendaftaran dan login pengguna yang aman untuk mengelola akun pribadi dan langganan.
* **Hubungi Kami**: Halaman khusus dengan informasi kontak untuk pertanyaan dan dukungan.

### Fitur untuk Admin:

* **Dasbor Admin**: Gambaran umum yang komprehensif bagi administrator untuk memantau semua langganan, melacak langganan baru, pendapatan berulang bulanan (MRR), reaktivasi, dan pertumbuhan langganan secara keseluruhan. Termasuk fitur filter data berdasarkan tanggal.

## Tumpukan Teknologi

* **Frontend**:
    * [Next.js](https://nextjs.org/) (Kerangka Kerja React)
    * [React](https://react.dev/)
    * [Tailwind CSS](https://tailwindcss.com/) (untuk styling)
* **Backend/Database**:
    * [Firebase](https://firebase.google.com/) (Autentikasi, Firestore Database)

## Memulai

Ikuti instruksi ini untuk menyiapkan dan menjalankan proyek secara lokal di mesin Anda.

### Prasyarat

Pastikan Anda telah menginstal Node.js (direkomendasikan versi 18.18.0 atau lebih tinggi) dan npm/yarn/pnpm/bun.

### Instalasi

1.  **Kloning repositori:**
    ```bash
    git clone [ganti_dengan_url_repo_anda]
    cd sea-catering-app
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    # atau
    pnpm install
    # atau
    bun install
    ```

### Variabel Lingkungan

Proyek ini menggunakan Firebase untuk layanan backend-nya. Anda perlu mengkonfigurasi kredensial proyek Firebase Anda.

1.  Buat file `.env.local` di root proyek Anda:
    ```
    .env.local
    ```
2.  Tambahkan detail konfigurasi Firebase Anda ke file ini. Anda dapat menemukannya di [Konsol Firebase](https://console.firebase.google.com/) di bawah **Project settings** > **Your apps** > cuplikan "Config" aplikasi web.

    ```dotenv
    NEXT_PUBLIC_FIREBASE_API_KEY="KUNCI_API_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="DOMAIN_AUTENTIKASI_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="ID_PROYEK_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="BUCKET_PENYIMPANAN_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="ID_PENGIRIM_PESAN_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_APP_ID="ID_APLIKASI_FIREBASE_ANDA"
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="ID_PENGUKURAN_FIREBASE_ANDA"
    ```
    **Penting**: Ganti nilai placeholder (`KUNCI_API_FIREBASE_ANDA`, dll.) dengan kredensial proyek Firebase Anda yang sebenarnya.

### Menjalankan Server Pengembangan

Untuk menjalankan aplikasi dalam mode pengembangan:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev