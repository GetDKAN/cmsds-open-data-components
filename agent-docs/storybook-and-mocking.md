# Storybook and mocking

Storybook 9 + Vite + MSW. Jest mocking is covered separately in [testing.md](testing.md).

## Layout

```
.storybook/
  main.ts                     framework, stories glob, Vite override
  preview.tsx                 global decorators, MSW init, controls
  mswHandlers.ts              handler factories + in-memory query engine
  queryClient.ts              createStorybookQueryClient()
  font-awesome-overrides.css  paired with FA Pro→Free decorator

__mocks__/
  mockDatasetItem.js          Full DCAT dataset + 100-row results + schema (Dataset stories)
  mockDatasetSearchResults.js Search API response (DatasetList/DatasetSearch)
  mockStoredQueryData.js      Dataset metadata + datastore records (StoredQueryPage)
  mockOpenAPISpec.ts          OpenAPI 3.0 specs with/without auth (APIPage)
  mockLinks.js                Header/footer link fixtures
  fileMock.js, styleMock.js, swaggerMock.js   Jest-only — see jest.config.cjs
```

`__mocks__/` is **not** Jest's automatic-mock dir. `*Mock.js` files are referenced explicitly via `moduleNameMapper` in [jest.config.cjs](../jest.config.cjs); `mock*.js` files are MSW data.

## main.ts

[.storybook/main.ts](../.storybook/main.ts) (28 lines):
- Framework: `@storybook/react-vite`.
- Stories glob: `../src/**/*.mdx` and `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` — templates and components in same glob.
- Addons: only `@storybook/addon-docs` (controls bundled in v9).
- `viteFinal` adds `@vitejs/plugin-react` with `jsxRuntime: 'automatic'` to avoid JSX transform conflicts.

No `manager.ts`.

## preview.tsx

[.storybook/preview.tsx](../.storybook/preview.tsx):

Global CSS imports (lines 2–5): design-system `index.css` + `core-theme.css`, FA Free `all.css`, `font-awesome-overrides.css`.

MSW init (lines 11–13): `initialize({onUnhandledRequest: 'bypass'}, handlers)`. `handlers` from [mswHandlers.ts:298](../.storybook/mswHandlers.ts) is an empty array. **No global mocking** — per-story handlers required. Unmocked requests pass silently.

Loaders (line 63): `[mswLoader]` — required for `parameters.msw.handlers`.

Two global decorators:
1. `FontAwesomeProToFree` (runs first).
2. `Layout` wrapper — `maxWidth: 1200px`, gray background.

**No global Router, QueryClientProvider, or ACAContext.** Stories wrap their own.

## FontAwesomeProToFree

[preview.tsx:27-52](../.storybook/preview.tsx) — runtime DOM patch via `useEffect` + `MutationObserver`:
1. Replaces Pro weight classes (`.far`/`.fal`/`.fad`/`.fat`) → `.fas`.
2. Maps `fa-file-xls` → `fa-file-excel` (only Pro-name remap).

Runs on every story; observes `document.body` for additions. CSS in [font-awesome-overrides.css](../.storybook/font-awesome-overrides.css) handles cases that can't be class-swapped (pseudo-elements).

**Consumer sites do not get this shim** — they need their own Pro stylesheet.

## MSW handler factories

All in [mswHandlers.ts](../.storybook/mswHandlers.ts).

| Factory | Mocks | Used by |
|---|---|---|
| `createStoredQueryPageHandlers(metadata, records)` | `/metastore/schemas/dataset/items/:id`, `/datastore/query/:resourceId` | `StoredQueryPage.stories.tsx` |
| `createDatasetListHandlers(searchResults)` | `/search/*` | `DatasetList.stories.tsx`, `DatasetSearch.stories.tsx` |
| `createDatasetPageHandlers()` | dataset metadata + docs + data dictionary + two distributions' datastore | `Dataset.stories.tsx` |
| `createAPIPageHandlers(spec, specWithAuth?)` | `/openapi.json` (auth via `?authentication=`) | `APIPage.stories.tsx` |

Handlers `await delay(300|500)` to simulate latency.

`createDatasetPageHandlers` has **hardcoded distribution IDs** (`479a03e6-ccf1-5636-9fd3-cad48c11177d`, `8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b`) from `mockDatasetItem.js`. Different mock data → unmocked requests → perpetual loading. Edit IDs or write a new factory.

## In-memory query engine

[`filterResultsByConditions`](../.storybook/mswHandlers.ts) at [lines 30-82](../.storybook/mswHandlers.ts).

