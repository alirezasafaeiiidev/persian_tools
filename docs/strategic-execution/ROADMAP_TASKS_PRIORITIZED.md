# Prioritized Roadmap Tasks - asdev-persiantoolbox

- Generated: 2026-02-17
- Source: `docs/PRODUCT_ROADMAP.md`, `docs/TECHNICAL_SPEC.md`
- Execution mode: Auto (local-first safe)
- Priority model: `P0` (Phase 1 hardening gates) -> `P1` (reliability UX) -> `P2` (growth/SEO/systemization)

| Priority | Phase   | Task                                                     | Status      | Evidence                                                                                 | Next Action                                                |
| -------- | ------- | -------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| P0       | Phase 1 | CSP + Security Headers enforce in runtime                | Done        | `proxy.ts`, `tests/unit/proxy-csp.test.ts`                                               | Keep policy strict; add regression tests on policy changes |
| P0       | Phase 1 | Local-First gate (no off-origin runtime dependency)      | Done        | `scripts/quality/verify-local-first.ts`, `pnpm gate:local-first` (OK on 2026-02-17)      | Keep gate mandatory in CI                                  |
| P0       | Phase 1 | Quality gates lock (`lint + typecheck + test`)           | Done        | `pnpm ci:quick` passed on 2026-02-17                                                     | Keep as required check before merge                        |
| P1       | Phase 1 | Unified Error System (`useToolError`, ErrorBoundary map) | In Progress | `shared/utils/result.ts`, `shared/errors/base.ts`, `shared/errors/pdf.ts`                | Add shared hook + boundary + error-code-to-UX map          |
| P1       | Phase 1 | Heavy file guardrails (size/type/Lite mode guidance)     | In Progress | Existing PDF/Image tool tests and worker tests                                           | Standardize guardrails contract across all heavy tools     |
| P1       | Phase 1 | Registry modularization (per-category + aggregator)      | Todo        | Current single file `lib/tools-registry.ts`                                              | Split into category modules and preserve public API        |
| P2       | Phase 2 | SEO systemization (schema/template/internal linking)     | In Progress | Existing SEO tests (`tests/seo-tools.test.ts`, `tests/unit/seo-jsonld-contract.test.ts`) | Add guide template + category-level content packs          |
| P2       | Phase 3 | Core tool quality upgrade (PDF/Finance benchmarks)       | Todo        | Roadmap-defined deliverables                                                             | Define internal benchmark suite and baseline fixtures      |
| P2       | Phase 4 | Offline-compatible monetization enablement               | In Progress | Existing subscription/admin routes and tests                                             | Add offline license validation contract                    |

## Auto Execution Log (2026-02-17)

1. `pnpm ci:quick` -> Passed
2. `pnpm vitest --run tests/unit/proxy-csp.test.ts tests/unit/local-first-gate.test.ts tests/unit/tool-tier-contract.test.ts tests/unit/tools-registry-indexing.test.ts` -> Passed

## Ordered Next Task Queue

1. `P1` Implement shared `useToolError` + `ToolErrorBoundary` + Persian UX message mapping.
2. `P1` Normalize heavy-tool guardrails with one common contract (size/type/recovery hints).
3. `P1` Refactor `lib/tools-registry.ts` into modular category files with aggregator compatibility.
4. `P2` Create tool landing content template and link graph enforcement checks.
5. `P2` Add benchmark harness for PDF/Finance core quality gates.
