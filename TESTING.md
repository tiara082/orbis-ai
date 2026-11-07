# Testing ORBIS

## Commands

Run the full suite:

```bash
npm run test
```

Run one test file:

```bash
npm run test -- src/routes/master-data/-components/RecordActions.test.tsx
npm run test -- src/routes/milk-traceability/-audit-log.test.tsx
```

Run the verification gates:

```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
```

## Test environments

Vitest uses its default Node environment. Tests that render React components declare the environment locally with:

```ts
// @vitest-environment jsdom
```

Do not change the global environment only to support a component test.

## Test locations and coverage

Pure and data-layer tests live beside the implementation under `src/data`, `src/domain`, `src/state`, and selected component logic under `src/components`.

Component tests live beside route components and use the router's ignored-file prefix `-` so TanStack Router does not treat them as routes:

- `src/routes/master-data/-components/RecordActions.test.tsx` covers file selection, preview, automatic and manual mapping, duplicate mapping blocking and resolution, correction/revalidation, confirmation gating, single apply invocation, and synchronous apply failure.
- `src/routes/milk-traceability/-audit-log.test.tsx` covers checking, consistent, broken, unavailable, checked count, scenario/planning-session source attribution, search, category filtering, and stale async cleanup after unmount.
- `src/routes/production-schedule/-machine-allocation.test.tsx` covers the planning dependency boundary used by the machine-allocation route.

The audit integrity core remains separately tested in `src/data/audit-integrity.test.ts`; the component tests keep that core real where practical and mock only UI/provider boundaries required for direct rendering.

## Boundaries and gaps

Component tests exercise rendered React behavior and selected async transitions. They are not browser-level E2E tests and do not prove layout fidelity, real browser Web Crypto implementations across browsers, file-picker behavior, persistence, backend integration, or router navigation in a running application.

Audit integrity is a local, in-memory consistency check. It is not an immutable, tamper-proof, or authoritative ledger.

The import callback contract is synchronous. Rejected Promise behavior is not covered because it is outside the current `RecordActions` callback contract.

The route component tests mock framework/provider boundaries such as the router-dependent page header and table shell. They preserve the asserted user-visible filter and status interactions but do not replace full integration or browser verification.
