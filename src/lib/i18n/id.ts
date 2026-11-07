import type { Messages } from './en'

export const id: Messages = {
  brand: {
    name: 'ORBIS',
    tagline: 'Intelijen Produksi AI'
  },
  shell: {
    search: 'Cari pesanan, tanker...',
    language: 'Bahasa',
    mobileShift: 'Shift A',
    userMeta: '30 Okt 2026 · Shift A',
    toggleNav: 'Buka navigasi'
  },
  lang: {
    en: 'EN',
    id: 'ID'
  },
  nav: {
    group: {
      operations: 'Operasi',
      traceability: 'Ketertelusuran',
      system: 'Sistem'
    },
    module: {
      dashboard: 'Dasbor',
      'ai-intelligence': 'Intelijen AI',
      'production-planning': 'Perencanaan Produksi',
      'incoming-tanker': 'Tanker Masuk',
      'data-management': 'Manajemen Data',
      traceability: 'Ketertelusuran',
      'quality-investigation': 'Investigasi Mutu',
      'audit-trail': 'Jejak Audit',
      settings: 'Pengaturan'
    },
    page: {
      dashboard: 'Dasbor',
      settings: 'Pengaturan',
      'production-planning': 'Rencana',
      'ai-recommendation': 'Rekomendasi AI',
      'schedule-simulation': 'Simulasi',
      'planning-approval': 'Persetujuan',
      'planning-rejection': 'Penolakan',
      'ai-prediction-detail': 'Detail prediksi',
      'ai-production-risk': 'Risiko produksi',
      'prediction-insufficient': 'Data tidak cukup',
      'tanker-overview': 'Ringkasan',
      'tanker-detail': 'Detail tanker',
      'tanker-lab-status': 'Status lab',
      'tanker-unloading': 'Bongkar muat',
      'tanker-lab-pending': 'Lab tertunda',
      'tanker-delayed': 'Tertunda',
      'data-management-overview': 'Ringkasan',
      'data-management-upload': 'Unggah',
      'data-management-mapping': 'Pemetaan kolom',
      'data-management-validation': 'Validasi',
      'data-management-preview': 'Pratinjau',
      'data-management-history': 'Riwayat',
      'data-management-error': 'Gagal impor',
      'data-management-mapping-review': 'Tinjauan pemetaan',
      'traceability-overview': 'Ringkasan',
      'traceability-graph': 'Graf relasi',
      'traceability-forward': 'Telusur maju',
      'traceability-backward': 'Telusur mundur',
      'traceability-batch': 'Detail batch',
      'quality-investigation-overview': 'Ringkasan',
      'quality-investigation-detail': 'Detail investigasi',
      'affected-batch-analysis': 'Batch terdampak',
      'affected-products': 'Produk terdampak',
      'audit-trail-overview': 'Ringkasan',
      'audit-event-detail': 'Detail peristiwa',
      'audit-integrity-check': 'Cek integritas'
    },
    meta: {
      'ai-intelligence': 'Model diperbarui',
      'production-planning': 'Horizon rencana',
      'incoming-tanker': 'Umpan ETA',
      traceability: 'Cek ledger terakhir',
      'audit-trail': 'Cek ledger terakhir'
    }
  },
  status: {
    recorded: 'Tercatat',
    verified: 'Terverifikasi',
    'hash verified': 'Hash terverifikasi',
    mismatch: 'Tidak cocok',
    match: 'Cocok',
    'integrity match': 'Integritas cocok',
    'not recorded': 'Belum tercatat',
    ready: 'Siap',
    pending: 'Tertunda',
    review: 'Tinjauan',
    'in review': 'Sedang ditinjau',
    validated: 'Tervalidasi',
    valid: 'Valid',
    approved: 'Disetujui',
    completed: 'Selesai',
    complete: 'Selesai',
    imported: 'Diimpor',
    success: 'Berhasil',
    passed: 'Lulus',
    pass: 'Lulus',
    rejected: 'Ditolak',
    failed: 'Gagal',
    error: 'Error',
    invalid: 'Tidak valid',
    critical: 'Kritis',
    high: 'Tinggi',
    medium: 'Sedang',
    warning: 'Peringatan',
    low: 'Rendah',
    open: 'Terbuka',
    investigating: 'Investigasi',
    'under investigation': 'Dalam investigasi',
    'potentially affected': 'Berpotensi terdampak',
    'potential impact': 'Dampak potensial',
    confirmed: 'Terkonfirmasi',
    hold: 'Ditahan',
    'on hold': 'Ditahan',
    closed: 'Ditutup',
    'in progress': 'Berjalan',
    running: 'Berjalan',
    draft: 'Draf',
    insufficient: 'Tidak cukup',
    'needs review': 'Perlu tinjauan',
    active: 'Aktif',
    'on the way': 'Dalam perjalanan',
    arrived: 'Tiba',
    sampling: 'Pengambilan sampel',
    'lab test': 'Uji lab',
    'lab pending': 'Lab tertunda',
    receiving: 'Penerimaan',
    released: 'Dirilis',
    unloading: 'Bongkar muat',
    stored: 'Tersimpan',
    delayed: 'Tertunda',
    'insufficient data': 'Data tidak cukup'
  },
  common: {
    returnToWorkflow: 'Kembali ke alur kerja',
    export: 'Ekspor',
    downloadCsv: 'Unduh CSV',
    syntheticReview: 'Data demo sintetis · tinjauan manusia diperlukan jika ditandai'
  },
  schedule: {
    plain: 'Plain (Full Cream)',
    flavoured: 'Berperisa',
    changeover: 'Pergantian',
    cip: 'CIP'
  },
  pages: {
    dashboard: {
      title: 'Dasbor',
      description: 'Ringkasan pabrik untuk perencanaan dan ketertelusuran',
      emptyTitle: 'Dasbor segera hadir',
      emptyDescription: 'Gunakan Perencanaan Produksi atau Ketertelusuran untuk menelusuri alur prototipe.',
      emptyAction: 'Buka Perencanaan Produksi'
    },
    settings: {
      title: 'Pengaturan',
      description: 'Preferensi ruang kerja, shift, dan integrasi',
      emptyTitle: 'Pengaturan segera hadir',
      emptyDescription: 'Prototipe ini hanya berjalan pada data operasional sintetis.'
    },
    'production-planning': {
      title: 'Rencana produksi',
      description: 'Penjadwalan berbantuan AI untuk susu mentah, tangki, dan jalur filling',
      uploadOrders: 'Unggah pesanan',
      aiRecommendation: 'Rekomendasi AI',
      shiftKpis: 'KPI shift',
      shiftKpisSubtitle: 'Snapshot stok awal 06:00 · Shift A',
      availableRawMilk: 'Susu mentah tersedia',
      vsYesterday: '+8,4% vs kemarin',
      plannedOrders: 'Pesanan terencana',
      dueThisShift: '3 jatuh tempo shift ini',
      tankUtilization: 'Utilisasi tangki',
      withinRange: 'Dalam rentang operasi',
      activeLines: 'Jalur aktif',
      readyToRun: 'Siap jalan',
      scheduleAlerts: 'Peringatan jadwal',
      needsReview: 'Perlu tinjauan',
      shiftOutlook: 'Proyeksi shift',
      shiftOutlookSubtitle: 'Prakiraan AI untuk urutan sore',
      analysisReady: 'Analisis siap',
      predictedBottleneck: 'Bottleneck terprediksi',
      flavourDelayTitle: 'Pergantian rasa dapat menambah 45 menit',
      flavourDelayBody: 'pada urutan sore.',
      recommendation: 'Rekomendasi: jalankan Full Cream sebelum Strawberry',
      confidenceNote: 'Confidence adalah keluaran model — validasi constraint sebelum persetujuan.',
      productionSchedule: 'Jadwal produksi',
      scheduleSubtitle: 'Hari ini · 07:00–19:00',
      openSimulation: 'Buka simulasi',
      filling1: 'Mesin Filling 1',
      filling2: 'Mesin Filling 2',
      changeover: 'Pergantian',
      operationalStatus: 'Status operasional',
      rawMilkAvailability: 'Ketersediaan susu mentah',
      machineReadiness: 'Kesiapan mesin',
      machineReadyValue: 'Filling 1 + Filling 2',
      reviewItems: '2 item tinjauan',
      alertChangeoverTitle: 'Jendela pergantian 45 menit',
      alertChangeoverDetail: 'Strawberry → Full Cream di Mesin Filling 1 memerlukan CIP_FLAVOUR',
      alertAtTitle: 'Ambang AT-02 tervalidasi di 52,5%',
      alertAtDetail: 'Dua filler diizinkan di atas level minimum 50%',
      syntheticNote: 'Data sintetis · Aturan constraint ditampilkan terpisah dari prakiraan AI.'
    },
    'ai-recommendation': {
      title: 'Rekomendasi AI',
      description: 'Tinjau keluaran model, validasi constraint, lalu setujui dengan keyakinan',
      compareSchedule: 'Bandingkan jadwal',
      reject: 'Tolak',
      approve: 'Setujui rekomendasi',
      eyebrow: 'Urutan yang direkomendasikan',
      recTitle: 'Pindahkan Full Cream 1L sebelum Strawberry 1L',
      recDescription: 'Dampak yang diharapkan: pulihkan 45 menit · kedua jalur filling tetap aktif',
      pipeline: 'Alur keputusan',
      pipelineSubtitle: 'Setiap langkah harus lolos sebelum rencana ke lantai produksi',
      why: 'Mengapa rekomendasi ini?'
    },
    'schedule-simulation': {
      title: 'Simulasi jadwal',
      description:
        'Logika operasional yang dikoreksi · pergantian 45 menit tetap ada karena urutan produk tidak berubah',
      approve: 'Setujui alternatif',
      scenario: 'Hasil skenario',
      scenarioSubtitle: 'Baseline vs alternatif valid pada Mesin Filling 1',
      compare: 'Bandingkan urutan',
      compareSubtitle: '07:00–14:00 · Mesin Filling 1',
      optimization: 'Hasil optimasi'
    },
    'planning-approval': {
      title: 'Rencana disetujui',
      resultTitle: 'Urutan alternatif disetujui; peristiwa audit EVT-1030-882 tercatat',
      viewEvent: 'Lihat peristiwa audit'
    },
    'planning-rejection': {
      title: 'Rencana ditolak',
      resultTitle: 'Alternatif ditolak; jadwal baseline tetap aktif'
    },
    'ai-prediction-detail': {
      title: 'Prediksi durasi proses',
      description: 'Prediksi sintetis untuk B-2026-1030-01 · dihasilkan setelah sinyal delay TRK-045',
      insufficient: 'Lihat kasus data tidak cukup',
      modelOutput: 'Keluaran model',
      inputFactors: 'Faktor input',
      historical: 'Perbandingan historis',
      historicalSubtitle: 'Bagaimana prediksi dibanding shift serupa'
    },
    'ai-production-risk': {
      title: 'Analisis risiko produksi',
      description: 'Risiko terdeteksi dari skenario tanker tertunda'
    },
    'prediction-insufficient': {
      title: 'Prediksi tidak tersedia',
      resultTitle: 'Data tidak cukup untuk menghasilkan prediksi yang andal',
      returnToPrediction: 'Kembali ke prediksi',
      uploadData: 'Unggah data operasional'
    },
    'tanker-overview': {
      title: 'Pemantauan tanker masuk',
      description: 'Pantau ketersediaan susu mentah dari peternakan hingga penyimpanan',
      today: 'Hari ini',
      todaySubtitle: 'Penerimaan susu mentah · periode 06:00–06:00',
      queue: 'Antrian tanker',
      queueSubtitle: 'Pilih tanker untuk mengikuti lab dan bongkar muat'
    },
    'tanker-detail': {
      title: 'Tanker TRK-042',
      description: 'Koperasi Peternakan A · Data demo sintetis',
      openLab: 'Buka status lab',
      delivery: 'Pengiriman',
      timeline: 'Linimasa proses',
      timelineSubtitle: 'Dari peternakan ke penyimpanan, 7 checkpoint'
    },
    'tanker-lab-status': {
      title: 'Sampling & status lab',
      description: 'Rilis mutu tetap dikendalikan manusia',
      pendingCase: 'Buka kasus tertunda',
      recordResult: 'Catat hasil',
      sample: 'Sampel S-042-01',
      labInProgress: 'Uji lab sedang berjalan',
      release: 'Keputusan rilis'
    },
    'tanker-unloading': {
      title: 'Detail bongkar muat',
      description: 'Lacak transfer ke tangki penyimpanan tujuan',
      progress: 'Progres transfer',
      progressBadge: '60% selesai',
      events: 'Peristiwa bongkar muat',
      eventsSubtitle: 'Setiap peristiwa di-hash ke ledger audit'
    },
    'tanker-lab-pending': {
      title: 'Hasil lab tertunda',
      resultTitle: 'Hasil lab tertunda · keputusan rilis belum tersedia'
    },
    'tanker-delayed': {
      title: 'Tanker TRK-045',
      resultTitle: 'TRK-045 tertunda 35 menit · ETA 12:15',
      openRisk: 'Buka risiko produksi'
    },
    'data-management-overview': {
      title: 'Manajemen Data',
      description: 'Ingesti dan validasi terkelola untuk data produksi operasional',
      upload: 'Unggah file',
      tools: 'Alat ingesti',
      importLog: 'Log impor',
      importLogSubtitle: 'File terbaru yang masuk ke store operasional'
    },
    'data-management-upload': {
      title: 'Unggah data operasional',
      description: 'AI menganalisis struktur sebelum catatan diimpor',
      analyze: 'Analisis file',
      file: 'File',
      before: 'Sebelum mengimpor',
      templates: 'Template tersedia',
      templatesSubtitle: 'Unduh template, isi di Excel, lalu unggah di atas'
    },
    'data-management-mapping': {
      title: 'Tinjau pemetaan kolom AI',
      description: 'Pemetaan ber-confidence rendah memerlukan tinjauan manusia',
      continue: 'Lanjut ke validasi',
      reviewKeterangan: 'Tinjau Keterangan'
    },
    'data-management-validation': {
      title: 'Validasi catatan',
      description: 'Validasi memisahkan error struktural dari catatan yang perlu ditinjau',
      preview: 'Buka pratinjau impor',
      summary: 'Ringkasan validasi',
      issues: 'Isu',
      issuesSubtitle: 'Catatan yang ditandai pada cek skema dan aturan bisnis'
    },
    'data-management-preview': {
      title: 'Pratinjau impor',
      description: 'Konfirmasi catatan dan ledger peristiwa sebelum impor',
      ready: 'Siap dikonfirmasi',
      confirm: 'Konfirmasi impor',
      records: 'Catatan yang akan diimpor',
      recordsSubtitle: '4 pertama dari 1.248 catatan'
    },
    'data-management-history': {
      title: 'Riwayat impor',
      description: 'Lacak siapa yang mengimpor data dan hasil validasinya',
      imports: 'Impor',
      importsSubtitle: 'Setiap impor dicatat sebagai peristiwa audit',
      viewError: 'Lihat impor gagal'
    },
    'data-management-error': {
      title: 'Impor gagal',
      resultTitle: 'Impor gagal: 20 catatan berisi error skema yang memblokir'
    },
    'data-management-mapping-review': {
      title: 'Tinjauan pemetaan',
      resultTitle: 'Tinjauan manual diperlukan untuk Keterangan → belum terpetakan',
      returnToMapping: 'Kembali ke pemetaan'
    },
    'traceability-overview': {
      title: 'Ringkasan ketertelusuran',
      relationshipGraph: 'Graf relasi',
      quickStats: 'Statistik cepat',
      quickStatsSubtitle: 'Relasi material berbasis graf dari peternakan ke barang jadi',
      tools: 'Alat telusur',
      relationships: 'Relasi',
      awaiting: 'menunggu konfirmasi',
      needsQa: 'perlu tinjauan QA',
      matchesProof: 'cocok dengan bukti blockchain'
    },
    'traceability-graph': {
      title: 'Graf relasi material',
      description: 'Relasi berarah dengan konteks peristiwa dan kuantitas',
      selected: 'Node terpilih',
      openBatch: 'Buka detail batch'
    },
    'traceability-forward': {
      title: 'Telusur maju · TRK-042',
      description: 'Tanker sumber → tangki penyimpanan → batch produksi → barang jadi',
      impact: 'Ringkasan dampak',
      impactSubtitle: 'Semua yang di hilir tanker terpilih',
      path: 'Jalur telusur',
      steps: 'Langkah telusur'
    },
    'traceability-backward': {
      title: 'Telusur mundur · FG-1030-01',
      description: 'Barang jadi → batch produksi → tangki → tanker sumber',
      origin: 'Ringkasan asal',
      originSubtitle: 'Dari mana lot jadi terpilih berasal',
      path: 'Jalur telusur',
      steps: 'Langkah telusur'
    },
    'traceability-batch': {
      title: 'Batch B-2026-1030-01',
      description: 'Tanggal produksi 30 Okt · catatan relasi sintetis',
      ledgerPending: 'Ledger tertunda',
      openGraph: 'Buka graf relasi',
      facts: 'Fakta batch',
      relationships: 'Relasi telusur',
      openBackward: 'Buka telusur mundur'
    },
    'quality-investigation-overview': {
      title: 'Investigasi mutu',
      description: 'Gunakan ketertelusuran untuk memisahkan dampak terkonfirmasi dan potensial',
      newInvestigation: 'Investigasi baru',
      summary: 'Ringkasan',
      investigations: 'Investigasi'
    },
    'quality-investigation-detail': {
      title: 'Investigasi QI-2026-014',
      description: 'Tinjauan hasil lab · Data demo sintetis',
      openAnalysis: 'Analisis batch terdampak',
      affectedProducts: 'Produk terdampak',
      tracePath: 'Jalur telusur',
      tracePathSubtitle: 'Mundur dan maju dari sampel lab',
      findings: 'Temuan ketertelusuran'
    },
    'affected-batch-analysis': {
      title: 'Analisis batch terdampak',
      description: 'Hasil telusur maju dan mundur untuk tinjauan manusia',
      results: 'Hasil telusur',
      resultsSubtitle: 'QI-2026-014 · 4 entitas terhubung'
    },
    'affected-products': {
      title: 'Produk terdampak',
      resultTitle: 'Berpotensi terdampak: B-2026-1030-01 → FG-1030-01',
      openForward: 'Buka telusur maju'
    },
    'audit-trail-overview': {
      title: 'Jejak audit',
      description: 'Bukti integritas pendukung untuk catatan operasional',
      integrity: 'Jalankan cek integritas',
      health: 'Kesehatan ledger',
      recent: 'Peristiwa terbaru'
    },
    'audit-event-detail': {
      title: 'Peristiwa EVT-1030-882',
      description: 'Peristiwa persetujuan jadwal · bukti integritas pendukung',
      verifiedCount: '8/8 terverifikasi',
      integrity: 'Cek integritas',
      record: 'Catatan peristiwa'
    },
    'audit-integrity-check': {
      title: 'Cek integritas',
      description: 'Bandingkan referensi operasional dengan bukti integritas',
      compared: 'Referensi yang dibanding'
    }
  }
}
