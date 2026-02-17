# PersianToolbox — NEXT-PHASE Backlog (Target: 10/10 Production-Grade)

Generated from a repo audit on **2026-02-17**.

## Readiness (recalculated)

- **Overall:** **69%** (previously **66%**, +3pp)
- Primary delta vs previous report: security enforcement path now exists via `middleware.ts` (CSP + headers) but still needs full verification and rollout hardening.

### Category status (✅/🟡/❌)

- Architecture: 🟡
- Tools Implementation: 🟡
- Offline/PWA: 🟡
- Performance: 🟡
- Security: 🟡
- SEO: 🟡
- Monetization Infrastructure: ❌
- Maintainability: ✅

## 100k DAU scale risks (Local‑First context)

Even with Local‑First compute (client-side workers), **server hotspots** remain:

1. **Self-hosted analytics ingestion writes to a single JSON file** (`lib/analyticsStore.ts`) → risk of contention/corruption, I/O amplification, and data loss under burst traffic.
2. **Site settings SQLite (DatabaseSync) concurrency** (`lib/server/siteSettings.ts`) → risk under multi-instance deployment; unclear locking/consistency model.
3. **No consistent cache headers strategy for data endpoints** (`app/api/data/salary-laws/route.ts` is `no-store`) → higher origin load.
4. **Security enforcement regression risk**: CSP/headers must be present in _responses_ (not only generated), and must not break SW/worker/font flows.
5. **Monetization surfaces are currently disconnected** (routes 404/410) → blocks revenue and creates UX dead ends at scale.

## Architectural debt (highest leverage)

- **Feature availability is fragmented**: multiple routes use `notFound()` while other parts link to them; multiple APIs return 410 with inconsistent “v1.1.1/v2” messaging.
- **Deploy gate is not encoded as a single “release blocking” workflow** that verifies P0 completion + quality + Lighthouse + security audit as one required check.
- **Analytics persistence/ops** are not production-grade for multi-instance or high throughput.
- **PWA “Offline‑Guaranteed” tier lacks a formal, enforced contract** (shell routes and assets list).

## Monetization readiness gaps

- `/support`, `/ads`, `/plans`, `/account` surfaces are disabled (404) but referenced by components/pages.
- Subscription APIs are disabled (410) while plan/account components exist.
- Consent banner exists but is not mounted globally (`components/ads/AdsConsentBanner.tsx`).
- Offline license verification exists (`lib/offline-license.ts`, `/pro`) but issuance/rotation ops are not turnkey.

---

## Priority model

- **NP0**: blocks 10/10 readiness (security, offline, SEO integrity, scale, monetization blockers).
- **NP1**: high impact hardening and scale improvements.
- **NP2**: quality-of-life and growth improvements.

Each task spec lives in `tasks-next/<ID>.md`.

## Index

### NP0

- `NP0-01` Production-grade analytics storage (no single JSON file) — DONE
- `NP0-02` Deploy-blocking gate: P0 done + lint/test/build + Lighthouse + security audit — DONE
- `NP0-03` Feature availability framework (flags + consistent disabled UX/API)
- `NP0-04` Restore monetization surfaces coherently (support/ads/plans/account)
- `NP0-05` Security verification: response-header + nonce E2E contracts
- `NP0-06` Multi-instance readiness for settings/auth/session storage
- `NP0-07` Offline‑Guaranteed contract and SW shell generator
- `NP0-08` Cache strategy for data endpoints (ETag/immutable where safe)
- `NP0-09` Internal-link integrity gate (no dead same-origin links)
- `NP0-10` Font pipeline hardening (WOFF2 + preload + cache policy)

### NP1

- `NP1-01` Rate-limit strategy for high-traffic endpoints + ops metrics
- `NP1-02` Remove/merge redundant GitHub workflows to reduce CI duplication
- `NP1-03` Observability baseline: request IDs + structured logs (same-origin)
- `NP1-04` SEO audits: canonical/robots/schema validation in CI
- `NP1-05` PWA UX polish: install prompt + offline-ready indicator + update notes
- `NP1-06` Admin surface re-enable plan (secure, minimal, local-first)
- `NP1-07` Tool-tier enforcement: ensure Online-Required is truly network-only end-to-end
- `NP1-08` Performance budgets (bundle size + route critical JS)

### NP2

- `NP2-01` Content expansion: 10 new guides + editorial checklist
- `NP2-02` Accessibility expansion: axe gates for top tool flows
- `NP2-03` Data versioning UX for all “data-backed” tools
- `NP2-04` Offline diagnostics UI (cache version/storage usage)
- `NP2-05` Stress test harness (local) for 100k-DAU-like burst simulation
- `NP2-06` Release automation: generate readiness report artifacts locally
