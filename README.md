# ORBIS (AI Production Intelligence & Dairy Traceability)

ORBIS adalah frontend prototype untuk traceability bahan baku dan production planning pada industri pengolahan susu. Aplikasi ini menggunakan React 19, TypeScript, Vite, dan Tailwind CSS v4.

Dokumen ini membedakan visi produk dari kemampuan yang benar-benar tersedia di repository saat ini.

## Status implementasi saat ini

Yang tersedia dan terverifikasi secara lokal:

- Scenario/demo data untuk receiving, processing, traceability, planning, dan audit events.
- Production planning berbasis `PlanDependencies`, yang memisahkan catalog dan operational snapshot pada alur planning yang sudah diuji.
- Immutable in-memory planning revision snapshot beserta stored diagnostics pada state planning.
- Traceability snapshot dan genealogy helpers untuk data scenario; historical evidence dipisahkan dari current operational observation.
- Historical mass-balance helpers yang hanya memakai evidence historis yang tersedia. Historical closing quantity tidak diinferensikan dari ketiadaan outgoing event.
- Import workflow untuk catalog/master data melalui file selection, preview, automatic/manual mapping, duplicate-mapping validation, correction/revalidation, dan explicit confirmation.
- Local audit integrity check untuk gabungan scenario events dan planning-session events menggunakan deterministic ordering, canonicalization, dan SHA-256 hash chain.
- UI component tests untuk import workflow dan audit integrity page.

Status di atas berarti implemented and locally verified, bukan production-ready. Verification yang tersedia adalah test, lint, type-check, dan production build; bukan browser E2E, backend, atau persistence verification.

## Batasan prototype

ORBIS saat ini frontend-only dan memakai data scenario/in-memory. Repository ini tidak menyediakan:

- backend, REST API, database server, atau persistence layer;
- event ledger persisten atau authoritative audit storage;
- compliance-grade audit system, immutable ledger, atau tamper-proof guarantee;
- AI model/inference service eksternal;
- blockchain atau integrasi eksternal operasional;
- historical catalog version yang melekat pada setiap historical route event;
- recorded historical closing quantity bila evidence tersebut tidak tersedia;
- validasi historical transfer path terhadap catalog historis;
- browser-level E2E test.

Audit integrity adalah local/in-memory consistency check. Hash chain pada prototype tidak boleh diperlakukan sebagai bukti tamper-proof atau authoritative audit record.

## Visi produk

Visi ORBIS mencakup ingestion operasional, graph-based traceability, production planning, quality investigation, dan audit support. Implementasi backend, persistence, external integration, AI inference, serta operational historical evidence memerlukan scope dan infrastruktur lanjutan; jangan menyimpulkan fitur tersebut tersedia hanya dari visi produk.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- TanStack Router
- Vitest dan Testing Library
- PWA service worker melalui Workbox

## Menjalankan project

Prasyarat:

- Node.js 18 atau lebih baru
- npm

Install dependency dan jalankan development server:

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

Production build dan preview:

```bash
npm run build
npm run preview
```

## Menjalankan test

Full test suite dan quality gates:

```bash
npm run test
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
```

Satu test file:

```bash
npm run test -- src/routes/master-data/-components/RecordActions.test.tsx
npm run test -- src/routes/milk-traceability/-audit-log.test.tsx
```

Detail inventory, environment Node/jsdom, coverage, dan gap tersedia di `TESTING.md`.

## Modul UI saat ini

- Production Planning: plan preview, diagnostics, allocation, dan scenario views.
- Incoming Tanker: delivery, lab release, receiving, dan unloading views berbasis scenario/operational data.
- Data Management: catalog/master-data import workflow.
- Traceability: graph, forward trace, backward trace, genealogy, dan audit log.
- Quality Investigation: UI investigation berbasis data prototype.

UI modul tidak membuktikan adanya backend atau persistence. Keputusan produksi dan quality release tetap memerlukan human approval dan evidence operasional yang sesuai.
