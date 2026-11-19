# FINORA — Personal Finance App v1.0

Aplikasi pengelolaan keuangan pribadi modern yang dirancang sesuai spesifikasi UI/UX Design Specification v1.0. Finora membantu mencatat pemasukan & pengeluaran, mengelola batas anggaran bulanan, memantau target tabungan impian, serta menganalisis kesehatan finansial melalui visualisasi grafik yang intuitif.

---

## 🚀 Fitur Utama

1. **Dashboard Finansial Komprehensif**
   - 4 Kartu Metrik Keuangan: **Total Saldo**, **Total Pemasukan**, **Total Pengeluaran**, dan **Arus Kas Bersih**.
   - Grafik interaktif Arus Kas (Pemasukan vs Pengeluaran).
   - Widget Ringkasan Anggaran (Budget Overview) dengan visualisasi progres.
   - 5 Transaksi Terbaru dengan penanda nominal hijau (+Rp) dan merah (-Rp).

2. **Manajemen Transaksi (CRUD & Filter)**
   - Filter tab: `[Semua]`, `[Pemasukan]`, `[Pengeluaran]`.
   - Pencarian real-time & filter kategori transaksi.
   - Pengelompokan daftar berdasarkan tanggal (`DD MMMM YYYY`).
   - Formulir Tambah/Edit Transaksi dengan validasi lengkap (*Nama, Jenis, Nominal > 0, Kategori, Tanggal, Catatan*).
   - Modal Detail Transaksi & konfirmasi hapus aman.

3. **Manajemen Anggaran (Budget Management)**
   - Pemilihan Periode (Bulan & Tahun).
   - Ringkasan: Total Anggaran, Total Pengeluaran, dan Sisa Anggaran.
   - 3 Status Progres Anggaran Otomatis:
     - 🟢 **0–74% (Aman)**
     - 🟡 **75–99% (Mendekati batas)**
     - 🔴 **100%+ (Melebihi anggaran)**
   - Buat, edit, dan hapus anggaran per kategori.

4. **Target Tabungan (Savings Goals)**
   - Buat dan pantau impian finansial (contoh: Membeli Laptop, Liburan ke Bali).
   - Indikator progres target tabungan (`#9333EA`).
   - Fitur cepat: **Tambah / Tarik Tabungan Virtual** dengan preset nominal.
   - Pencatatan virtual (tidak memotong saldo operasional utama).

5. **Laporan Keuangan (Financial Reports)**
   - Filter rentang: *Hari Ini*, *Minggu Ini*, *Bulan Ini*, *Tahun Ini*, dan *Custom Date*.
   - Grafik Bar perbandingan arus kas pemasukan vs pengeluaran.
   - Donut / Pie Chart distribusi pengeluaran per kategori.
   - Analisis Keuangan Finora (*Pengeluaran terbesar, sumber pemasukan utama, rasio simpanan*).

6. **Kalkulator Keuangan Terintegrasi**
   - Operasi dasar matematika (`+`, `-`, `×`, `÷`, `%`).
   - Fitur preset Diskon instan (10%, 20%, 30%, 50%).
   - Tampilan ekspresi dan hasil live dalam format Rupiah (IDR).
   - Tombol **"Gunakan untuk Transaksi"**: langsung mengisi nominal hasil kalkulator ke formulir transaksi baru.

7. **Aksesibilitas & Mode Akses**
   - **Guest Mode**: langsung dapat digunakan tanpa login, seluruh data tersimpan di `localStorage` peramban Anda.
   - **Account Mode**: profil pengguna (nama, email, avatar preset), dengan opsi migrasi data dari mode Guest.
   - Tombol Reset Data ke nilai sampel dokumen spesifikasi Finora Bab 9.
   - Toast feedback notifikasi untuk setiap aksi sukses/error.

8. **Desain Responsif Konsisten**
   - **Desktop**: Left Navigation Sidebar (`#142C53`), Topbar pencarian global.
   - **Mobile**: Bottom Navigation (`[Dashboard] [Transaksi] [Lainnya]`), floating button tambah transaksi, touch-friendly sheets.
   - Palet warna resmi Finora (`#2563EB`, `#142C53`, `#EFF6FF`, `#16A34A`, `#DC2626`, `#F59E0B`, `#9333EA`, `#F5F7FC`).

---

## 🛠️ Menjalankan Aplikasi

Pastikan Node.js telah terinstal di komputer Anda.

1. Buka terminal di folder proyek:
   ```bash
   cd C:\Users\AXIOO\finora
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser pada alamat yang ditampilkan di terminal (biasanya `http://localhost:5173`).

4. Untuk build produksi:
   ```bash
   npm run build
   npm run preview
   ```
