# AGENTS.md

Entry point for AI agents. Lists the docs, the load-bearing facts, and the gotchas.

## Repo

`@civicactions/cmsds-open-data-components` — React component library shipping page templates, data tables, search UI, and API docs for [DKAN](https://github.com/GetDKAN)-based open-data catalog sites.

- Repo: [GetDKAN/cmsds-open-data-components](https://github.com/GetDKAN/cmsds-open-data-components)
- Bundler: Parcel 2 — entry [src/index.ts](src/index.ts), output `dist/`
- Peer deps: `@cmsgov/design-system ^12.4.2`, `react ^18.2`
- License: GPL-3.0

## Layout

```
src/
  index.ts          Public API (only items here are exported)
  components/       ~64 leaf components
  templates/        Page-level layouts (Dataset, DatasetSearch, APIPage, …)
  services/         useDatastore, useSearchAPI, useMetastoreDataset
  utilities/        QueryProvider HOC, ACA context, format helpers, Swagger plugin
  types/            dataset.ts, search.ts, misc.ts
  assets/           metadataMapping.jsx, frequencyMap.js, SVG icons
  tests/fixtures/   Shared JSON fixtures
.storybook/         Storybook 9 + Vite + MSW (mswHandlers.ts, queryClient.ts)
__mocks__/          Jest module mocks + MSW data
scripts/            generate-inventory.cjs, generate-usage-report.cjs
```

`COMPONENTS_INVENTORY.md` is auto-generated (`npm run generate:inventory`) and re-staged by the husky pre-commit hook. Don't hand-edit.

## Docs

| File | Purpose |
|---|---|
| [README.md](README.md) | install/build/publish, Storybook, inventory script |
| [COMPONENTS_INVENTORY.md](COMPONENTS_INVENTORY.md) | auto-generated component table (public/internal, story/test coverage) |
| [scripts/README.md](scripts/README.md) | inventory + usage-report scripts |
| [.husky/README.md](.husky/README.md) | pre-commit hook behavior |
| [agent-docs/architecture.md](agent-docs/architecture.md) | DKAN stack, four major surfaces, build/dev loop, version compat |
| [agent-docs/data-flow.md](agent-docs/data-flow.md) | services, contexts, ACA injection, dual `useDatastore` query, localStorage asymmetry |
| [agent-docs/dkan-api.md](agent-docs/dkan-api.md) | backend HTTP contract: endpoints, query params, response shapes, operator vocabulary |
| [agent-docs/data-table-system.md](agent-docs/data-table-system.md) | render primitive, orchestrator, toolbar, ManageColumns + dnd-kit, three filter UIs |
| [agent-docs/storybook-and-mocking.md](agent-docs/storybook-and-mocking.md) | MSW handler factories, in-memory query engine, FA Pro→Free shim |
| [agent-docs/testing.md](agent-docs/testing.md) | Jest 30 + RTL, axios-mock pattern, why no `QueryClientProvider` in tests |
| [agent-docs/consumer-integration.md](agent-docs/consumer-integration.md) | for downstream sites: install, wrapper, public exports, customization |
| [agent-docs/release-process.md](agent-docs/release-process.md) | manual publish, alpha tag, what CI doesn't catch |
| [agent-docs/accessibility.md](agent-docs/accessibility.md) | live regions, keyboard column resize, focus trap, jest-axe how-to |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Copilot-specific orientation; pointer to AGENTS.md and agent-docs |
| [.github/instructions/](.github/instructions/) | path-scoped Copilot reminders (tests, public surface, stories) |

## Load-bearing facts

- **Public API = [src/index.ts](src/index.ts).** Anything not re-exported is internal.
- **`ACA` token**: auth/cache-busting, supplied via `<ACAContext.Provider>` ([src/utilities/ACAContext.ts](src/utilities/ACAContext.ts)). `acaToParams()` injects `{ACA, redirect: false}` into every datastore/metastore/search request. Default `ACA: undefined` is safe — no token, no `?ACA=` param.
- **HTTP transports are mixed**: `useDatastore` uses `fetch`; `useMetastoreDataset` and `useSearchAPI` use `axios`. Match the surrounding service.
- **React Query**: `withQueryProvider` ([src/utilities/QueryProvider/QueryProvider.jsx](src/utilities/QueryProvider/QueryProvider.jsx)) wraps four templates (`Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`) plus two components that independently call query hooks (`DatasetListSubmenu`, `DatasetDataDictionaryTab`) at their default exports. The `QueryClient` is module-scoped (one shared instance across the library). `refetchOnWindowFocus: false`.
- **Two contexts coordinate the data table**: [`DataTableContext`](src/templates/Dataset/DataTableContext.tsx) (data) and [`DataTableActionsContext`](src/components/DatasetTableTab/DataTableActionsContext.tsx) (UI state, persists `columnOrder`+`columnVisibility` to `localStorage[id]` when `datasetTableControls` is on). localStorage is read once in the provider, written at action sites — see [data-flow.md](agent-docs/data-flow.md).
- **Drupal switch**: `window.drupalSettings.datastore_query_api === true` flips `useDatastore` from `/datastore/query/{resourceId}` to `/datastore/query/{datasetID}/0`. Tests/Storybook never set it.
- **Local dev**: `npm run watch` + npm workspaces. Consumer's lockfile must declare the same version this repo advertises, or imports resolve to the published copy.
- **CI** ([.circleci/config.yml](.circleci/config.yml)): `npm install && npx jest --coverage`. **No build, no typecheck, no lint.** Run `npx tsc --noEmit` and `npm run build` locally before publishing.
- **Publish**: `rm -rf dist/ .parcel-cache/ && npm run build && npm publish` (`--tag alpha` for pre-releases).
- **TypeScript is loose**: `target: es5`, `allowJs: true`. Mixed `.jsx`/`.tsx`/`.js`. Strict-mode types don't apply to `.jsx`.

## Backend API (one-line summary)

| Service | Endpoint |
|---|---|
| `useMetastoreDataset` | `GET /metastore/schemas/dataset/items/{id}?show-reference-ids` |
| `useDatastore` | `GET /datastore/query/{resourceId}?{qs}` (filtered + unfiltered overview) |
| `useSearchAPI` | `GET /search/?{qs}` — 1s debounce on **every** dep change including pagination |
| `getDataDictionary` | `GET {dataDictionaryUrl}` (caller-provided) |
| `APIPage` | `GET {rootUrl}/openapi.json` |

`useDatastore` operator rewrites: `is_empty` → `=` `''`, `not_empty` → `<>` `''`. LIKE wildcards and IN array splitting happen in filter UI components, not in the service. Full reference: [dkan-api.md](agent-docs/dkan-api.md).

## Conventions

- **Per-component dirs**: `Foo/index.tsx`, `Foo/Foo.stories.tsx`, `Foo/foo.test.jsx`, optional `Foo/foo.scss`.
- **Stories**: CSF3, `Foo.stories.tsx|jsx`.
- **Tests**: `*.test.*` co-located. Naming inconsistent (PascalCase, lowercase, kebab-case all exist).
- **Renamed exports** the inventory script must know about: `Datatable` → `DataTable`, `DatasetTableTab` → `DatasetTable`, `DatasetAdditionalInformation` exports `buildRows` (named), `aca.ts` exports `acaToParams`. Update [scripts/generate-inventory.cjs](scripts/generate-inventory.cjs) when adding similar.
- **Custom Swagger UI**: [src/utilities/ApiDocsSwaggerUIPlugin/](src/utilities/ApiDocsSwaggerUIPlugin/). Edit there, not in the consumer site.
- **Metadata fields**: `defaultMetadataMapping` in [src/assets/metadataMapping.jsx](src/assets/metadataMapping.jsx). Consumers override per-key via `customMetadataMapping`.

## Gotchas

- **TypeScript strictness gap**: `strict: true` only applies to `.ts`/`.tsx`. `.jsx`/`.js` files coexist and are lightly checked.
- **`prop-types` + TS coexist** — older components use `PropTypes`, newer use TS interfaces. Both live in tree.
- **Type bundle is Parcel-built**: `dist/types.d.ts` comes from `@parcel/transformer-typescript-types`. If consumer types break, suspect Parcel before tsc.
- **Pro Font Awesome classes appear in source** (`fa-file-xls`, `far`/`fal`/`fad`). Storybook shims them via `FontAwesomeProToFree`; consumer sites need their own Pro stylesheet or accept missing icons. Don't add new Pro-only classes.
- **Three filter-UI implementations, two in production**: [`templates/FilteredResource/QueryBuilder.jsx`](src/templates/FilteredResource/QueryBuilder.jsx) (inline, on FilteredResource), [`components/FilterDataset/`](src/components/FilterDataset/) (modal, in Dataset toolbar), and [`components/QueryBuilder/`](src/components/QueryBuilder/) — imported in `DatasetTableTab` but never rendered. `updateQueryForDatastore` is duplicated in all three.
- **`src/templates/index.ts` only re-exports `PageNotFound`**; **`src/utilities/index.ts` only exports `datasetSearchReq`**. Both are mostly stubs — [src/index.ts](src/index.ts) is the real public surface.
- **`scripts/*.cjs` must stay `.cjs`** because `"type": "module"`.
- **ESLint is half-wired**: [package.json](package.json) `eslintConfig.extends: "react-app"` (not installed); [.eslintrc.js](.eslintrc.js) `parser: "babel-eslint"` (deprecated, not installed). Only `plugin:storybook/recommended` resolves. No `lint` script. Running `eslint` locally errors.
- **Prettier**: [.prettierrc](.prettierrc) `singleQuote: true, printWidth: 100`. No format script.
- **React Query keys are strings** (`"datastore" + id + paramsString`, `"metastore" + id`), not arrays. `queryClient.invalidateQueries(["datastore"])` matches nothing.
- **MSW worker** [public/mockServiceWorker.js](public/mockServiceWorker.js) is committed. Regenerate with `npx msw init public --save` if MSW is upgraded.
- **`customMetadataMapping` is spread, not merged**: passing `undefined` for a key keeps the default. To hide a field, pass a function returning `[]`.
- **`useMetastoreDataset` swallows errors** into `dataset.error`. Check it before trusting the rest of the shape.
- **`useDatastore` and `useSearchAPI` don't catch errors**. Failed fetch leaves `data` undefined and `loading` false — distinguish "never loaded" via `count === null`.
- **`DOMPurify.sanitize`** wraps every `dangerouslySetInnerHTML` (`DatasetDescription`, `Resource`, `truncateText`). Dataset descriptions can contain user-authored HTML — keep sanitization.
- **Implicit Drupal coupling**: `window.drupalSettings.datastore_query_api` (read at runtime), `NavLinkArray.drupalPage` flag. Library runs without Drupal; these are escape hatches.
- **`react-router-dom ^6.8.0` is a direct dep, not peer**. Consumer must use v6 and a single Router context above any template.
- **`react-dnd*` jest moduleNameMapper is dead config** — library uses `@dnd-kit`, not `react-dnd`. No `react-dnd` imports in src/.
- **`.gitignore` excludes `lib/`** (legacy from a prior bundler) and **`docs/`** (legacy from removed `.docz`). Current build emits to `dist/`.

## Known issues

Verified bugs surfaced during a review pass — not yet fixed. Capture here so future work doesn't waste time rediscovering.

- **`ErrorBoundary` default mode is broken** ([src/components/ErrorBoundary/index.tsx:30-50](src/components/ErrorBoundary/index.tsx)) — when `component` prop is unset, returns the error UI unconditionally, hiding children. Only the `component={true}` branch checks `hasError`. High severity.
- **Conditional hooks (Rules of Hooks violations)** in three sites — `useState`/`useEffect` after early `return null`. Crashes on render-order changes:
  - [src/components/FilterDataset/index.tsx:52-74](src/components/FilterDataset/index.tsx)
  - [src/components/DatasetDescription/index.tsx:12](src/components/DatasetDescription/index.tsx)
  - [src/templates/Dataset/index.tsx:27](src/templates/Dataset/index.tsx) — `getDataDictionary` is a plain function calling `useContext`/`useQuery` and is invoked conditionally
- **`useDatastore` `setCount(null)` inside queryFn** ([src/services/useDatastore/useDatastore.jsx:80-84](src/services/useDatastore/useDatastore.jsx)) — state mutation during queryFn execution; clobbers count on cached refetches. Move to a `useEffect` watching `paramsString`.
- **`useDatastore` unfiltered query has no `enabled` gate** ([src/services/useDatastore/useDatastore.jsx:88-99](src/services/useDatastore/useDatastore.jsx)) — fires when `id === ''` (initial `Dataset` mount), hitting `/datastore/query/?...` until distribution effect resolves. Add `enabled: !!queryID`.
- **Header listener stale closures** ([src/templates/Header/index.tsx:98-119](src/templates/Header/index.tsx)) — effect deps `[mobileMenuOpen]` only; handlers recreated each render close over potentially stale state. Wrap in `useCallback` with stable refs or include full deps.
- **`StoredQueryPage` not wrapped in `withQueryProvider`** ([src/templates/StoredQueryPage/index.tsx](src/templates/StoredQueryPage/index.tsx)) — uses `useMetastoreDataset`/`useDatastore` but isn't self-wrapped like its peers. Crashes if consumer doesn't wrap.
- **Mutation of shared condition objects** ([src/components/FilterDataset/index.tsx:189](src/components/FilterDataset/index.tsx)) — `[...queryConditions]` is shallow; inner-object mutations leak across `titleConditions` etc.
- **`key={index}` on filter chips** ([src/components/DataTableToolbar/index.tsx:147](src/components/DataTableToolbar/index.tsx)) — splice-based removal + index keys cause React to attach stale state to wrong chip.
- **`MobileHeader` null-deref on `.focus()`** ([src/components/MobileHeader/MobileHeader.jsx:77](src/components/MobileHeader/MobileHeader.jsx)) — `document.querySelector(...).focus()` throws when button is unmounted.
- **`localStorage` parse can crash provider mount** ([src/components/DatasetTableTab/DataTableActionsContext.tsx:39](src/components/DatasetTableTab/DataTableActionsContext.tsx)) — `JSON.parse` on malformed data throws. Wrap in try/catch.
