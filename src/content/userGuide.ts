/**
 * Single source for the ORBIS user guide (Bahasa Indonesia).
 * Rendered in-app by src/routes/guide/index.tsx and exported to docs/USER_GUIDE.md
 * by scripts/build_user_guide.mjs, so this file must stay free of runtime imports.
 * Inline text supports **bold** and `code`.
 */

export type GuideTone = 'brand' | 'info' | 'success' | 'warning' | 'danger'

export type GuideIcon =
  | 'language'
  | 'layout'
  | 'concept'
  | 'ai'
  | 'approval'
  | 'graph'
  | 'investigation'
  | 'operations'
  | 'dashboard'
  | 'glossary'

export type GuideBlock =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'callout'; tone: GuideTone; title: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'flow'; items: { label: string; detail?: string }[] }
  | { type: 'links'; items: { label: string; path: string }[] }
  | { type: 'faq'; items: { q: string; a: string }[] }
  /** Interactive control shown only in the app */
  | { type: 'widget'; name: 'languageToggle' }

export interface GuideSection {
  id: string
  title: string
  summary: string
  icon: GuideIcon
  /** Marks the two focus areas of the guide */
  highlight?: 'ai' | 'trace'
  blocks: GuideBlock[]
}

export const GUIDE_META = {
  title: 'Panduan Pengguna ORBIS',
  subtitle: 'AI Production Intelligence & Dairy Traceability',
  welcome: 'Selamat datang di ORBIS',
  intro:
    'ORBIS membantu pabrik susu menyusun rencana produksi harian dengan bantuan AI dan menelusuri setiap liter susu dari peternakan sampai produk jadi. Panduan ini dimulai dari pengaturan bahasa, lalu fokus pada dua kemampuan utama: **Perencanaan Produksi AI** dan **Ketertelusuran berbasis graf**.',
  demoNote: 'Seluruh angka di prototipe ini adalah **data demo sintetis** (skenario 30 Oktober). ID aset dan SKU mengikuti katalog resmi.'
}

