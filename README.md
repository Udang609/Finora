# 💳 FINORA: Personal Finance App

[![Release](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Currency](https://img.shields.io/badge/Currency-IDR%20(Rp)-emerald.svg)](https://github.com)

**Finora** adalah aplikasi pengelolaan keuangan pribadi (*Personal Finance Management*) modern yang dirancang untuk membantu pengguna memantau arus kas, mengontrol pengeluaran melalui sistem batas anggaran, merencanakan target tabungan impian, serta menganalisis kesehatan finansial harian hingga tahunan.

Dibangun dengan estetika **Clean Dashboard & Modern Minimalist**, Finora menghadirkan pengalaman antarmuka yang ramah pengguna baik pada perangkat **Desktop (Web)** maupun **Mobile**.

---

## 📖 Deskripsi Produk

### 🎯 Latar Belakang & Masalah
Banyak orang kesulitan mengetahui ke mana perginya uang mereka setiap akhir bulan karena proses pencatatan manual yang rumit dan tidak adanya visualisasi yang jelas. Selain itu, aplikasi keuangan yang mengharuskan proses registrasi rumit sejak awal sering kali membuat pengguna enggan mulai mencatat.

### 💡 Solusi Finora
Finora memecahkan masalah ini dengan:
1. **Login Cepat Cukup Pakai Nama:** Langsung masuk dan kelola keuangan hanya dengan memasukkan nama. Tanpa email, tanpa nomor HP, dan tanpa kata sandi.
2. **Privasi 100% Lokal:** Seluruh data keuangan tersimpan aman di browser lokal Anda tanpa dikirim ke server pihak ketiga.
3. **Format Asli Rupiah (IDR):** Seluruh nominal disajikan dengan pemisah ribuan standar Indonesia (`Rp10.000.000`).
4. **Kontrol Proaktif (Smart Budgeting):** Peringatan dini 3 status sebelum pengeluaran melampaui batas anggaran.
5. **Kalkulator Terintegrasi:** Hitung diskon belanja dan persentase, lalu masukkan langsung ke form transaksi dengan satu klik.

---

## 🌟 Fitur Unggulan

### 1. Dashboard Keuangan Interaktif
- **Ringkasan 4 Metrik Finansial:** Total Saldo Berjalan, Akumulasi Pemasukan, Total Pengeluaran, dan Arus Kas Bersih (Surplus / Defisit).
- **Grafik Tren Arus Kas:** Visualisasi batang perbandingan pemasukan vs pengeluaran 5 bulan terakhir.
- **Ringkasan Anggaran (Budget Overview):** Pemantauan cepat penggunaan dana pada kategori teranggarkan.
- **5 Transaksi Terkini:** Akses instan ke mutasi keuangan terbaru dengan kode warna hijau (+Rp) dan merah (-Rp).

### 2. Manajemen Transaksi Komprehensif
- Pencatatan cepat dengan klasifikasi tipe (*Pemasukan* / *Pengeluaran*).
- Filter multikategori (*Gaji, Makanan & Minuman, Transportasi, Belanja, Tagihan, Kesehatan, dll.*).
- Filter tab: `Semua`, `Pemasukan`, `Pengeluaran`.
- Fitur pencarian teks instan (mencari judul, kategori, nominal, atau catatan transaksi).
- Pengelompokan daftar berdasarkan tanggal Indonesia (`DD MMMM YYYY`).
- Konfirmasi dialog aman untuk mencegah penghapusan data secara tidak sengaja.

### 3. Kontrol Anggaran Cerdas (Budgeting)
- Alokasi anggaran bulanan per kategori pengeluaran.
- Indikator status progres 3 warna otomatis:
  - 🟢 **0% – 74% (Aman):** Pengeluaran masih di bawah kontrol.
  - 🟡 **75% – 99% (Mendekati Batas):** Waspada terhadap sisa kuota belanja.
  - 🔴 **100%+ (Melebihi Anggaran):** Dana telah melampaui alokasi yang ditentukan.

### 4. Target Tabungan Impian (Savings Goals)
- Rencanakan tujuan finansial virtual (*contoh: Membeli Laptop Kerja, Dana Liburan, Dana Darurat*).
- Progress bar visual warna ungu (`#9333EA`) dengan tanggal target pencapaian.
- Modal penyesuaian cepat: **Tambah / Tarik Tabungan Virtual** lengkap dengan preset nominal cepat (+Rp50rb, +Rp100rb, +Rp500rb, +Rp1jt).
- *Virtual Tracking:* Tidak memotong saldo rekening operasional secara otomatis.

### 5. Laporan & Analisis Arus Kas (Reports)
- Filter rentang waktu: **Hari Ini**, **Minggu Ini**, **Bulan Ini**, **Tahun Ini**, dan **Custom Date Range**.
- Grafik Donut/Pie distribusi pengeluaran berdasarkan proporsi kategori.
- Kartu **Insight & Analisis Finora**:
  - Pengeluaran terbesar & persentasenya.
  - Sumber pemasukan utama.
  - Rasio tabungan (*Saving Ratio*).

### 6. Kalkulator Keuangan Terpadu
- Kalkulator numerik dengan keypad responsif (`0-9`, `00`, `.`, `+`, `-`, `×`, `÷`, `%`).
- Input persentase **Diskon Sendiri** sesuai kebutuhan, lalu terapkan langsung ke nominal.
- Fitur **"Gunakan untuk Transaksi"**: Otomatis mentransfer hasil hitungan ke modal transaksi baru tanpa perlu menyalin manual.

### 7. Pengaturan & Aksesibilitas
- **Login Privat Pakai Nama:** Masuk cepat tanpa email atau nomor HP.
- Pengaturan profil: Nama pengguna dan pilihan Avatar.
- Opsi **Keluar / Ganti Pengguna:** Kembali ke layar login dengan data lokal tetap terlindungi.
- Opsi **Bersihkan Data:** Mengosongkan seluruh catatan transaksi, anggaran, dan tabungan agar akun kembali bersih.
- **Sinkronisasi Cloud (Opsional):** Aktifkan di tab "Akun & Sesi" untuk sinkron data real-time ke Firebase Firestore. Bisa diakses dari HP, laptop, dan tablet lain dengan nama yang sama. Data tetap tersimpan lokal sebagai cadangan offline.

---

## ☁️ Sinkronisasi Cloud (Multi-Perangkat)

Finora mendukung **sinkronisasi real-time antar perangkat** melalui Firebase Firestore (gratis hingga 1 GB/bulan).

### Cara Mengaktifkan
1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Authentication** → *Sign-in method* → **Anonymous** (enable).
3. Aktifkan **Firestore Database** → *Start in test mode* (atau atur rules manual).
4. Salin konfigurasi Web App ke file `.env` (lihat `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
5. Jalankan `npm run dev` atau deploy ulang.
6. Di aplikasi: **Pengaturan → Akun & Sesi → Sinkronisasi Cloud → Aktifkan**.

### Perilaku
| Kondisi | Perilaku |
|---------|----------|
| **Online + Sync Aktif** | Perubahan langsung terkirim ke cloud, perangkat lain update real-time. |
| **Offline** | Perubahan tersimpan di `localStorage` lokal. Saat online kembali, Firestore *offline persistence* otomatis sinkronkan. |
| **Sync Dimatikan** | Aplikasi kembali mode 100% lokal. Data cloud tidak terhapus, hanya tidak dipakai. |
| **Ganti Nama Pengguna** | Data cloud terikat pada Firebase UID (anonim). Jika login nama beda di perangkat lain, data tidak tercampur. |

> **Catatan:** Tanpa konfigurasi `.env`, opsi sinkronisasi tetap muncul tapi dinonaktifkan. Data Anda tetap aman 100% lokal.

---

## 🎨 Design System & Palet Warna

| Token Finora | Kode Hex | Peruntukan Desain |
| :--- | :--- | :--- |
| **Primary Blue** | `#2563EB` | Tombol CTA utama, status aktif navigasi, fokus state |
| **Dark Blue** | `#142C53` | Background sidebar web desktop & branding |
| **Light Blue** | `#EFF6FF` | Background kartu aksen & badge kategori |
| **Green** | `#16A34A` | Transaksi pemasukan, status anggaran aman, surplus |
| **Red** | `#DC2626` | Transaksi pengeluaran, peringatan over-budget, tombol hapus |
| **Orange** | `#F59E0B` | Status waspada anggaran & fitur diskon kalkulator |
| **Purple** | `#9333EA` | Target tabungan & kartu impian masa depan |
| **Background** | `#F5F7FC` | Background aplikasi bersih (*soft clean canvas*) |
| **Text Primary** | `#172554` | Tipografi judul dan nominal keuangan utama |
| **Text Secondary** | `#64748B` | Keterangan tanggal, caption, dan teks pendukung |

---

## 💻 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Storage:** React Context API + Persistent LocalStorage Engine
- **Mobile:** Capacitor 8 (Android) + PWA (installable, offline shell)
- **CI/CD:** GitHub Actions (GitHub Pages + build APK otomatis)

---

## 📲 PWA (Install dari Browser)

Finora dapat dipasang langsung dari browser tanpa Play Store:

1. Buka **https://udang609.github.io/Finora/** di Chrome atau Edge (Android/desktop).
2. Ketuk tombol **Pasang Finora di HP** yang muncul di bawah layar, atau buka menu browser lalu pilih **Pasang aplikasi**.
3. Di iPhone/iPad, buka lewat Safari, ketuk **Bagikan**, lalu **Tambah ke Layar Utama**.

Setelah terpasang, Finora berjalan dalam mode `standalone` (tanpa address bar) dan shell aplikasi tetap bisa dibuka saat koneksi terputus. Data keuangan tetap tersimpan lokal di perangkat.

---

## 📱 Versi Android (APK)

Finora tersedia sebagai aplikasi Android native melalui **Capacitor**. File APK dibangun otomatis oleh GitHub Actions setiap kali ada push ke branch `main`.

- **Download APK terbaru:** [GitHub Releases: Finora v1.0.0](https://github.com/Udang609/Finora/releases/latest)
- **Regenerate ikon & splash Android:** `npm run assets:android`
- **Build manual (lokal):**
  ```bash
  npm run build
  npx cap sync android
  cd android
  ./gradlew assembleDebug
  ```
  Hasil APK: `android/app/build/outputs/apk/debug/app-debug.apk`

> Catatan: APK ini adalah *debug build* (belum ditandatangani untuk Google Play). Aktifkan **"Install from unknown sources"** pada perangkat Android sebelum memasang.

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/username/finora.git
   cd finora
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

4. **Build untuk produksi:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **MIT**. Silakan digunakan dan dikembangkan untuk keperluan pribadi maupun portofolio.
