# asdev-persiantoolbox

Technical documentation for the corrective/development track is available at:

- `docs/technical/README.md`
- `docs/technical/APPLICATION_REPORT.md`
- `docs/technical/CHANGELOG_APPLIED.md`
- `docs/technical/smoke-tests.md`

For strategic/release governance documents, see:

- `docs/strategic-execution/`
- `docs/release/`

## Validation Commands
- `pnpm lint`
- `pnpm typecheck`
- `pnpm gate:local-first`
- `pnpm vitest --run tests/golden/golden-runner.test.ts`
