import type { Messages } from './en'

export const id: Messages = {
  brand: {
    name: 'ORBIS',
    tagline: 'Production Intelligence'
  },
  shell: {
    search: 'Cari menu dan tab...',
    language: 'Bahasa',
    toggleNav: 'Buka/tutup navigasi',
    collapse: 'Ciutkan sidebar',
    expand: 'Lebarkan sidebar',
    notifications: 'Peringatan',
    markAllRead: 'Tandai sudah dibaca',
    noAlerts: 'Tidak ada peringatan',
    timezone: 'WIB',
    profileMenu: 'Menu akun',
    profile: 'Profil',
    settings: 'Pengaturan',
    logout: 'Keluar',
    role: 'Perencana produksi',
    plant: 'Pabrik susu · ESL & UHT',
    shift: 'Shift A',
    signIn: 'Masuk'
  },
  alerts: {
    approval: {
      title: 'Rencana menunggu persetujuan',
      body: 'Revisi rencana yang baru dibuat perlu keputusan manusia sebelum aktif'
    }
  },
  lang: {
    en: 'EN',
    id: 'ID'
  },
  source: {
    scenario: 'Skenario demo · {date} · snapshot {time}',
    catalog: 'Katalog resmi · {count} file CSV',
    scenarioNote: 'Data demo sintetis · ID dari katalog resmi'
  },
  nav: {
    group: {
      monitor: 'Pantau',
      operations: 'Operasional',
      planning: 'Perencanaan',
      system: 'Sistem'
    },
    module: {
      dashboard: 'Dashboard',
      'operational-data': 'Data Operasional',
      'milk-traceability': 'Ketertelusuran Susu',
      'ai-planning': 'Perencanaan Produksi AI',
      'production-schedule': 'Jadwal Produksi',
      'master-data': 'Master Data & Pengaturan',
      account: 'Akun'
    },
    moduleInfo: {
      dashboard: {
        title: 'Dashboard',
        description: 'Ringkasan hari ini: susu diterima, rencana, peringatan, dan ketertelusuran'
      }
    },
    tab: {
      'operational-data': {
        delivery: {
          label: 'Pengiriman',
          title: 'Farm & pengiriman susu',
          description: 'Keberangkatan tanker, ETA, kedatangan, keterlambatan, dan bongkar per truk'
        },
        'lab-release': {
          label: 'Penerimaan & QC',
          title: 'Sampling, uji lab & release',
          description: 'Bongkar baru boleh dimulai setelah QA me-release tanker (RECEIVING_GATE)'
        },
        'unloading-bay': {
          label: 'Bay bongkar',
          title: 'Bay bongkar',
          description: 'Ketersediaan bay, laju pompa, durasi bongkar, dan CIP antar tanker'
        },
        'raw-milk-process': {
          label: 'Susu mentah & proses',
          title: 'Tangki susu mentah & mesin proses',
          description: 'Tangki susu mentah, degassing, thermizer, separator, tangki cream dan mixing'
        },
        'sfp-storage': {
          label: 'Tangki simpan (SFP)',
          title: 'Tangki simpan SFP',
          description: '15 tangki simpan dengan level, aliran, holding time, dan status CIP'
        },
        'aseptic-tank': {
          label: 'Sterilizer & aseptik',
          title: 'Sterilizer & tangki aseptik',
          description: 'Level tangki aseptik terhadap batas minimum dinamis untuk satu atau dua filler'
        },
        'production-order': {
          label: 'Order produksi',
          title: 'Order produksi',
          description: 'Order dengan volume, kebutuhan susu, prioritas, batas waktu, dan line yang eligible'
        },
        'production-actual': {
          label: 'Aktual produksi',
          title: 'Aktual produksi',
          description: 'Output tercatat per order dan status filling line'
        }
      },
      'milk-traceability': {
        batches: {
          label: 'Batch',
          title: 'Batch',
          description: 'Semua batch dari tanker sampai barang jadi, lengkap dengan mass balance'
        },
        'batch-detail': {
          label: 'Detail batch',
          title: 'Detail batch & verifikasi blockchain',
          description: 'Fakta batch, relasi genealogi, alokasi material, dan verifikasi integritas ledger'
        },
        transfers: {
          label: 'Riwayat transfer',
          title: 'Riwayat transfer',
          description: 'Tiap transfer mencatat asal, tujuan, waktu, volume, dan rute'
        },
        graph: {
          label: 'Graf relasi',
          title: 'Graf relasi',
          description: 'Genealogi dari farm sampai barang jadi, termasuk split dan mix'
        },
        backward: {
          label: 'Telusur mundur',
          title: 'Telusur mundur',
          description: 'Dari batch produk kembali ke tanker dan farm asalnya'
        },
        forward: {
          label: 'Telusur maju',
          title: 'Telusur maju',
          description: 'Dari tanker atau tangki ke semua batch dan barang jadi yang dicapainya'
        },
        'audit-log': {
          label: 'Audit log',
          title: 'Audit log',
          description: 'Siapa melakukan apa dan kapan, termasuk pembuatan dan persetujuan rencana'
        }
      },
      'ai-planning': {
        forecasting: {
          label: 'Forecasting',
          title: 'Forecast & insight perencanaan',
          description: 'Prediksi ketersediaan susu, waktu kedatangan, dan kebutuhan susu rencana'
        },
        configuration: {
          label: 'Konfigurasi',
          title: 'Konfigurasi perencanaan',
          description: 'Jumlah order, kecepatan line, durasi changeover dan CIP yang dipakai planner'
        },
        generate: {
          label: 'Generate plan',
          title: 'Generate plan',
          description: 'Pratinjau rencana dari konfigurasi saat ini, cek aturan, lalu kirim untuk persetujuan'
        },
        scenarios: {
          label: 'Skenario',
          title: 'Skenario',
          description: 'Alternatif what-if yang dinilai dengan aturan yang sama'
        },
        recommendations: {
          label: 'Rekomendasi',
          title: 'Rekomendasi',
          description: 'Jadwal rekomendasi, risiko, dan alternatif untuk tiap peringatan'
        }
      },
      'production-schedule': {
        recommended: {
          label: 'Jadwal rekomendasi',
          title: 'Jadwal produksi rekomendasi',
          description: 'Rencana yang disetujui per filling line: produksi, changeover, dan CIP'
        },
        calendar: {
          label: 'Kalender',
          title: 'Kalender produksi',
          description: 'Line, tangki aseptik, dan jendela maintenance sepanjang hari'
        },
        'machine-allocation': {
          label: 'Alokasi mesin',
          title: 'Alokasi mesin',
          description: 'Order per filling line dan mesin hulu yang menyuplainya'
        },
        'tank-allocation': {
          label: 'Alokasi tangki',
          title: 'Alokasi tangki',
          description: 'Tangki dan batch yang menyuplai tiap order, serta urutan tangki aseptik'
        },
        approval: {
          label: 'Persetujuan',
          title: 'Persetujuan rencana',
          description: 'Tinjau revisi yang dibuat, lalu setujui atau tolak'
        },
        'planned-vs-actual': {
          label: 'Rencana vs aktual',
          title: 'Rencana vs aktual',
          description: 'Jendela waktu dan jumlah rencana dibandingkan produksi tercatat'
        }
      },
      'master-data': {
        products: {
          label: 'Produk & SKU',
          title: 'Produk & SKU',
          description: 'Liquid SKU, finished SKU, ukuran kemasan, dan market variant'
        },
        assets: {
          label: 'Aset',
          title: 'Aset & parameter',
          description: 'Semua aset pabrik dengan parameter dan satuan dari katalog'
        },
        routes: {
          label: 'Rute',
          title: 'Rute & koneksi',
          description: 'Rute material yang diizinkan antar aset'
        },
        'line-eligibility': {
          label: 'Eligibilitas line',
          title: 'Eligibilitas filling line',
          description: 'SKU dan ukuran kemasan yang boleh berjalan di tiap filling line'
        },
        rules: {
          label: 'Aturan & asumsi',
          title: 'Aturan & asumsi',
          description: 'Katalog constraint, aturan changeover dan CIP, serta asumsi proyek'
        }
      },
      account: {
        profile: {
          label: 'Profil',
          title: 'Profil',
          description: 'Identitas operator yang tercatat di audit'
        },
        settings: {
          label: 'Pengaturan',
          title: 'Pengaturan',
          description: 'Bahasa, shift, dan zona waktu'
        }
      }
    }
  },
  units: {
    min: 'mnt',
    h: 'jam',
    hShort: 'jam',
    packs: 'pack',
    packsPerHour: 'pack/jam'
  },
  status: {
    ready: 'Siap',
    pending: 'Menunggu',
    'pending approval': 'Menunggu persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    superseded: 'Digantikan',
    completed: 'Selesai',
    running: 'Berjalan',
    valid: 'Valid',
    invalid: 'Tidak valid',
    pass: 'Lolos',
    warning: 'Peringatan',
    violation: 'Pelanggaran',
    'not computable': 'Belum bisa dihitung',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
    late: 'Terlambat',
    'on time': 'Tepat waktu',
    'on the way': 'Dalam perjalanan',
    arrived: 'Tiba',
    'lab pending': 'Menunggu lab',
    passed: 'Lolos',
    'within spec': 'Sesuai spesifikasi',
    'awaiting result': 'Menunggu hasil',
    stored: 'Tersimpan',
    'pending qa': 'Menunggu QA',
    released: 'Di-release',
    idle: 'Idle',
    available: 'Tersedia',
    occupied: 'Terpakai',
    inactive: 'Nonaktif',
    cip: 'CIP',
    'cip required': 'Perlu CIP',
    maintenance: 'Maintenance',
    'holding risk': 'Risiko holding',
    empty: 'Kosong',
    eligible: 'Eligible',
    'not eligible': 'Tidak eligible',
    computed: 'Dihitung',
    reference: 'Referensi'
  },
  common: {
    close: 'Tutup',
    all: 'Semua',
    today: 'Hari ini',
    open: 'Buka',
    details: 'Detail'
  },
  table: {
    count: '{count} baris',
    countFiltered: '{shown} dari {total} baris',
    search: 'Cari...',
    empty: 'Tidak ada baris yang cocok',
    previous: 'Halaman sebelumnya',
    next: 'Halaman berikutnya'
  },
  catalog: {
    pending: 'Nilai menunggu',
    pendingHint: 'Katalog menandai parameter ini X: berlaku, nilainya belum diberikan',
    naHint: 'Katalog menandai parameter ini N/A: tidak berlaku untuk aset ini'
  },
  col: {
    action: 'Aksi',
    active: 'Aktif',
    activeLines: 'Line aktif',
    activity: 'Aktivitas',
    actor: 'Pelaku',
    actualDuration: 'Durasi aktual',
    actualWindow: 'Aktual',
    alert: 'Peringatan',
    allowedSkus: 'SKU diizinkan',
    appliesTo: 'Berlaku untuk',
    arrival: 'Tiba',
    asepticTank: 'Tangki aseptik',
    asset: 'Aset',
    availability: 'Ketersediaan',
    batch: 'Batch',
    batchVolume: 'Volume batch',
    bay: 'Bay',
    capacity: 'Kapasitas',
    catalogDuration: 'Durasi katalog',
    category: 'Kategori',
    changeoverTime: 'Changeover',
    cipDuration: 'CIP',
    cipTime: 'CIP',
    condition: 'Kondisi',
    connection: 'Koneksi',
    currentTanker: 'Tanker saat ini',
    decided: 'Diputuskan',
    decidedBy: 'Diputuskan oleh',
    definition: 'Definisi',
    delay: 'Terlambat',
    departure: 'Berangkat',
    description: 'Deskripsi',
    destination: 'Tujuan',
    due: 'Batas waktu',
    duration: 'Durasi',
    eligible: 'Eligible',
    eligibleLines: 'Line eligible',
    end: 'Selesai',
    entity: 'Entitas',
    estimatedDuration: 'Estimasi',
    eta: 'ETA',
    event: 'Event',
    expectedByNow: 'Rencana s.d. {time}',
    family: 'Family',
    farm: 'Farm',
    feeds: 'Menyuplai',
    finish: 'Selesai',
    finishedSku: 'Finished SKU',
    flavour: 'Rasa',
    flowType: 'Jenis aliran',
    freeAt: 'Kosong pukul',
    from: 'Dari',
    fromBatch: 'Dari batch',
    generated: 'Dibuat',
    generatedBy: 'Dibuat oleh',
    goodPacks: 'Pack bagus',
    holding: 'Holding time',
    impact: 'Dampak',
    implementation: 'Di aplikasi',
    inflow: 'Aliran masuk',
    keyIssue: 'Isu utama',
    labDuration: 'Durasi lab',
    labEnd: 'Lab selesai',
    labStart: 'Lab mulai',
    lastFinish: 'Selesai terakhir',
    lateOrders: 'Order terlambat',
    level: 'Level',
    line: 'Line',
    linesFed: 'Line yang disuplai',
    liquidDraw: 'Tarikan cairan',
    liters: 'Liter',
    litersFromSource: 'Liter dari sumber',
    litersInTarget: 'Liter dalam target',
    maintenance: 'Maintenance',
    market: 'Market',
    markets: 'Market',
    massBalance: 'Mass balance',
    material: 'Material',
    maxFlow: 'Aliran maks',
    metric: 'Metrik',
    milkBalance: 'Sisa susu',
    milkContent: 'Kandungan susu',
    milkNeed: 'Kebutuhan susu',
    minLevel: 'Level min',
    name: 'Nama',
    note: 'Catatan',
    order: 'Order',
    orders: 'Order',
    outflow: 'Aliran keluar',
    packs: 'Pack',
    packSize: 'Ukuran kemasan',
    packSizes: 'Ukuran kemasan',
    parameter: 'Parameter',
    pipe: 'Pipa',
    planned: 'Rencana',
    plannedLiters: 'Liter rencana',
    plannedPacks: 'Pack rencana',
    plannedWindow: 'Rencana',
    precedence: 'Prioritas',
    predicted: 'Prediksi',
    prediction: 'Prediksi',
    priority: 'Prioritas',
    product: 'Produk',
    productGroup: 'Kelompok produk',
    productionDate: 'Tanggal produksi',
    productionTime: 'Produksi',
    progress: 'Progres',
    pumpFlow: 'Laju pompa',
    qcResult: 'Hasil QC',
    qcStatus: 'Status QC',
    reason: 'Alasan',
    recommendation: 'Rekomendasi',
    rejectPacks: 'Reject',
    releasedBy: 'Di-release oleh',
    releaseTime: 'Waktu release',
    requirement: 'Ketentuan',
    revision: 'Revisi',
    role: 'Peran',
    route: 'Rute',
    routeCheck: 'Cek rute',
    rule: 'Aturan',
    ruleCheck: 'Cek aturan',
    runTime: 'Waktu jalan',
    sample: 'Sampel',
    sampling: 'Sampling',
    scenario: 'Skenario',
    scenarioDuration: 'Nilai skenario',
    scope: 'Cakupan',
    sentTo: 'Dikirim ke',
    shareFromSource: 'Porsi dari sumber',
    shareOfTarget: 'Porsi dalam target',
    sizeMl: 'Ukuran (ml)',
    sku: 'Liquid SKU',
    source: 'Sumber',
    speed: 'Kecepatan',
    speedPackph: 'Kecepatan (pack/jam)',
    stage: 'Tahap',
    start: 'Mulai',
    startDeviation: 'Deviasi mulai',
    status: 'Status',
    tank: 'Tangki',
    tankersPerBay: 'Tanker per bay',
    time: 'Waktu',
    to: 'Ke',
    toBatch: 'Ke batch',
    transfer: 'Transfer',
    transferType: 'Jenis',
    trigger: 'Pemicu',
    truck: 'Truk',
    truckCapacity: 'Kapasitas truk',
    type: 'Tipe',
    unit: 'Satuan',
    unloadEnd: 'Bongkar selesai',
    unloading: 'Bongkar',
    unloadStart: 'Bongkar mulai',
    unloadsToday: 'Bongkar hari ini',
    unloadVolume: 'Volume bongkar',
    usedIn: 'Dipakai di',
    utilization: 'Utilisasi',
    variance: 'Selisih',
    via: 'Lewat',
    volume: 'Volume',
    volumeNow: 'Volume saat ini',
    volumeToProcess: 'Volume diproses',
    window: 'Jendela',
    yield: 'Yield',
    param: {
      capacity_l: 'Kapasitas',
      input_flow_lph: 'Aliran masuk',
      output_flow_lph: 'Aliran keluar',
      process_speed_lph: 'Kecepatan proses',
      holding_time_limit_hours: 'Batas holding',
      cip_duration_minutes: 'CIP',
      speed_packph: 'Kecepatan filling'
    }
  },
  checks: {
    allPass: 'Semua aturan lolos',
    assumption: 'Asumsi proyek',
    RECEIVING_GATE: {
      title: 'Gerbang penerimaan',
      early: '{tanker} mulai bongkar sebelum lab release',
      blocked: '{tanker} menunggu lab release ({volumeL}); bongkar tetap ditahan',
      pass: 'Semua {count} tanker yang dibongkar sudah di-release QA lebih dulu'
    },
    BAY_EXCLUSIVE: {
      title: 'Satu tanker per bay',
      overlap: '{bay} melayani {tankerA} dan {tankerB} bersamaan',
      pass: '{count} bongkar, tidak ada bay yang bentrok'
    },
    CAPACITY: {
      title: 'Kapasitas tangki',
      exceeded: '{asset} di bawah nol atau melebihi kapasitas pakai',
      pass: '{count} tangki dalam batas kapasitas',
      incoming: 'Susu masuk {incomingL} melebihi kapasitas tangki susu mentah kosong {emptyCapacityL}',
      incomingOk: 'Tangki susu mentah kosong cukup untuk susu masuk {incomingL}'
    },
    CIP_EMPTY: {
      title: 'CIP sebelum isi ulang',
      beforeReceiving: '{asset} kosong dan perlu CIP sebelum bisa menerima susu masuk {incomingL}'
    },
    HOLDING: {
      title: 'Holding time',
      expired: '{asset} sudah melewati batas holding time',
      risk: '{asset} mencapai batas holding pukul {expiryTime} (sisa {remainingMin})',
      pass: '{count} tangki dalam batas holding time'
    },
    LINE_PRODUCT: {
      title: 'Eligibilitas line',
      ineligible: '{sku} tidak eligible di {line}',
      pass: 'Semua {count} produksi berjalan di line yang eligible'
    },
    AT_SAME_PRODUCT: {
      title: 'Produk sama di tangki aseptik bersama',
      conflict: '{at} akan menyuplai {lineA} dan {lineB} pukul {startTime}',
      pass: 'Line yang berbagi tangki aseptik menjalankan produk yang sama pada waktu yang sama'
    },
    AT_SHARED_FLOW: {
      title: 'Batas output tangki aseptik',
      over: 'Tarikan puncak {at} {peakLph} melebihi batas output {limitLph}',
      pass: 'Tarikan puncak {at} {peakLph} dalam batas {limitLph}'
    },
    SIMULTANEOUS: {
      title: 'Level minimum tangki aseptik',
      minLevel: '{at} siap pukul {readyTime} setelah CIP dan isi ulang ke {minPct}%; filling yang direncanakan {startTime} mundur {lateMin}',
      pass: 'Tangki aseptik mencapai level minimum sebelum tiap pergantian produk'
    },
    CHANGEOVER_PRECEDENCE: {
      title: 'Prioritas changeover',
      pass: 'Changeover mengikuti Variant > Size > Paper: {list}'
    },
    CIP_END_PRODUCTION: {
      title: 'CIP di akhir produksi',
      pass: '{count} blok CIP terjadwal'
    },
    FILLING_SPEED_UNIT: {
      title: 'Satuan kecepatan filling',
      empty: 'Tidak ada produksi untuk dikonversi',
      pass: '{line} menarik {drawLph} (pack/jam × ml kemasan ÷ 1000)'
    },
    PLAN: {
      title: 'Batas waktu',
      late: '{order} selesai {lateMin} setelah batas waktu {dueTime}',
      pass: 'Semua {count} order selesai sebelum batas waktu'
    },
    MILK_BALANCE: {
      title: 'Neraca susu',
      short: 'Rencana butuh {requiredL}; baru {availableL} yang di-release (kurang {shortL})',
      pass: 'Rencana butuh {requiredL} dari {availableL} yang di-release (sisa {spareL})'
    },
    HEADER_RESOURCE: {
      title: 'Resource header',
      missing: 'Jumlah transfer paralel dan kapasitas header bersama belum ada di katalog'
    },
    CATALOG_DURATIONS: {
      title: 'Durasi katalog',
      scenario: 'Durasi changeover dan CIP bernilai X di katalog; rencana memakai nilai skenario'
    }
  },
  schedule: {
    kind: {
      plain: 'Full Cream',
      flavoured: 'Berperisa',
      changeover: 'Jeda Changeover',
      cip: 'CIP',
      wait: 'Menunggu',
      maintenance: 'Maintenance',
      level: 'Isi ulang ke level min'
    },
    block: {
      production: 'Produksi',
      VARIANT: 'Ganti Rasa (Variant)',
      SIZE: 'Ganti Ukuran (Size)',
      PAPER: 'Ganti Gulungan Kertas (Paper)',
      CIP: 'CIP',
      wait: 'Menunggu tangki aseptik',
      maintenance: 'Maintenance',
      CIP_EMPTY: 'CIP (tangki kosong)',
      refill: 'Isi ulang'
    },
    asepticLane: 'Tangki aseptik',
    lateBy: 'Terlambat {time}',
    ordersFooter: '{count} order · kebutuhan susu {milk} · blok terakhir selesai {end}',
    activeRevision: '{id} · disetujui {time}',
    pendingTitle: '{id} menunggu persetujuan',
    pendingBody: 'Halaman ini menampilkan rencana yang disetujui sampai revisi baru disetujui.',
    timeline: 'Jadwal per filling line',
    timelineHint: 'Rencana disetujui · {start}–{end}',
    table: 'Jadwal produksi',
    tableHint: 'Changeover, CIP, dan maintenance adalah aktivitas terpisah',
    orders: 'Hasil per order',
    calendar: {
      day: 'Kalender · {date}',
      dayHint: 'Filling line, urutan tangki aseptik, dan maintenance peralatan',
      next: 'Hari produksi berikutnya',
      nextHint: 'Order yang sudah diketahui untuk besok'
    },
    machines: {
      lines: 'Filling line',
      linesHint: 'Waktu per aktivitas dan utilisasi terhadap jendela rencana',
      utilHint: 'Waktu produksi ÷ jendela rencana {window}',
      upstream: 'Mesin hulu',
      upstreamHint: 'Waktu jalan yang dibutuhkan pada kecepatan nominal untuk menyuplai rencana hari ini',
      role: {
        sterilize: 'Sterilisasi ke tangki aseptik',
        thermize: 'Thermisasi susu mentah',
        separate: 'Separasi dan standardisasi'
      }
    },
    tanks: {
      aseptic: 'Urutan tangki aseptik',
      asepticHint: 'Segmen produk, CIP setelah kosong, dan isi ulang ke level minimum',
      table: 'Alokasi tangki & batch',
      tableHint: 'Batch simpan dan aseptik yang menyuplai order hari ini'
    },
    approval: {
      reviewTitle: 'Tinjau {id}',
      reviewHint: 'Dibuat oleh {by} pukul {time}',
      activeCol: 'Aktif {id}',
      pendingCol: 'Menunggu {id}',
      compare: {
        end: 'Blok terakhir selesai',
        late: 'Order terlambat',
        milk: 'Kebutuhan susu'
      },
      checks: 'Cek aturan revisi ini',
      decision: 'Keputusan',
      decisionHint: 'Persetujuan menjadikan revisi ini jadwal aktif. Penolakan mempertahankan jadwal saat ini.',
      note: 'Catatan',
      notePlaceholder: 'Opsional untuk setuju, wajib untuk menolak',
      reasonRequired: 'Isi alasan sebelum menolak',
      blocked: 'Revisi ini melanggar aturan; perbaiki konfigurasi lalu generate ulang',
      approve: 'Setujui rencana',
      reject: 'Tolak',
      approvedTitle: '{id} disetujui',
      approvedBody: 'Halaman jadwal, dashboard, dan alokasi kini membaca revisi ini.',
      rejectedTitle: '{id} ditolak',
      rejectedBody: '{active} tetap menjadi jadwal aktif.',
      openSchedule: 'Buka jadwal',
      openAudit: 'Buka audit log',
      emptyTitle: 'Tidak ada yang menunggu persetujuan',
      emptyBody: '{id} adalah jadwal aktif. Generate rencana baru untuk memulai tinjauan.',
      emptyAction: 'Generate plan',
      history: 'Riwayat revisi'
    },
    pva: {
      planned: 'Rencana',
      actual: 'Aktual',
      timeline: 'Rencana vs aktual per line',
      timelineHint: 'Garis merah menandai produksi dengan deviasi tercatat',
      table: 'Per produksi',
      tableHint: 'Pack yang diharapkan sebanding dengan porsi waktu rencana yang sudah lewat'
    }
  },
  audit: {
    action: {
      labRelease: 'Lab release',
      transfer: 'Transfer',
      split: 'Transfer split',
      batchCreated: 'Batch dibuat',
      coProduct: 'Co-product dicatat',
      tankerArrived: 'Tanker tiba',
      cipStarted: 'CIP dimulai',
      productionStarted: 'Produksi dimulai',
      planGenerated: 'Rencana dibuat',
      planApproved: 'Rencana disetujui',
      planRejected: 'Rencana ditolak'
    }
  },
  dashboard: {
    greeting: 'Produksi hari ini',
    kpi: {
      received: 'Susu diterima',
      receivedCaption: 'Di-release QA dan tersimpan',
      available: 'Tersedia untuk rencana',
      availableCaption: '{spare} di atas kebutuhan susu rencana',
      waiting: 'Menunggu',
      waitingCaption: '{pending} menunggu lab · {incoming} dalam perjalanan',
      plan: 'Rencana aktif',
      planApproved: 'Disetujui',
      planPending: '{id} menunggu persetujuan'
    },
    plan: 'Rencana hari ini',
    planHint: '{id} · {start}–{end}',
    openSchedule: 'Buka jadwal',
    alerts: 'Peringatan AI',
    alertsHint: '{count} item dari cek aturan dan perencanaan',
    openRecommendations: 'Alternatif',
    pva: 'Rencana vs aktual',
    pvaGood: 'Pack bagus sejauh ini',
    pvaExpected: 'Rencana s.d. {time}',
    pvaCaption: '{pct}% dari output rencana untuk waktu yang sudah berjalan',
    trace: 'Status ketertelusuran',
    traceBatches: 'Batch tercatat',
    traceTransfers: 'Transfer di rute terdaftar',
    traceBalance: 'Batch seimbang (mass balance)',
    tracePendingQa: 'Barang jadi menunggu QA',
    openGraph: 'Buka graf',
    assets: 'Status tangki & mesin',
    assetsHint: 'Snapshot pukul {time}',
    openOperational: 'Data operasional',
    footer: 'Output AI diberi label; cek aturan berasal dari katalog constraint resmi. Data demo sintetis.'
  },
  master: {
    milkContentHint: 'Asumsi proyek: Full Cream 100% susu, berperisa 90% susu',
    edit: {
      add: 'Tambah data',
      upload: 'Unggah Excel',
      template: 'Template',
      save: 'Simpan',
      reset: 'Kembalikan katalog resmi',
      formEyebrow: 'Form input',
      formHint: 'Baris dengan ID yang sama menggantikan data yang ada. Daftar dipisah titik koma.',
      session: 'Master data ini berbeda dari katalog resmi. Perubahan tersimpan di sesi browser ini dan dipakai bagian lain aplikasi.',
      result: '{added} ditambah, {updated} diperbarui, {skipped} dilewati',
      noRows: 'File tidak berisi baris data',
      headerMismatch: 'Kolom belum lengkap: {columns}. Unduh template dan pertahankan baris judulnya.',
      required: 'Baris {row}: {field} wajib diisi',
      notNumber: 'Baris {row}: {field} harus angka',
      unreadable: 'File tidak bisa dibaca. Gunakan .xlsx atau .csv.',
      yes: 'Ya',
      no: 'Tidak'
    },
    products: {
      liquid: 'Liquid SKU',
      liquidHint: 'Family dan rasa produk, dengan ukuran kemasan dan market yang diizinkan',
      finished: 'Finished SKU',
      finishedHint: 'Liquid SKU × ukuran kemasan × market variant',
      packSizes: 'Ukuran kemasan',
      markets: 'Market variant',
      marketsHint: 'Market variant terpisah dari varian rasa'
    },
    assets: {
      total: 'Aset',
      totalCaption: '{types} tipe aset',
      physical: 'Aset fisik',
      physicalCaption: 'Mesin, tangki, bay, pipa',
      logical: 'Node logis',
      logicalCaption: 'Header dan batas sistem',
      pendingParams: 'Parameter menunggu',
      pendingCaption: 'Bertanda X di katalog',
      table: 'Konfigurasi aset',
      tableHint: '“Nilai menunggu” = parameter berlaku, nilai belum ada · “—” = tidak berlaku',
      allTypes: 'Semua tipe ({count})',
      units: 'Satuan parameter',
      unitsHint: 'Satuan dan arti tiap parameter aset',
      role: {
        process_asset: 'Aset proses',
        physical_pipe: 'Pipa khusus',
        logical_junction: 'Header logis',
        material_source: 'Batas farm',
        delivery_source: 'Batas tanker',
        finished_goods_sink: 'Batas barang jadi'
      }
    },
    routes: {
      table: 'Koneksi aset',
      tableHint: 'Material hanya boleh berpindah lewat edge yang terdaftar (CONNECTION)',
      allFlows: 'Semua jenis aliran ({count})',
      search: 'Cari aset atau koneksi...',
      flow: {
        main_milk: 'Susu utama',
        sterilized_product: 'Produk steril',
        aseptic_supply: 'Suplai aseptik',
        cream: 'Cream',
        mixed_product: 'Produk mix',
        premix: 'Premix',
        to_sterilization: 'Ke sterilisasi',
        finished_goods: 'Barang jadi'
      }
    },
    lines: {
      dedication: 'Dedikasi line',
      dedicationHint: 'Pilih line untuk melihat eligibilitas SKU di bawah',
      matrixFor: 'Eligibilitas {line}',
      matrixHint: 'Dari line_product_compatibility dan line_finished_sku_compatibility',
      onlyEligible: 'Eligible saja',
      allRows: 'Semua baris',
      byProduct: 'Liquid SKU × ukuran kemasan',
      byFinished: 'Finished SKU'
    },
    rules: {
      constraints: 'Katalog constraint',
      constraintsHint: 'Aturan “Dihitung” dicek langsung di aplikasi',
      changeover: 'Aturan Changeover & Waktu Henti Mesin',
      changeoverHint: 'Sistem menghitung jeda waktu henti secara otomatis saat mesin selesai memproduksi satu produk dan beralih ke produk lain',
      cip: 'Aturan CIP',
      cipHint: 'CIP independen dari changeover dan satu siklus bisa menutup beberapa pemicu',
      assumptions: 'Asumsi proyek',
      assumptionsHint: 'Nilai yang disepakati untuk proyek ini; cek yang memakainya diberi label',
      assumption: {
        density: { title: 'Densitas 1 kg/L', body: 'Liter dan kilogram setara di semua perhitungan.' },
        fullCream: { title: 'Full Cream 100% susu', body: 'Cairan Full Cream seluruhnya dari susu segar.' },
        flavoured: { title: 'Berperisa 90% susu', body: 'Chocolate dan Strawberry memakai 90% susu; sisanya premix.' },
        packaging: { title: 'Kemasan & gudang', body: 'Bahan kemasan dan ruang gudang bukan constraint.' },
        maintenance: { title: 'Maintenance', body: 'Jendela maintenance mencakup trial dan kalibrasi.' },
        breakdown: { title: 'Breakdown', body: 'Henti tak terencana diwakili persentase utilisasi.' },
        batchPolicy: { title: '1 tangki = 1 batch', body: 'Tiap tangki menyimpan satu batch per tanggal produksi.' },
        hold: { title: 'Hold', body: 'Hold dan release batch mengikuti prosedur QA.' }
      }
    }
  },
  ops: {
    scenarioNote: 'Data demo sintetis',
    snapshotAt: 'Snapshot pukul {time}',
    holdingHint: 'Umur dihitung dari awal batch; isi ulang tidak me-reset umur (HOLDING)',
    holdingLimit: 'Batas {hours} jam',
    remaining: 'sisa {time}',
    delivery: {
      trucks: 'Truk hari ini',
      trucksCaption: 'Dari {farms} farm',
      received: 'Diterima',
      receivedCaption: '{count} tanker dibongkar',
      waiting: 'Belum diterima',
      waitingCaption: '{pending} menunggu lab · {incoming} dalam perjalanan',
      late: 'Tiba terlambat',
      lateCaption: 'Tiba setelah ETA',
      table: 'Pengiriman',
      tableHint: 'Pilih baris untuk melihat timeline pengiriman dan tangki tujuan',
      drawerEyebrow: 'Pengiriman',
      progress: 'Progres',
      details: 'Detail',
      destinations: 'Tangki tujuan',
      noDestination: 'Belum dibongkar',
      splitNote: 'Pengiriman split: satu tanker ke dua tangki susu mentah, dicatat sebagai dua transfer.',
      step: {
        departure: 'Berangkat',
        arrival: 'Tiba',
        lab: 'Lab release',
        unload: 'Dibongkar',
        stored: 'Tersimpan'
      }
    },
    lab: {
      table: 'Catatan sampling & lab',
      tableHint: 'Status QC Pending, Passed, atau Rejected'
    },
    bay: {
      table: 'Bay',
      tableHint: '{active} dari {total} bay aktif · satu tanker per bay pada satu waktu',
      maintenanceUntil: 'Maintenance s.d. {time}',
      timeline: 'Timeline bay',
      timelineHint: 'Bongkar, CIP setelah tiap tanker, menunggu, dan maintenance',
      unloadingBlock: 'Bongkar',
      waitingBlock: 'Menunggu lab release',
      unloads: 'Catatan bongkar',
      estimateHint: 'Volume ÷ laju pompa'
    },
    raw: {
      tanks: 'Tangki susu mentah',
      machines: 'Degassing, thermizer & separator',
      machinesHint: 'Kecepatan nominal, durasi CIP, dan jendela maintenance',
      intermediate: 'Tangki cream, premix & mixing',
      intermediateHint: 'Co-product cream dan mixing produk berperisa'
    },
    sfp: {
      tanks: 'Tangki SFP',
      tanksCaption: 'Total kapasitas {capacity}',
      inUse: 'Terisi',
      cip: 'CIP',
      holdingRisk: 'Risiko holding',
      holdingCaption: 'Kurang dari 3 jam ke batas',
      table: 'Tangki simpan SFP'
    },
    aseptic: {
      ruleTitle: 'Level minimum tergantung jumlah filler yang menarik dari tangki',
      ruleBody: 'Satu filler butuh minimal 25%, dua filler minimal 50%. Setelah ganti produk, tangki dikosongkan, di-CIP (CIP_EMPTY), lalu diisi ulang ke level ini sebelum filling mulai.',
      live: 'Tangki aseptik yang berjalan',
      liveHint: 'Level saat ini terhadap batas minimum untuk satu dan dua filler',
      level: 'Level',
      activeLines: 'Line aktif',
      minNow: 'Minimum untuk {lines} line',
      minTwo: 'Minimum untuk 2 line',
      tanks: 'Tangki aseptik',
      sterilizers: 'Sterilizer',
      sterilizersHint: 'Mensterilkan produk SFP ke tangki aseptik'
    },
    orders: {
      table: 'Order produksi',
      tableHint: 'Liter = pack × ukuran kemasan; kebutuhan susu memakai kandungan susu produk',
      milkHint: 'Full Cream 100% · berperisa 90% (asumsi proyek)',
      footer: '{count} order hari ini · {liters} produk · {milk} susu'
    },
    actual: {
      table: 'Aktual produksi',
      runningSince: 'Berjalan',
      lines: 'Filling line',
      linesHint: 'Tarikan cairan = pack/jam × ml kemasan ÷ 1000 (FILLING_SPEED_UNIT)',
      note: {
        atMinLevel: 'Menunggu level minimum AT-01'
      }
    }
  },
  trace: {
    kind: {
      farm: 'Farm',
      tanker: 'Tanker',
      raw: 'Tangki susu mentah',
      process: 'Separasi',
      storage: 'Simpan SFP',
      cream: 'Cream',
      mix: 'Mixing',
      aseptic: 'Tangki aseptik',
      finished: 'Barang jadi'
    },
    transferType: {
      receive: 'Terima',
      split: 'Split',
      mix: 'Mix',
      separation: 'Separasi',
      'co-product': 'Co-product',
      transform: 'Transformasi',
      sterilize: 'Sterilisasi',
      fill: 'Filling'
    },
    sideInput: {
      premix: 'Premix (bahan)'
    },
    allStages: 'Semua tahap ({count})',
    openBackward: 'Telusur mundur',
    openForward: 'Telusur maju',
    massBalance: 'Mass balance',
    balance: {
      opening: 'Awal',
      inflow: 'Masuk',
      output: 'Keluar',
      coProduct: 'Co-product',
      closing: 'Akhir',
      variance: 'Selisih',
      formula: 'Awal + masuk = keluar + co-product + akhir + selisih (MASS_BALANCE)'
    },
    inputs: 'Input',
    outputs: 'Output',
    noInputs: 'Tidak ada input tercatat (batch sumber)',
    noOutputs: 'Belum ada output',
    batches: {
      table: 'Batch',
      tableHint: 'Satu tangki = satu batch per tanggal produksi · pilih baris untuk mass balance'
    },
    transfers: {
      table: 'Transfer',
      tableHint: 'Tiap lompatan rute dicek terhadap daftar koneksi aset'
    },
    graph: {
      title: 'Genealogi',
      subtitle: 'Kolom mengikuti proses: farm, tanker, susu mentah, separasi, simpan, aseptik, barang jadi',
      hintTitle: 'Pilih node untuk menyorot seluruh garis keturunannya',
      hintBody: 'Garis adalah transfer; arahkan kursor ke garis untuk melihat ID-nya. Split dan mix tampil sebagai cabang.',
      selected: 'Garis keturunan {id}',
      details: 'Detail batch',
      clear: 'Hapus pilihan'
    },
    pickTarget: 'Telusur mundur dari',
    pickSource: 'Telusur maju dari',
    summary: {
      farms: 'Farm',
      tankers: 'Tanker',
      batches: 'Batch terkait',
      transfers: '{count} transfer',
      finished: 'Barang jadi'
    },
    path: 'Jalur telusur',
    pathBackward: 'Tahap antara batch terpilih dan farm',
    pathForward: 'Tahap yang dicapai dari batch terpilih',
    shareHint: 'Porsi mengikuti volume melalui tiap split dan mix',
    backwardTable: 'Sumber {id}',
    forwardTable: 'Dicapai dari {id}',
    lineageTransfers: 'Transfer dalam garis keturunan ini',
    audit: {
      table: 'Event',
      tableHint: 'Event skenario ditambah aksi perencanaan di sesi ini',
      category: {
        receiving: 'Penerimaan',
        process: 'Proses',
        planning: 'Perencanaan'
      }
    }
  },
  planning: {
    aiLabel: {
      forecast: 'Forecast AI',
      optimizer: 'Optimizer berbasis aturan (placeholder AI)'
    },
    forecast: {
      availableToday: 'Prediksi susu hari ini',
      confidence: 'Keyakinan {pct}%',
      released: 'Di-release & tersimpan',
      releasedCaption: 'Dikonfirmasi QA',
      waiting: 'Belum di-release',
      waitingCaption: 'Menunggu lab atau dalam perjalanan',
      tomorrow: 'Besok',
      range: 'Rentang {min}–{max}',
      intake: 'Penerimaan susu',
      intakeHint: '7 hari terakhir dan besok · model diperbarui {time}',
      legendActual: 'Aktual',
      legendForecast: 'Forecast',
      demand: 'Kebutuhan susu rencana',
      demandHint: 'Dari konfigurasi saat ini',
      demandFooter: 'Kebutuhan susu {milk} · di-release {available}',
      group: {
        plain: 'Full Cream',
        flavoured: 'Berperisa'
      },
      etas: 'Prediksi kedatangan & release',
      etasHint: 'Output model, diperbarui dengan data pengiriman terkini',
      eta: {
        arrival: 'Waktu tiba',
        labResult: 'Hasil lab'
      }
    },
    config: {
      changed: 'Berbeda dari rencana disetujui',
      matches: 'Sama dengan {id}',
      reset: 'Kembalikan ke yang disetujui',
      toGenerate: 'Pratinjau rencana',
      orders: 'Order',
      ordersHint: 'Jumlah dan prioritas per order',
      lines: 'Filling line',
      linesHint: 'Kecepatan dan utilisasi; breakdown diwakili utilisasi',
      speed: 'Kecepatan {line}',
      utilization: 'Utilisasi',
      utilizationHint: 'Porsi kecepatan nominal yang benar-benar tercapai',
      start: 'Mulai rencana',
      changeover: 'Jeda Changeover',
      changeoverHint: 'Waktu henti otomatis: Ganti Rasa (60 mnt), Ganti Ukuran (40 mnt), Ganti Gulungan Kertas (15 mnt)',
      variantHint: 'Jeda 60 mnt. Pipa dan mesin wajib dicuci total dengan sistem CIP panas agar rasa sebelumnya tidak mencemari rasa berikutnya.',
      sizeHint: 'Jeda 40 mnt. Mesin perlu penyesuaian mekanis pemotong dan pelipat karton.',
      paperHint: 'Jeda 15 mnt. Hanya mengganti gulungan kertas kemasan baru tanpa membongkar mesin.',
      cip: 'Durasi CIP',
      cipHint: 'Katalog menandai ini X; nilai di bawah adalah nilai skenario',
      cipRule: {
        CIP_FLAVOUR: 'Chocolate atau Strawberry ke Full Cream',
        CIP_CH_ST: 'Chocolate ke Strawberry atau sebaliknya',
        CIP_END_PRODUCTION: 'Akhir sebuah produksi'
      }
    },
    generate: {
      action: 'Generate plan',
      pendingEyebrow: 'Menunggu persetujuan',
      pendingTitle: '{id} dibuat pukul {time}',
      pendingBody: 'Planner atau supervisor menyetujuinya sebelum dijalankan di lantai produksi.',
      openApproval: 'Buka persetujuan',
      readyTitle: 'Pratinjau di bawah; generate untuk membuat revisi yang perlu disetujui',
      readyBody: 'Rencana memakai konfigurasi saat ini dan dicek terhadap semua aturan katalog.',
      blocked: 'Pratinjau melanggar aturan; sesuaikan konfigurasi dulu',
      preview: 'Pratinjau rencana',
      previewHint: '{start}–{end}',
      orders: 'Order',
      checks: 'Cek aturan',
      checksSummary: '{pass} lolos · {warning} peringatan · {violation} pelanggaran · {na} belum bisa dihitung',
      blocks: 'Blok jadwal'
    },
    scenarios: {
      table: 'Skenario',
      tableHint: 'Pilih baris untuk melihat jadwal dan isu aturannya',
      detailHint: 'Jadwal dan isu aturan untuk skenario ini'
    },
    scenario: {
      baseline: {
        title: 'Baseline rekomendasi',
        body: 'FL-01 Full Cream lalu Chocolate; FL-02 Full Cream ekspor'
      },
      'split-chocolate': {
        title: 'Bagi chocolate ke FL-01 dan FL-02',
        body: 'FL-02 menunggu sampai AT-01 berganti ke Chocolate'
      },
      'split-naive': {
        title: 'Bagi chocolate tanpa menunggu',
        body: 'FL-02 mulai Chocolate saat AT-01 masih berisi Full Cream'
      },
      'fl02-breakdown': {
        title: 'FL-02 breakdown',
        body: 'Semua order di FL-01'
      },
      'variant-60': {
        title: 'Ganti rasa 60 mnt',
        body: 'Variant changeover memakai jeda SOP standar 60 menit dengan pencucian CIP panas'
      },
      'milk-short': {
        title: 'TRK-B01 ditolak',
        body: 'Susu tersedia berkurang 13.000 L'
      }
    },
    recs: {
      eyebrow: 'Jadwal rekomendasi',
      title: 'Jalankan Full Cream dulu di kedua line, lalu Chocolate di FL-01',
      openSchedule: 'Buka jadwal',
      why: 'Mengapa jadwal ini',
      whyHint: 'Diturunkan dari cek aturan',
      reason: {
        onTime: '{count} dari {total} order selesai sebelum batas waktu',
        milk: 'Kebutuhan susu {required} cukup dari {available} yang di-release',
        changeover: 'Satu variant changeover ({min} mnt) tanpa CIP tambahan',
        end: 'Aktivitas terakhir selesai pukul {time}'
      },
      risks: 'Risiko yang perlu dipantau',
      risksHint: 'Peringatan dan aturan yang belum bisa dihitung',
      alternatives: 'Peringatan & alternatif',
      alternativesHint: 'Tiap peringatan dengan respons yang direkomendasikan dan cek aturannya',
      impact: 'Selesai {end} ({delta}) · order terlambat {late}',
      trigger: {
        breakdown: 'Mesin breakdown',
        capacity: 'Kapasitas tangki',
        holding: 'Risiko holding time',
        sequence: 'Urutan alternatif',
        changeover: 'Changeover panjang',
        milk: 'Kekurangan susu'
      },
      alt: {
        fl02: { title: 'Pindahkan order FL-02 ke FL-01', body: 'Jalankan order ekspor setelah Full Cream lokal dengan paper change.' },
        rmt: { title: 'CIP RMT-03 sebelum TRK-A03 di-release', body: 'Mulai CIP sekarang agar tangki siap menerima susu masuk.' },
        sfp: { title: 'Pakai atau putuskan SFP-05 lebih dulu', body: 'Jadwalkan UHT Full Cream di SFP-05 sebelum batas holding atau minta keputusan QA.' },
        split: { title: 'Bagi chocolate ke dua line', body: 'FL-02 ikut setelah AT-01 ganti produk agar selesai lebih cepat.' },
        variant: { title: 'Ganti rasa 60 mnt (CIP Panas)', body: 'Pipa & mesin dicuci total CIP panas; chocolate selesai tepat waktu sesuai standar SOP.' },
        milk: { title: 'Kurangi atau pindahkan order', body: 'Jika tanker ditolak, kurangi order prioritas terendah atau pindahkan ke besok.' }
      }
    }
  },
  pages: {
    settings: {
      language: 'Bahasa',
      languageHint: 'Berlaku untuk seluruh workspace di perangkat ini',
      shift: 'Shift aktif',
      shiftValue: 'Shift A · 06:00–18:00',
      timezone: 'Zona waktu pabrik',
      timezoneValue: 'Asia/Jakarta (WIB)'
    },
    profile: {
      name: 'Nama',
      role: 'Peran',
      plant: 'Pabrik',
      shift: 'Shift',
      email: 'Email',
      openSettings: 'Buka pengaturan'
    },
    signedOut: {
      title: 'Sudah keluar',
      description: 'Prototipe ini tidak menyimpan sesi sungguhan. Masuk lagi untuk kembali ke workspace pabrik.'
    },
    notFound: {
      title: 'Halaman tidak ditemukan',
      description: 'Alamat ini tidak cocok dengan menu mana pun.',
      action: 'Ke dashboard'
    }
  }
}
