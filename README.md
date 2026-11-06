# ORBIS (AI Production Intelligence & Dairy Traceability)

Sistem ketertelusuran bahan baku dan pendukung keputusan perencanaan produksi untuk industri pengolahan susu berbasis graf dan kecerdasan buatan.

---

## 🥛 Latar Belakang & Masalah

Pada industri pengolahan susu segar (*dairy processing*), alur material bergerak cepat dan saling bercabang:
1. Susu diperah di peternakan (*farm*).
2. Diangkut menggunakan truk tangki berinsulasi (*road tanker*).
3. Ditampung di tangki penyimpanan pabrik (*storage tank / silo*).
4. Diolah dan dialirkan ke tangki aseptik serta mesin pengisian (*filling line*).
5. Dikemas menjadi lot produk jadi (*finished goods*).

**Tantangan di lapangan:**
* **Relasi Many-to-Many**: Satu truk tangki bisa mendistribusikan susu ke beberapa tangki penyimpanan, dan satu tangki penyimpanan bisa menyuplai bahan untuk beberapa batch produksi sekaligus.
* **Pencatatan Masih Tersebar**: Catatan penerimaan tanker, uji lab, dan pengemasan sering kali tersimpan terpisah di berbagai file Excel operasional.
* **Investigasi Kualitas Lambat**: Saat tim Quality Assurance (QA) menemukan anomali rasa atau kontaminasi bakteri pada suatu batch di pasar, penelusuran manual membutuhkan waktu lama. Akibatnya, pabrik terpaksa menarik (*recall*) produk dalam cakupan yang terlalu luas karena tidak tahu pasti produk mana saja yang benar-benar terpapar.

---

## 💡 Solusi yang Dihadirkan ORBIS

ORBIS hadir sebagai platform terintegrasi yang menghubungkan seluruh titik kejadian operasional (*Critical Tracking Events*) mulai dari peternakan hingga produk akhir:

### 1. Smart Excel Ingestion & Validation
* Menerima input catatan harian operasional berbasis file Excel dari lapangan.
* Melakukan pemetaan kolom secara cerdas (*smart column mapping*) dengan skor keyakinan (*confidence score*).
* Memisahkan data valid dari anomali struktural (*missing value*, format tanggal keliru, unit ambigu) agar staf cukup meninjau baris yang membutuhkan koreksi manual sebelum data masuk ke *event ledger*.

### 2. Graph-Based Traceability (DAG)
* Memodelkan riwayat material dalam bentuk graf berarah (*Directed Acyclic Graph*):
  $$\text{Farm} \xrightarrow{\text{SUPPLIED\_TO}} \text{Tanker} \xrightarrow{\text{DISCHARGED\_INTO}} \text{Storage Tank} \xrightarrow{\text{PRODUCED}} \text{Batch} \xrightarrow{\text{FINISHED\_GOODS}} \text{Lot}$$
* **Forward Trace**: Melacak dari bahan baku/truk tangki tertentu ke depan untuk melihat batch dan lot mana saja yang terbuat dari bahan tersebut.
* **Backward Trace**: Melacak dari suatu lot produk jadi bermasalah ke belakang untuk menemukan tangki, truk, dan peternakan asalnya kurang dari hitungan detik.

### 3. AI Production Planning & Recommendation
* Memprediksi potensi *bottleneck* penjadwalan produksi berdasarkan data historis dan parameter riil mesin.
* Menganalisis waktu henti pembersihan dan pergantian rasa (*flavour changeover*), misalnya merekomendasikan produksi varian *Full Cream* sebelum *Strawberry* guna menghemat waktu henti hingga 45 menit.
* Memvalidasi batasan teknis pabrik secara otomatis (misal: mesin *filling* hanya boleh aktif jika kapasitas *Aseptic Tank* di atas 50%).
* Keputusan akhir tetap berada di tangan *Production Planner* (*Human-in-the-Loop*).

### 4. Quality Investigation & Precision Scoping
* Saat ada laporan deviasi atau hasil uji lab yang meragukan, sistem langsung mengisolasi material yang terkonfirmasi terhubung (*confirmed relationship*) dan menandai produk hilir yang berpotensi terdampak (*potentially affected*).
* Menghindari penarikan produk massal yang tidak perlu dan menghemat kerugian operasional pabrik.

### 5. Audit Trail & Integrity Check
* Setiap aksi penting (persetujuan jadwal produksi, pembuatan batch, penerimaan truk tangki) dicatat ke dalam *event ledger* dengan bukti *hash* integritas data.
* Mencegah manipulasi catatan operasional saat dilakukan audit berkala.

---

## 🛠️ Tech Stack & Arsitektur

* **Aplikasi**: Progressive Web App (PWA) berbasis **React 19**, **TypeScript**, dan **Vite**.
* **Styling & UI**: **Tailwind CSS v4** dengan implementasi *Design System* khusus industri manufaktur.
* **Service Worker**: `@vite-plugin-pwa` dengan *Workbox* untuk caching dan kesiapan *offline-mode* di lingkungan pabrik.
* **Hosting**: Siap di-deploy langsung ke **Vercel** melalui konfigurasi `vercel.json`.

---

## 🚀 Panduan Menjalankan Project

### Prasyarat
* Node.js (versi 18 ke atas disarankan)
* npm

### 1. Masuk ke Direktori Project
```bash
cd G:\tiara-project\orbis
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat yang tertera (biasanya `http://localhost:5173`).

### 4. Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 📌 Struktur Modul Aplikasi

Aplikasi menyediakan navigasi langsung di bagian atas layar (*quick switcher bar*) untuk mengakses alur operasional:
1. **Production Planning**: Ringkasan utilisasi tangki, lini aktif, jadwal *filling machine*, dan status operasional.
2. **AI Recommendation & Simulation**: Analisis urutan batch terbaik, validasi kapasitas, dan simulasi jadwal.
3. **Incoming Tanker**: Pemantauan kedatangan truk tangki susu, status uji lab sampel, serta progress pembongkaran (*unloading*).
4. **Data Management**: Alur unggah Excel harian, pemetaan kolom cerdas, validasi data baris, hingga konfirmasi ledger.
5. **Traceability**: Visual graf alur material, penelusuran maju (*forward*), mundur (*backward*), dan rincian batch.
6. **Quality Investigation**: Manajemen investigasi kendala mutu dan klasifikasi dampak produk.
7. **Audit Trail**: Verifikasi integritas catatan kejadian (*hash integrity match*).
8. **Design System**: Dokumentasi fondasi warna, tipografi, dan komponen antarmuka.