export const QUICK_START: { label: string; detail: string; sectionId: string }[] = [
  { label: 'Atur bahasa', detail: 'Ganti ke Bahasa Indonesia', sectionId: 'bahasa' },
  { label: 'Cek kondisi', detail: 'Dashboard dan alert', sectionId: 'dashboard' },
  { label: 'Rencanakan dengan AI', detail: 'Forecast, konfigurasi, generate', sectionId: 'ai' },
  { label: 'Setujui jadwal', detail: 'Human-in-the-loop', sectionId: 'jadwal' },
  { label: 'Telusuri susu', detail: 'Graf, mundur, maju', sectionId: 'trace' }
]

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'bahasa',
    title: '1. Langkah pertama: atur bahasa',
    summary: 'Aplikasi terbuka dalam Bahasa Inggris. Ganti ke Bahasa Indonesia sebelum mulai bekerja.',
    icon: 'language',
    blocks: [
      {
        type: 'p',
        text: 'Saat pertama kali dibuka, ORBIS memakai bahasa **EN (English)**. Semua label menu, judul halaman, status, dan pesan aturan tersedia dalam dua bahasa: **EN** dan **ID**.'
      },
      { type: 'heading', text: 'Cara 1: dari header (paling cepat)' },
      {
        type: 'steps',
        items: [
          'Lihat header di bagian atas layar, di sebelah kanan jam WIB.',
          'Klik ikon **globe** (Language / Bahasa).',
          'Pada panel kecil yang muncul, klik **ID**. Seluruh tampilan langsung berganti ke Bahasa Indonesia.'
        ]
      },
      { type: 'heading', text: 'Cara 2: dari halaman Pengaturan' },
      {
        type: 'steps',
        items: [
          'Klik **avatar** (inisial nama) di pojok kanan atas.',
          'Pilih **Settings / Pengaturan**.',
          'Pada baris **Bahasa**, pilih **ID**.'
        ]
      },
      { type: 'widget', name: 'languageToggle' },
      {
        type: 'callout',
        tone: 'info',
        title: 'Pilihan bahasa tersimpan otomatis',
        text: 'Bahasa yang dipilih disimpan di browser perangkat ini (kunci `orbis-locale`), jadi tidak perlu diatur ulang setiap membuka aplikasi. Di perangkat atau browser lain, atur sekali lagi.'
      },
      {
        type: 'list',
        items: [
          'Jam di header selalu memakai zona waktu pabrik **WIB (Asia/Jakarta)**, apa pun bahasanya.',
          'Format tanggal dan angka mengikuti bahasa: ID memakai titik sebagai pemisah ribuan (contoh 12.000 L).',
          'Kode teknis seperti `MILK_BALANCE`, `FL-01`, atau `AT-01` tidak diterjemahkan karena berasal dari katalog resmi pabrik.'
        ]
      }
    ]
  },
  {
    id: 'mengenal',
    title: '2. Mengenal tampilan',
    summary: 'Sidebar berisi empat kelompok menu; header berisi pencarian, jam, peringatan, bahasa, dan akun.',
    icon: 'layout',
    blocks: [
      {
        type: 'table',
        head: ['Kelompok sidebar', 'Modul', 'Dipakai untuk'],
        rows: [
          ['Pantau', 'Dashboard', 'Ringkasan kondisi pabrik hari ini'],
          ['Operasional', 'Data Operasional', 'Alur fisik susu: pengiriman sampai aktual produksi'],
          ['Operasional', 'Ketertelusuran Susu', 'Batch, transfer, graf relasi, telusur mundur/maju, audit log'],
          ['Perencanaan', 'Perencanaan Produksi AI', 'Forecast, konfigurasi, generate plan, skenario, rekomendasi'],
          ['Perencanaan', 'Jadwal Produksi', 'Jadwal aktif, kalender, alokasi, persetujuan, rencana vs aktual'],
          ['Sistem', 'Master Data & Pengaturan', 'Katalog produk, aset, rute, eligibilitas line, aturan']
        ]
      },
      {
        type: 'list',
        items: [
          '**Tab modul** muncul di bawah judul halaman. Garis ungu menandai tab yang aktif.',
          '**Kotak pencarian** di header mencari nama modul dan tab. Ketik misalnya "telusur" lalu pilih hasilnya.',
          '**Ikon lonceng** menampilkan peringatan pabrik. Klik salah satu untuk langsung ke halaman penyebabnya.',
          '**Chip sumber data** di kanan atas judul menunjukkan asal data: skenario demo (data operasional) atau katalog resmi (master data).',
          '**Label ungu bertanda kilau** menandai keluaran AI. Bagian 4 menjelaskan cara membacanya.',
          'Sidebar bisa diciutkan menjadi ikon saja agar area kerja lebih lebar.'
        ]
      }
    ]
  },
  {
    id: 'konsep',
    title: '3. Konsep dasar: Master Data vs Data Operasional',
    summary: 'Master Data adalah aturan main pabrik; Data Operasional adalah apa yang terjadi hari ini.',
    icon: 'concept',
    blocks: [
      {
        type: 'p',
        text: 'Dua jenis data ini menjadi bahan baku AI. Memahami bedanya membuat rekomendasi AI lebih mudah dibaca.'
      },
      {
        type: 'table',
        head: ['', 'Master Data', 'Data Operasional'],
        rows: [
          ['Pertanyaan', 'Apa yang boleh dan mungkin dilakukan pabrik?', 'Apa yang sedang terjadi sekarang?'],
          ['Sifat', 'Statis, jarang berubah', 'Dinamis, berubah setiap jam'],
          ['Contoh', 'FL-01 boleh mengisi Chocolate; ganti rasa butuh 60 menit; CIP akhir produksi 60 menit', 'Tanker TRK-B02 diprediksi terlambat; level tangki susu mentah saat ini; ada 3 order produksi hari ini'],
          ['Analogi', 'Resep dan denah dapur', 'Pesanan dan stok bahan hari ini'],
          ['Siapa yang mengubah', 'Admin atau engineer, saat aturan pabrik berubah', 'Operator, QA, dan sistem pabrik sepanjang shift']
        ]
      },
      {
        type: 'flow',
        items: [
          { label: 'Master Data + Data Operasional', detail: 'Aturan + kondisi hari ini' },
          { label: 'AI Planning', detail: 'Usulan rencana produksi' },
          { label: 'Persetujuan', detail: 'Keputusan planner' },
          { label: 'Jadwal & aktual', detail: 'Eksekusi di lantai produksi' },
          { label: 'Ketertelusuran', detail: 'Bukti dan audit' }
        ]
      },
      {
        type: 'callout',
        tone: 'brand',
        title: 'Aturan praktis',
        text: 'Sehari-hari Anda cukup bekerja di Dashboard, Data Operasional, Perencanaan Produksi AI, Jadwal Produksi, dan Ketertelusuran. Master Data hanya dibuka ketika aturan atau katalog pabrik berubah.'
      }
    ]
  },
  {
    id: 'ai',
    title: '4. Perencanaan Produksi dengan AI',
    summary: 'AI memprediksi ketersediaan susu, menyusun urutan produksi per filling line, lalu setiap usulan diperiksa terhadap aturan pabrik.',
    icon: 'ai',
    highlight: 'ai',
    blocks: [
      {
        type: 'p',
        text: 'Modul **Perencanaan Produksi AI** adalah inti ORBIS. AI tidak sekadar menampilkan angka: ia membaca kondisi hari ini, menyusun draf jadwal, memeriksa setiap aturan, dan menjelaskan alasannya. Keputusan akhir tetap di tangan **Production Planner**.'
      },
      { type: 'heading', text: 'Cara kerja AI dalam satu alur' },
      {
        type: 'flow',
        items: [
          { label: 'Input', detail: 'Master Data + Data Operasional' },
          { label: 'Forecast AI', detail: 'Prediksi susu dan ETA' },
          { label: 'Optimizer', detail: 'Susun urutan per line' },
          { label: 'Cek aturan', detail: 'Lolos, peringatan, pelanggaran' },
          { label: 'Revisi pending', detail: 'Menunggu persetujuan' },
          { label: 'Planner', detail: 'Setujui atau tolak' }
        ]
      },
      { type: 'heading', text: 'Dua jenis label AI' },
      {
        type: 'table',
        head: ['Label', 'Artinya', 'Muncul di'],
        rows: [
          ['Forecast AI', 'Keluaran model prediksi, disertai tingkat keyakinan (confidence) atau rentang nilai', 'Forecasting, Dashboard'],
          ['Optimizer', 'Penyusun jadwal otomatis: urutan order, changeover, dan CIP per filling line. Di prototipe ini masih berbasis aturan sebagai placeholder model AI', 'Generate plan, Skenario, Rekomendasi']
        ]
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Keyakinan AI bukan jaminan',
        text: 'Confidence adalah keluaran model. Hasil **cek aturan** (Lolos, Peringatan, Pelanggaran) adalah validasi pasti terhadap batasan pabrik. Selalu baca keduanya sebelum menyetujui rencana.'
      },
      { type: 'heading', text: 'Langkah A: Forecasting' },
      {
        type: 'steps',
        items: [
          'Buka **Perencanaan Produksi AI**, tab **Forecasting**.',
          'Baca empat kartu: **susu tersedia hari ini** (prediksi AI + confidence), **susu sudah release**, **susu menunggu lab/dalam perjalanan**, dan **prediksi besok** (dengan rentang).',
          'Grafik penerimaan susu menampilkan riwayat harian, hari ini (ungu penuh), dan prediksi (garis putus-putus).',
          'Tabel **kebutuhan susu** menghitung liter susu yang diperlukan rencana untuk produk plain dan flavoured. Kotak di bawahnya menunjukkan hasil cek `MILK_BALANCE`.',
          'Tabel **prediksi ETA** menunjukkan truk yang diperkirakan terlambat datang atau terlambat hasil labnya.'
        ]
      },
      { type: 'heading', text: 'Langkah B: Konfigurasi' },
      {
        type: 'steps',
        items: [
          'Buka tab **Konfigurasi**.',
          'Ubah **jumlah pack** dan **prioritas** tiap order bila ada perubahan permintaan.',
          'Atur **kecepatan filling line** (pack/jam), **utilisasi** (%) untuk memperhitungkan henti mesin, dan **jam mulai**.',
          'Atur durasi **changeover**: ganti rasa (VARIANT), ganti ukuran (SIZE), ganti kertas (PAPER), serta durasi **CIP**.',
          'Badge di samping judul menunjukkan apakah konfigurasi **berubah** dari revisi yang disetujui. Klik **Kembalikan ke yang disetujui** untuk membatalkan.',
          'Klik **Pratinjau rencana** untuk lanjut ke Generate plan.'
        ]
      },
      { type: 'heading', text: 'Langkah C: Generate plan' },
      {
        type: 'steps',
        items: [
          'Tab **Generate plan** langsung menampilkan **pratinjau timeline** per filling line: blok produksi, changeover, CIP, dan waktu tunggu.',
          'Periksa tabel **hasil per order**: jam selesai, batas waktu, dan keterlambatan.',
          'Periksa **daftar cek aturan** di sebelah kanan beserta ringkasan jumlah lolos, peringatan, dan pelanggaran.',
          'Jika ada **pelanggaran**, tombol **Generate plan** terkunci. Kembali ke Konfigurasi dan sesuaikan.',
          'Jika aman, klik **Generate plan**. ORBIS membuat revisi baru (contoh `PLAN-1030-v2`) berstatus **menunggu persetujuan**, lalu tampil tombol **Buka persetujuan**.'
        ]
      },
      { type: 'heading', text: 'Langkah D: Skenario (simulasi what-if)' },
      {
        type: 'p',
        text: 'Tab **Skenario** menjalankan beberapa alternatif sekaligus dengan aturan yang sama, tanpa mengubah rencana resmi. Klik satu baris untuk melihat timeline dan masalah utamanya.'
      },
      {
        type: 'table',
        head: ['Skenario', 'Pertanyaan yang dijawab'],
        rows: [
          ['Baseline rekomendasi', 'Bagaimana jadwal usulan dengan konfigurasi saat ini?'],
          ['Bagi chocolate ke FL-01 dan FL-02', 'Apakah order lebih cepat selesai jika dibagi dua line dan FL-02 menunggu AT-01 berganti produk?'],
          ['Bagi chocolate tanpa menunggu', 'Apa yang terjadi jika FL-02 langsung mulai saat AT-01 masih berisi Full Cream? (biasanya melanggar AT_SAME_PRODUCT)'],
          ['FL-02 breakdown', 'Jika FL-02 rusak dan semua order pindah ke FL-01, order mana yang terlambat?'],
          ['Ganti rasa 60 menit', 'Berapa dampaknya jika changeover rasa memakai SOP standar 60 menit?'],
          ['TRK-B01 ditolak', 'Cukupkah susu jika satu tanker ditolak lab (berkurang 13.000 L)?']
        ]
      },
      { type: 'heading', text: 'Langkah E: Rekomendasi' },
      {
        type: 'list',
        items: [
          '**Banner ungu** merangkum jadwal yang direkomendasikan per line, dengan tombol **Buka jadwal**.',
          '**Mengapa rencana ini**: jumlah order tepat waktu, kebutuhan susu vs ketersediaan, durasi ganti rasa, dan jam selesai.',
          '**Risiko**: hanya cek aturan yang berstatus peringatan atau pelanggaran.',
          '**Alternatif per peringatan**: untuk setiap pemicu (breakdown, kapasitas tangki, holding time, urutan, changeover, susu kurang) AI menampilkan usulan, dampaknya terhadap jam selesai dan jumlah order terlambat, serta tautan **Buka** ke halaman terkait.'
        ]
      },
      { type: 'heading', text: 'Membaca hasil cek aturan' },
      {
        type: 'table',
        head: ['Status', 'Arti', 'Tindakan'],
        rows: [
          ['Lolos', 'Aturan terpenuhi', 'Tidak perlu tindakan'],
          ['Peringatan', 'Rencana bisa jalan, tetapi ada risiko (contoh order terlambat, holding time hampir habis)', 'Tinjau dan putuskan; boleh disetujui'],
          ['Pelanggaran', 'Melanggar batasan pabrik', 'Rencana tidak bisa di-generate atau disetujui; ubah konfigurasi'],
          ['Tidak bisa dihitung', 'Data belum tersedia di skenario', 'Abaikan atau lengkapi data']
        ]
      },
      {
        type: 'table',
        head: ['Kode aturan', 'Yang diperiksa'],
        rows: [
          ['MILK_BALANCE', 'Susu yang sudah lolos lab cukup untuk seluruh rencana'],
          ['LINE_PRODUCT', 'Filling line boleh mengisi SKU tersebut (sesuai eligibilitas)'],
          ['AT_SAME_PRODUCT', 'Dua line yang berbagi satu tangki aseptik tidak mengisi produk berbeda bersamaan'],
          ['AT_SHARED_FLOW', 'Total tarikan dari tangki aseptik tidak melebihi batas alirnya'],
          ['SIMULTANEOUS', 'Setelah ganti produk, tangki aseptik sempat CIP dan terisi ke level minimum'],
          ['HOLDING', 'Susu di tangki simpan belum melewati batas waktu simpan'],
          ['RECEIVING_GATE', 'Bongkar tanker baru dimulai setelah QA me-release hasil lab'],
          ['PLAN', 'Setiap order selesai sebelum batas waktunya']
        ]
      },
      {
        type: 'callout',
        tone: 'brand',
        title: 'Prinsip human-in-the-loop',
        text: 'AI hanya mengusulkan. ORBIS tidak pernah mengaktifkan rencana, me-release mutu, atau menjalankan produksi tanpa persetujuan manusia. Setiap usulan dan keputusan tercatat di Audit Log.'
      },
      {
        type: 'links',
        items: [
          { label: 'Forecasting', path: '/ai-planning/forecasting' },
          { label: 'Konfigurasi', path: '/ai-planning/configuration' },
          { label: 'Generate plan', path: '/ai-planning/generate' },
          { label: 'Skenario', path: '/ai-planning/scenarios' },
          { label: 'Rekomendasi', path: '/ai-planning/recommendations' }
        ]
      }
    ]
  },
  {
    id: 'jadwal',
    title: '5. Persetujuan dan jadwal produksi',
    summary: 'Planner membandingkan revisi baru dengan rencana aktif, lalu menyetujui atau menolak. Rencana yang disetujui menjadi jadwal resmi.',
    icon: 'approval',
    highlight: 'ai',
    blocks: [
      { type: 'heading', text: 'Menyetujui atau menolak revisi' },
      {
        type: 'steps',
        items: [
          'Buka **Jadwal Produksi**, tab **Persetujuan** (atau klik **Buka persetujuan** setelah generate).',
          'Bandingkan **timeline** revisi baru dan tabel **perbandingan** dengan rencana aktif: jam selesai, jumlah order terlambat, kebutuhan susu, durasi ganti rasa, dan utilisasi. Nilai yang berubah ditandai ungu.',
          'Baca **masalah cek aturan** pada revisi tersebut.',
          'Isi **catatan**: opsional untuk menyetujui, **wajib** untuk menolak.',
          'Klik **Setujui rencana** atau **Tolak**. Tombol setujui terkunci jika revisi melanggar aturan.',
          'Halaman hasil menampilkan siapa yang memutuskan, kapan, dan catatannya, dengan tautan ke jadwal dan audit log.'
        ]
      },
      {
        type: 'list',
        items: [
          'Jika Anda generate lagi sebelum memutuskan, revisi lama otomatis berstatus **digantikan** (superseded).',
          'Saat revisi disetujui, rencana aktif sebelumnya juga menjadi **digantikan**.',
          'Tabel **riwayat revisi** di bagian bawah mencatat semua versi beserta statusnya.'
        ]
      },
      { type: 'heading', text: 'Setelah disetujui' },
      {
        type: 'table',
        head: ['Tab', 'Isi'],
        rows: [
          ['Jadwal rekomendasi', 'Rencana aktif per filling line: produksi, changeover, CIP'],
          ['Kalender', 'Line, tangki aseptik, dan jendela maintenance sepanjang hari'],
          ['Alokasi mesin', 'Order per filling line dan mesin hulu yang menyuplainya'],
          ['Alokasi tangki', 'Tangki dan batch yang menyuplai setiap order, serta urutan tangki aseptik'],
          ['Rencana vs aktual', 'Jumlah dan waktu rencana dibandingkan produksi yang tercatat']
        ]
      },
      {
        type: 'links',
        items: [
          { label: 'Persetujuan', path: '/production-schedule/approval' },
          { label: 'Jadwal rekomendasi', path: '/production-schedule/recommended' },
          { label: 'Rencana vs aktual', path: '/production-schedule/planned-vs-actual' }
        ]
      }
    ]
  },
  {
    id: 'trace',
    title: '6. Ketertelusuran dan penelusuran graf',
    summary: 'Setiap perpindahan susu dicatat sebagai relasi dalam graf, sehingga asal dan tujuan sebuah batch bisa ditelusuri dalam hitungan detik.',
    icon: 'graph',
    highlight: 'trace',
    blocks: [
      {
        type: 'p',
        text: 'ORBIS memodelkan perjalanan susu sebagai **graf berarah**. Setiap simpul (node) adalah peternakan atau batch di satu aset, dan setiap garis (edge) adalah satu transfer bervolume. Karena satu tanker bisa mengisi beberapa tangki dan satu tangki bisa menyuplai beberapa batch, graf ini menangkap relasi banyak-ke-banyak yang sulit dilacak dengan spreadsheet.'
      },
      {
        type: 'flow',
        items: [
          { label: 'Farm', detail: 'Peternakan' },
          { label: 'Tanker', detail: 'Truk susu' },
          { label: 'Raw milk tank', detail: 'RMT' },
          { label: 'Proses', detail: 'Thermizer, separator' },
          { label: 'Tangki simpan', detail: 'SFP' },
          { label: 'Tangki aseptik', detail: 'AT' },
          { label: 'Barang jadi', detail: 'Lot FG' }
        ]
      },
      { type: 'heading', text: 'Graf relasi' },
      {
        type: 'steps',
        items: [
          'Buka **Ketertelusuran Susu**, tab **Graf relasi**. Kolom graf mengikuti kedalaman: farm di kiri, barang jadi di kanan.',
          '**Klik sebuah node batch**: seluruh leluhur (asal) dan keturunannya (tujuan) disorot ungu; node lain meredup.',
          '**Klik node farm**: semua tanker dari farm itu dan seluruh batch hilirnya disorot.',
          'Klik **Detail batch** untuk membuka panel detail (volume, aset, status, mass balance).',
          'Klik **Hapus pilihan** untuk kembali ke tampilan penuh.',
          'Arahkan kursor ke garis untuk melihat ID transfer atau ID pengiriman.'
        ]
      },
      { type: 'heading', text: 'Telusur mundur (backward trace)' },
      {
        type: 'p',
        text: 'Dipakai saat ada **produk jadi yang bermasalah** dan Anda perlu tahu dari tanker dan farm mana susunya berasal.'
      },
      {
        type: 'steps',
        items: [
          'Buka tab **Telusur mundur**. Secara bawaan terpilih lot `FG-1030-FL01-CH`.',
          'Pilih batch target di kotak **Telusur mundur dari**.',
          'Baca kartu ringkasan: jumlah **farm**, **tanker**, **batch**, dan **barang jadi** yang terlibat.',
          '**Jalur** menampilkan tahapan dari farm sampai batch target.',
          'Tabel batch menunjukkan **porsi kontribusi** setiap batch hulu terhadap target (dalam % dan liter), diurutkan per tahap.',
          'Tabel **transfer** di bawahnya mencatat setiap perpindahan: waktu, asal, tujuan, volume, jenis, dan rute aset.'
        ]
      },
      { type: 'heading', text: 'Telusur maju (forward trace)' },
      {
        type: 'p',
        text: 'Dipakai saat ada **bahan baku yang bermasalah** (contoh hasil lab tanker meragukan) dan Anda perlu tahu produk jadi mana saja yang terdampak.'
      },
      {
        type: 'steps',
        items: [
          'Buka tab **Telusur maju**. Secara bawaan terpilih `RT-A02-1030`.',
          'Pilih batch sumber di kotak **Telusur maju dari** (tanker atau tangki).',
          'Kartu **barang jadi** berwarna peringatan jika ada lot produk jadi yang tercapai dari sumber ini.',
          'Kolom porsi menunjukkan berapa persen setiap batch hilir berasal dari sumber, sehingga cakupan dampak bisa dibatasi secara presisi.'
        ]
      },
      { type: 'heading', text: 'Tab pendukung' },
      {
        type: 'table',
        head: ['Tab', 'Kegunaan'],
        rows: [
          ['Batch', 'Semua batch dari tanker sampai barang jadi. Filter per tahap, cari ID, lihat status **mass balance** (volume masuk = keluar). Klik baris untuk detail.'],
          ['Detail batch', 'Fakta batch, relasi genealogi, alokasi material, dan **verifikasi integritas** (hash event, referensi transaksi). Verifikasi ledger di prototipe ini disimulasikan.'],
          ['Riwayat transfer', 'Setiap transfer beserta rutenya. Panah merah pada rute berarti koneksi antar aset tidak ada di master data rute.'],
          ['Audit log', 'Siapa melakukan apa dan kapan: penerimaan, proses, serta pembuatan, persetujuan, dan penolakan rencana. Bisa difilter per kategori.']
        ]
      },
      {
        type: 'links',
        items: [
          { label: 'Graf relasi', path: '/milk-traceability/graph' },
          { label: 'Telusur mundur', path: '/milk-traceability/backward' },
          { label: 'Telusur maju', path: '/milk-traceability/forward' },
          { label: 'Batch', path: '/milk-traceability/batches' },
          { label: 'Audit log', path: '/milk-traceability/audit-log' }
        ]
      }
    ]
  },
  {
    id: 'investigasi',
    title: '7. Skenario: investigasi mutu dan mock recall',
    summary: 'Contoh lengkap memakai graf untuk menemukan sumber masalah dan membatasi cakupan penarikan produk.',
    icon: 'investigation',
    highlight: 'trace',
    blocks: [
      {
        type: 'p',
        text: 'Situasi: QA menerima laporan rasa menyimpang pada lot Chocolate dari filling line FL-01. Tujuannya menemukan sumber susu, lalu menentukan produk lain yang berpotensi terdampak tanpa menarik seluruh produksi.'
      },
      {
        type: 'steps',
        items: [
          'Di **Dashboard**, cek kartu **Ketertelusuran**: jumlah batch, transfer valid, mass balance, dan batch yang menunggu QA.',
          'Buka **Graf relasi** dan klik lot `FG-1030-FL01-CH` untuk melihat seluruh garis keturunannya.',
          'Buka **Telusur mundur** dari lot tersebut. Catat tanker dan farm asal beserta porsi kontribusinya.',
          'Pilih tanker atau tangki yang dicurigai, lalu buka **Telusur maju** dari batch itu.',
          'Klik **Simulasi 1-Click Mock Recall**. Seluruh batch hilir ditandai **QUARANTINE / RECALL**, dan banner menampilkan jumlah batch terpapar, volume terisolasi, dan SKU jadi yang terblokir.',
          'Klik **Unduh Berita Acara Karantina (CSV)** untuk dokumentasi.',
          'Klik **Reset Simulasi Karantina** untuk kembali ke status normal.'
        ]
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Simulasi, bukan tindakan nyata',
        text: 'Mock recall hanya mengubah tampilan dan menghasilkan dokumen latihan. Keputusan karantina dan recall sebenarnya tetap diambil QA sesuai prosedur pabrik.'
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'Hasil yang diharapkan',
        text: 'Hanya produk yang **terkonfirmasi terhubung** dengan sumber masalah yang ditarik. Produk lain tetap bisa dikirim, sehingga kerugian pabrik lebih kecil.'
      }
    ]
  },
  {
    id: 'operasional',
    title: '8. Data Operasional dan Master Data',
    summary: 'Data Operasional mengikuti jalur fisik susu; Master Data menyimpan katalog dan aturan resmi.',
    icon: 'operations',
    blocks: [
      { type: 'heading', text: 'Data Operasional (urutan jalur fisik)' },
      {
        type: 'flow',
        items: [
          { label: 'Pengiriman' },
          { label: 'Penerimaan & QC' },
          { label: 'Bay bongkar' },
          { label: 'Susu mentah & proses' },
          { label: 'Tangki simpan (SFP)' },
          { label: 'Sterilizer & aseptik' },
          { label: 'Order produksi' },
          { label: 'Aktual produksi' }
        ]
      },
      {
        type: 'table',
        head: ['Tab', 'Yang dipantau'],
        rows: [
          ['Pengiriman', 'Keberangkatan tanker, ETA, kedatangan, dan keterlambatan'],
          ['Penerimaan & QC', 'Sampling, uji lab, dan release. Bongkar baru boleh setelah release (RECEIVING_GATE)'],
          ['Bay bongkar', 'Ketersediaan bay, laju pompa, durasi bongkar, dan CIP antar tanker'],
          ['Susu mentah & proses', 'Tangki susu mentah, thermizer, separator, tangki cream dan mixing'],
          ['Tangki simpan (SFP)', 'Level, aliran, holding time, dan status CIP'],
          ['Sterilizer & aseptik', 'Level tangki aseptik terhadap batas minimum untuk satu atau dua filler'],
          ['Order produksi', 'Volume, kebutuhan susu, prioritas, batas waktu, line yang eligible'],
          ['Aktual produksi', 'Output tercatat per order dan status filling line']
        ]
      },
      { type: 'heading', text: 'Master Data & Pengaturan' },
      {
        type: 'table',
        head: ['Tab', 'Isi'],
        rows: [
          ['Produk & SKU', 'Liquid SKU, finished SKU, ukuran kemasan, market variant'],
          ['Aset', 'Semua aset pabrik dengan parameter dan satuannya'],
          ['Rute', 'Rute material yang diizinkan antar aset (dipakai validasi transfer)'],
          ['Eligibilitas line', 'SKU dan ukuran kemasan yang boleh berjalan di setiap filling line (dipakai LINE_PRODUCT)'],
          ['Aturan & asumsi', 'Katalog constraint, aturan changeover dan CIP, serta asumsi proyek']
        ]
      }
    ]
  },
  {
    id: 'dashboard',
    title: '9. Membaca Dashboard',
    summary: 'Titik awal setiap shift: susu, rencana aktif, peringatan, ketertelusuran, dan status aset dalam satu layar.',
    icon: 'dashboard',
    blocks: [
      {
        type: 'list',
        items: [
          '**Empat KPI**: susu diterima (sudah release), susu tersedia (prediksi AI beserta sisa terhadap kebutuhan rencana), susu menunggu (lab pending dan dalam perjalanan), dan revisi rencana aktif atau yang menunggu persetujuan.',
          '**Neraca volume harian** 06:00 sampai 06:00.',
          '**Timeline rencana aktif** dengan garis waktu saat ini.',
          '**Peringatan**: klik untuk langsung ke halaman penyebab atau ke Rekomendasi AI.',
          '**Rencana vs aktual**: pack baik dibandingkan target sampai jam ini.',
          '**Ketertelusuran**: jumlah batch, transfer valid, mass balance, dan batch menunggu QA, dengan tautan ke graf.',
          '**Status aset**: level tangki dan kecepatan line. Kartu merah muda berarti aset sedang maintenance.'
        ]
      },
      { type: 'links', items: [{ label: 'Dashboard', path: '/dashboard' }] }
    ]
  },
  {
    id: 'glosarium',
    title: '10. Glosarium dan FAQ',
    summary: 'Istilah pabrik yang sering muncul dan jawaban atas pertanyaan umum.',
    icon: 'glossary',
    blocks: [
      {
        type: 'table',
        head: ['Istilah', 'Arti'],
        rows: [
          ['CIP', 'Clean-in-place: pencucian otomatis pipa dan tangki tanpa membongkar mesin'],
          ['Changeover', 'Waktu henti saat ganti rasa (VARIANT), ukuran (SIZE), atau kertas kemasan (PAPER)'],
          ['RMT', 'Raw milk tank: tangki susu mentah setelah bongkar tanker'],
          ['SFP / ST', 'Tangki simpan susu hasil proses sebelum sterilisasi'],
          ['AT', 'Aseptic tank: tangki steril yang menyuplai filling line'],
          ['FL-01 / FL-02', 'Filling line: mesin pengisi kemasan'],
          ['Holding time', 'Batas waktu susu boleh disimpan di tangki'],
          ['Mass balance', 'Pengecekan bahwa volume masuk sama dengan volume keluar sebuah batch'],
          ['Revisi rencana', 'Satu versi rencana produksi (contoh PLAN-1030-v2) dengan status disetujui, menunggu, ditolak, atau digantikan'],
          ['Forward / backward trace', 'Penelusuran maju (ke produk jadi) atau mundur (ke asal susu) di graf']
        ]
      },
      {
        type: 'faq',
        items: [
          { q: 'Apakah AI bisa langsung menjalankan produksi?', a: 'Tidak. AI hanya mengusulkan rencana. Rencana baru aktif setelah planner menekan Setujui rencana.' },
          { q: 'Mengapa tombol Generate plan tidak bisa diklik?', a: 'Pratinjau melanggar setidaknya satu aturan pabrik. Lihat daftar cek aturan, ubah konfigurasi, lalu coba lagi.' },
          { q: 'Apa beda Skenario dan Generate plan?', a: 'Skenario hanya simulasi untuk membandingkan alternatif. Generate plan membuat revisi resmi yang menunggu persetujuan.' },
          { q: 'Data saya hilang setelah halaman dimuat ulang?', a: 'Prototipe menyimpan revisi rencana di memori browser. Memuat ulang halaman mengembalikan skenario ke kondisi awal. Hanya pilihan bahasa yang tersimpan.' },
          { q: 'Apakah angka di aplikasi ini data nyata?', a: 'Belum. Semua angka adalah data demo sintetis untuk skenario 30 Oktober.' }
        ]
      }
    ]
  }
]
