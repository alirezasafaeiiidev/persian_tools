# TASKS

Real execution status for PersianToolbox (derived from `tasks-next/*.md` and runtime verification).

- Last updated: 2026-02-19
- Task completion: `3/24` DONE (`12.5%`)
- NP0 completion: `3/10` DONE (`30%`)
- Deploy gate policy: all NP0 must be `DONE`
- Current deploy gate result: **FAIL** (NP0-04..NP0-10 still TODO)

## Reality Notes

- VPS runtime is healthy (ports/domains up), but deployed PersianToolbox code still matches old disabled behavior on key monetization/account surfaces.
- Local branch contains newer work than currently deployed production/staging releases.

| ID     | Priority | Status | Title                                                                          | Spec                 |
| ------ | -------- | ------ | ------------------------------------------------------------------------------ | -------------------- |
| NP0-01 | NP0      | DONE   | Production-grade analytics storage (no single JSON file)                       | tasks-next/NP0-01.md |
| NP0-02 | NP0      | DONE   | Deploy-blocking gate: P0 done + lint/test/build + Lighthouse + security audit  | tasks-next/NP0-02.md |
| NP0-03 | NP0      | DONE   | Feature availability framework (flags + consistent disabled UX/API)            | tasks-next/NP0-03.md |
| NP0-04 | NP0      | TODO   | Restore monetization surfaces coherently (support/ads/plans/account)           | tasks-next/NP0-04.md |
| NP0-05 | NP0      | TODO   | Security verification: response-header + nonce E2E contracts                   | tasks-next/NP0-05.md |
| NP0-06 | NP0      | TODO   | Multi-instance readiness for settings/auth/session storage                     | tasks-next/NP0-06.md |
| NP0-07 | NP0      | TODO   | Offline‑Guaranteed contract and SW shell generator                             | tasks-next/NP0-07.md |
| NP0-08 | NP0      | TODO   | Cache strategy for data endpoints (ETag/immutable where safe)                  | tasks-next/NP0-08.md |
| NP0-09 | NP0      | TODO   | Internal-link integrity gate (no dead same-origin links)                       | tasks-next/NP0-09.md |
| NP0-10 | NP0      | TODO   | Font pipeline hardening (WOFF2 + preload + cache policy)                       | tasks-next/NP0-10.md |
| NP1-01 | NP1      | TODO   | Rate-limit strategy for high-traffic endpoints + ops metrics                   | tasks-next/NP1-01.md |
| NP1-02 | NP1      | TODO   | Remove/merge redundant GitHub workflows to reduce CI duplication               | tasks-next/NP1-02.md |
| NP1-03 | NP1      | TODO   | Observability baseline: request IDs + structured logs (same-origin)            | tasks-next/NP1-03.md |
| NP1-04 | NP1      | TODO   | SEO audits: canonical/robots/schema validation in CI                           | tasks-next/NP1-04.md |
| NP1-05 | NP1      | TODO   | PWA UX polish: install prompt + offline-ready indicator + update notes         | tasks-next/NP1-05.md |
| NP1-06 | NP1      | TODO   | Admin surface re-enable plan (secure, minimal, local-first)                    | tasks-next/NP1-06.md |
| NP1-07 | NP1      | TODO   | Tool-tier enforcement: ensure Online-Required is truly network-only end-to-end | tasks-next/NP1-07.md |
| NP1-08 | NP1      | TODO   | Performance budgets (bundle size + route critical JS)                          | tasks-next/NP1-08.md |
| NP2-01 | NP2      | TODO   | Content expansion: 10 new guides + editorial checklist                         | tasks-next/NP2-01.md |
| NP2-02 | NP2      | TODO   | Accessibility expansion: axe gates for top tool flows                          | tasks-next/NP2-02.md |
| NP2-03 | NP2      | TODO   | Data versioning UX for all “data-backed” tools                                 | tasks-next/NP2-03.md |
| NP2-04 | NP2      | TODO   | Offline diagnostics UI (cache version/storage usage)                           | tasks-next/NP2-04.md |
| NP2-05 | NP2      | TODO   | Stress test harness (local) for 100k-DAU-like burst simulation                 | tasks-next/NP2-05.md |
| NP2-06 | NP2      | TODO   | Release automation: generate readiness report artifacts locally                | tasks-next/NP2-06.md |