Implements:
- Reads `qs.parse(url.search)` conditions (handles array and object forms).
- AND across conditions.
- Operators (line 61–78): `=`/`is`, `<>`/`is not`, `starts with`, `contains`, `in`. Latter three case-insensitive.
- Unknown operators → match everything (line 79). **Footgun**: filtering on `>` or `like` looks like the filter does nothing.

Does **not** implement: wire-level `like`, `match`, `>`, `<`, `>=`, `<=`, `between`, `is null`, `is not null`. Also no `sorts`/`properties`/`groupings`. `is_empty`/`not_empty` get rewritten to `=`/`<>` before reaching the wire — engine handles those correctly.

`createDatasetPageHandlers` calls it on `mockDatasetItemResults.results` (lines 220, 238) before paginating with `limit`/`offset`.

## Per-story handlers

```tsx
parameters: { msw: { handlers: createDatasetPageHandlers() } }
```

Examples:
- [Dataset.stories.tsx](../src/templates/Dataset/Dataset.stories.tsx) — `createDatasetPageHandlers()`.
- [StoredQueryPage.stories.tsx](../src/templates/StoredQueryPage/StoredQueryPage.stories.tsx) — different stories pass different `datastoreRecords` variants (`mockFilteredDatastoreRecords`, `mockLargeDatastoreRecords`).
- [DatasetList.stories.tsx:31-33](../src/templates/DatasetList/DatasetList.stories.tsx) — at meta level so all stories inherit.

Per-story overrides per-meta. Component stories without network calls omit `msw`.

## Per-story decorators

Canonical pattern from [DatasetList.stories.tsx:54-64](../src/templates/DatasetList/DatasetList.stories.tsx):

```tsx
decorators: [
  (Story) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ACAContext.Provider value={{ ACA: undefined }}>
          <Story />
        </ACAContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  ),
],
```

`queryClient = createStorybookQueryClient()` ([queryClient.ts](../.storybook/queryClient.ts)) — `retry: false`, `staleTime: Infinity`.

## Mock data

| File | Shape | Used by |
|---|---|---|
| `mockDatasetItem.js` | Full DCAT dataset, two distributions, 100-row datastore, schema | `Dataset.stories.tsx` |
| `mockDatasetSearchResults.js` | DKAN search response with facets | `DatasetList`, `DatasetSearch` |
| `mockStoredQueryData.js` | Dataset metadata + 4-row datastore + filtered/large variants | `StoredQueryPage` |
| `mockOpenAPISpec.ts` | OpenAPI 3.0 with/without auth | `APIPage` |
| `mockLinks.js` | Header/footer navigation arrays | `Header`, `Footer` |

Storybook only. Jest fixtures live in [src/tests/fixtures/](../src/tests/fixtures/) — separate, no shared data with `__mocks__/`.

## Naming

CSF3 throughout. `Foo.stories.@(tsx|jsx|js|ts|mjs)`. Inventory script ([scripts/generate-inventory.cjs](../scripts/generate-inventory.cjs)) checks story coverage by these filenames. Some legacy lowercase names exist; use PascalCase for new files.

## What breaks stories

- **Missing decorator** for `useNavigate` → throws "useNavigate may be used only in the context of a Router".
- **Missing QueryClient** → `useQuery` hangs in pending forever.
- **Wrong distribution ID** in `createDatasetPageHandlers` → unmocked → perpetual loading.
- **Operator not in engine** → filter "did nothing" (no error).
- **`onUnhandledRequest: 'bypass'` hides missing mocks** — no warning. Check network tab if data is blank.
- **MSW worker outdated**: [public/mockServiceWorker.js](../public/mockServiceWorker.js). Regenerate with `npx msw init public --save` after MSW upgrade.
- **`await delay(300|500)`**: screenshots before the delay capture loading state.

## Adding a new backend-data story

1. Pick or write a factory in `mswHandlers.ts`.
2. Add mock data to `__mocks__/` if needed.
3. In the story: import factory → `parameters.msw.handlers = factory(...)` → wrap with `MemoryRouter`, `QueryClientProvider` (use `createStorybookQueryClient()`), `ACAContext.Provider` as needed.
4. Pro-icon stories: extend `FontAwesomeProToFree` or `font-awesome-overrides.css`.

## Storybook vs Jest

Storybook intercepts at the **network layer** (MSW service worker). Real components, real `useQuery`, real `axios`/`fetch` paths run.

Jest intercepts at the **module layer** (`jest.mock('axios')`, `moduleNameMapper`). jsdom can't render Swagger UI or resolve CSS imports. Service worker would be overkill for unit tests.

The two mock systems are parallel — fixtures don't share between them.
