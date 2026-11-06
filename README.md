# ORBIS - AI Production Intelligence (PWA)

Sistem Ketertelusuran Bahan Baku dan Produk Berbasis AI untuk Industri Pengolahan Susu.

## 📁 Direktori Project
```text
G:\tiara-project\orbis\
```

## 🚀 Cara Menjalankan Project

Masuk ke folder project:
```bash
cd G:\tiara-project\orbis
```

### 1. Mode Development (Lokal)
```bash
npm run dev
```
Buka browser pada URL yang muncul (biasanya `http://localhost:5173`).

### 2. Build Produksi & PWA (Service Worker)
```bash
npm run build
npm run preview
```

### 3. Deploy ke Vercel (100% Gratis)
Project sudah dilengkapi konfigurasi [`vercel.json`](file:///G:/tiara-project/orbis/vercel.json) dan Service Worker:
* Jalankan `npx vercel` dari folder ini, atau
* Push ke GitHub dan import ke dashboard Vercel.

---

## 📱 Daftar 35 Halaman Lengkap (100% Sesuai Gambar & Variabel Asli)

### 🏭 1. Production Planning & AI Optimization
1. **Production Planning** (`ProductionPlanning.tsx`)
2. **AI Recommendation** (`AIRecommendation.tsx`)
3. **Schedule Simulation** (`ScheduleSimulation.tsx`)
4. **Planning Approval** (`PlanningApproval.tsx`)
5. **Planning Rejection** (`PlanningRejection.tsx`)

### 🧠 2. AI Intelligence
6. **Processing duration prediction** (`AIPredictionDetail.tsx`)
7. **Insufficient data for reliable prediction** (`PredictionInsufficient.tsx`)
8. **Production risk analysis** (`AIProductionRisk.tsx`)

### 🔗 3. Traceability (Graph-Based Material Tracking)
9. **Traceability overview** (`TraceabilityOverview.tsx`)
10. **Material relationship graph** (`MaterialGraph.tsx`)
11. **Forward trace · TRK-042** (`ForwardTrace.tsx`)
12. **Backward trace · FG-1030-01** (`BackwardTrace.tsx`)
13. **Batch B-2026-1030-01** (`BatchDetail.tsx`)

### 🛡️ 4. Quality Investigation
14. **Quality investigation** (`QualityInvestigationOverview.tsx`)
15. **Investigation QI-2026-014** (`QualityInvestigationDetail.tsx`)
16. **Affected batch analysis** (`AffectedBatchAnalysis.tsx`)
    * Tabel: `TRK-042`, `ST-04`, `B-2026-1030-01`, `FG-1030-01`
    * Summary: `Trace relationships are recorded; impact classification remains subject to quality review.`
17. **Potentially affected: B-2026-1030-01 → FG-1030-01** (`AffectedProducts.tsx`)
    * Badge: `POTENTIAL IMPACT`
    * Tombol: `Return to workflow`

### 🔒 5. Audit Trail & Integrity Check
18. **Audit trail overview** (`AuditTrailOverview.tsx`)
    * Metrik: `8 / 8 verification indicator`, `1,248 events recorded`
    * Tabel kejadian: `EVT-1030-882`, `EVT-1030-881`, `EVT-1030-880`
19. **Event EVT-1030-882** (`AuditEventDetail.tsx`)
    * Detail grid: `Schedule approved`, `B-2026-1030-01`, `Ana Putri · Production Planner`, `30 Oct 2026 · 10:42`, `EVT-1030-881`, `Hash recorded · 8/8 verified`
20. **Integrity check** (`AuditIntegrityCheck.tsx`)
    * Badge: `INTEGRITY MATCH`
    * Keterangan: `Operational database record matches stored integrity evidence.`
    * Tabel: `Record hash (sha256: demo-8f3a...)`, `Previous reference (EVT-1030-881)`, `Verification status (8/8 verified)`

### 🚛 6. Incoming Tanker
21. **Incoming tanker monitoring** (`TankerOverview.tsx`)
22. **Tanker TRK-042** (`TankerDetail.tsx`)
23. **Sampling & lab status** (`TankerLabStatus.tsx`)
24. **Lab result pending** (`TankerLabPending.tsx`)
25. **Unloading detail (TRK-042 → ST-04)** (`TankerUnloading.tsx`)
26. **TRK-045 Delayed** (`TankerDelayed.tsx`)

### 📊 7. Data Management (Governed Ingestion)
27. **Data Management - Overview** (`DataManagementOverview.tsx`)
28. **Data Management - Excel Upload** (`ExcelUpload.tsx`)
29. **Data Management - Review AI Column Mapping** (`ColumnMapping.tsx`)
30. **Data Management - Validate records** (`ValidationRecords.tsx`)
31. **Data Management - Import preview** (`ImportPreview.tsx`)
32. **Data Management - Import history** (`ImportHistory.tsx`)
33. **Data Management - Import failed** (`ImportError.tsx`)
34. **Data Management - Column Mapping Review** (`ColumnMappingReview.tsx`)

### 🎨 8. ORBIS Design System
35. **Foundations & Components** (`DesignSystem.tsx`)
