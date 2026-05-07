# Copilot instructions

Primary agent docs live in [`AGENTS.md`](../AGENTS.md) and [`agent-docs/`](../agent-docs/). Read those first — they cover the public surface, footguns, and conventions in depth.

Path-scoped rules (tests, public surface, stories) are in [`.github/instructions/`](instructions/) and apply automatically when those files are in context.

## Quick orientation

- React component library (`@civicactions/cmsds-open-data-components`). Parcel-bundled, published to npm. Consumed by DKAN-based open-data catalog frontends.
- **Not** a runnable application — only entry is [`src/index.ts`](../src/index.ts), which re-exports the public surface.
- Peer deps: `react ^18.2`, `@cmsgov/design-system ^12.4.2`. Library bundles its own `react-router-dom` v6 and `@tanstack/react-query` v5.

## Load-bearing facts

- **Public surface is `src/index.ts`.** Adding, removing, or renaming exports is a breaking change. Update [`agent-docs/consumer-integration.md`](../agent-docs/consumer-integration.md) in the same PR.
- **Templates self-wrap with `withQueryProvider`.** Six exports do this: `Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`, `DatasetListSubmenu`, `DatasetDataDictionaryTab`. Consumers do not need (and should not add) their own `QueryClientProvider` for these.
- **`useDatastore` uses `fetch`**, not axios. Mock `global.fetch` in tests, not axios.
- **MSW is Storybook-only.** Jest does not have MSW configured — don't reach for it in tests.
- **Cache keys are concatenated strings** (e.g. `"datastore" + id + paramsString`). `invalidateQueries(["datastore"])` matches nothing — invalidate by setter (`setConditions`) instead.
- **`customMetadataMapping` is shallow-spread.** `undefined` does NOT remove a default field — pass `() => []` to hide it.
- **Hard-coded routes:** `/datasets` and `/dataset/:id`. Consumers must match or override via `customMetadataMapping`.

## Common commands

| Command | Purpose |
|---|---|
| `npm run storybook` | Start Storybook on :6006 |
| `npm test` | Run Jest suite |
| `npm run build` | Parcel build to `dist/` |
| `npm run generate:inventory` | Regenerate `COMPONENTS_INVENTORY.md` |
| `npx generate-usage-report` | Audit which exports a consumer site uses |

## Pre-commit hook

`.husky/pre-commit` runs `npm run generate:inventory` and auto-stages `COMPONENTS_INVENTORY.md`. Don't bypass with `--no-verify` — it produces inventory drift.

## When in doubt

- Public-surface questions → [`agent-docs/consumer-integration.md`](../agent-docs/consumer-integration.md)
- Data fetching / React Query → [`agent-docs/data-flow.md`](../agent-docs/data-flow.md)
- DKAN HTTP contract → [`agent-docs/dkan-api.md`](../agent-docs/dkan-api.md)
- Tables, filters, sorting → [`agent-docs/data-table-system.md`](../agent-docs/data-table-system.md)
- Tests → [`agent-docs/testing.md`](../agent-docs/testing.md)
- Storybook + MSW → [`agent-docs/storybook-and-mocking.md`](../agent-docs/storybook-and-mocking.md)
- Releases → [`agent-docs/release-process.md`](../agent-docs/release-process.md)
- Accessibility → [`agent-docs/accessibility.md`](../agent-docs/accessibility.md)
