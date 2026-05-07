# Data flow

Services, contexts, caching, and persisted UI state. See [architecture.md](architecture.md) for the bigger picture and [dkan-api.md](dkan-api.md) for wire formats.

## Wiring

```
Consumer site
  ├─ <ACAContext.Provider value={{ACA: token}}>
  └─ withQueryProvider(<App>)             ← module-scoped QueryClient
        └─ <Router>
              └─ <Dataset id rootUrl …>
                    ├─ useMetastoreDataset(id, rootUrl)            → axios → /metastore/...
                    ├─ useDatastore('', rootUrl, opts, {datasetID:id}) → fetch → /datastore/...
                    │     └─ dual query: filtered rows + unfiltered overview
                    └─ <DataTableContext.Provider>
                          └─ <DataTableStateWrapper>
                                └─ <DataTableActionsProvider>      ← seeds from localStorage[id]
                                      └─ <DatasetTable>
```

Request path: read `ACA` from context → `acaToParams` adds `{ACA, redirect: false}` → `qs.stringify` → `fetch` (datastore) or `axios` (metastore + search) → response into React Query cache; for `useDatastore` a `useEffect` mirrors response data into local state.

## Services

All in [src/services/](../src/services/). Each consumes `ACAContext` directly.

### `useMetastoreDataset(datasetId, rootAPIUrl)`

[src/services/useMetastoreDataset/useMetastoreDataset.tsx](../src/services/useMetastoreDataset/useMetastoreDataset.tsx)

| | |
|---|---|
| Transport | `axios.get` |
| Endpoint | `GET {rootAPIUrl}/metastore/schemas/dataset/items/{id}?show-reference-ids[&ACA=…&redirect=false]` |
| Cache key | `["metastore" + id]` |
| `enabled` | always |
| Returns | `{ dataset, isPending, setId, setRootUrl }` where `dataset: DatasetType & { error?: unknown }` |
| Errors | `.catch` swallows into `dataset.error`, preserves prior dataset (lines 25–27). Templates render `<PageNotFound />` when truthy. |

### `useDatastore(resourceId, rootAPIUrl, options, additionalParams = {})`

[src/services/useDatastore/useDatastore.jsx](../src/services/useDatastore/useDatastore.jsx)

| | |
|---|---|
| Transport | `fetch` |
| Endpoint | `GET {rootAPIUrl}/datastore/query/{queryID}?{qs}` |
| Cache keys | filtered: `["datastore" + id + paramsString]` · unfiltered: `["datastore" + id + "-unfilteredRowsAndCols"]` |

`options` (selected): `keys` (default `true`), `limit` (20), `offset` (0), `conditions[]`, `requireConditions` (gates filtered query — accepted but no consumer sets it), `sort` → wire `sorts`, `properties`, `groupings`, `prepareColumns(keys[]) => keys[]`.

`additionalParams` is spread into the query string with one reserved key: **`datasetID`** is stripped before the request (line 47) and used only to decide the endpoint shape (next section).

Return: `{ loading, values, count, columns, totalRows, totalColumns, schema, conditions, properties, limit, offset, setLimit, setOffset, setConditions, setSort, setProperties, setGroupings, setResource, setRootUrl }`.

### `useSearchAPI(rootUrl, initialSearchParams = {})`

[src/services/useSearchAPI/useSearchAPI.jsx](../src/services/useSearchAPI/useSearchAPI.jsx). Powers `DatasetSearch`.

| | |
|---|---|
| Transport | `axios.get` via `fetchDatasets` ([helpers.ts](../src/services/useSearchAPI/helpers.ts)) |
| Endpoint | `GET {rootUrl}/search/?{qs}` |
| Cache | None — manual `useEffect` + `setTimeout`, no React Query |
| Debounce | 1000 ms on every dep change including pagination (`fulltext`, `selectedFacets`, `sort`, `sortOrder`, `page`, `pageSize`) |
| Errors | None — axios errors propagate; `loading` flips false on next dep change |

Param construction (helpers.ts:49–57) elides defaults: `fulltext` if falsy, `page === 1`, `page-size === 10`, `sort`/`sort-order` if falsy. `theme[]` and `keyword[]` serialize comma-style (`qs.stringify({arrayFormat: 'comma', encode: false})`).

Return: `{ items, facets, totalItems, loading, fulltext, selectedFacets, sort, sortOrder, page, pageSize, sortOptions, sortOrderOptions, setFulltext, setPage, setPageSize, setSort, setSortOrder, resetFilters }`.

## ACA injection

[`ACAContext`](../src/utilities/ACAContext.ts) = `createContext({ACA: undefined})`. [`acaToParams(params, ACA)`](../src/utilities/aca.ts) mutates `params` via `Object.assign` when `ACA` is truthy, adding `{ACA, redirect: false}`. **Mutates in place and returns the same reference** — don't pass a shared object.

| Site | Line |
|---|---|
| `useMetastoreDataset` | 25 |
| `useDatastore` filtered | 65 |
| `useDatastore` unfiltered | 96 |
| `useSearchAPI` (`fetchDatasets`) | helpers.ts:57 |
| Dataset data-dictionary fetch | [Dataset/index.tsx:32](../src/templates/Dataset/index.tsx) |
| FilteredResourceBody Swagger URL | [FilteredResourceBody.jsx:150](../src/templates/FilteredResource/FilteredResourceBody.jsx) |

New fetch sites: read `ACA` from `useContext(ACAContext)`, pipe params through `acaToParams` before stringifying.

## Dual `useDatastore` query

Two `useQuery` calls, same hook.

**1. Filtered rows** — gated by `enabled = !!id && (!requireConditions || conditions.length > 0)` (lines 68–74).

**2. Unfiltered overview** — always fires. Sends `results=false&count=true&schema=true` for `totalRows`/`totalColumns` on the Overview tab. Independent cache key, so a filter change refetches #1 without touching #2.

## Operator rewrites + dataset-API switch

**Operator rewrites** ([useDatastore.jsx:49–53](../src/services/useDatastore/useDatastore.jsx)) — only transform inside the service:

| UI operator | Sent as |
|---|---|
| `is_empty` | `{operator: '=', value: ''}` |
| `not_empty` | `{operator: '<>', value: ''}` |

LIKE `%`-padding and IN array splitting happen in `updateQueryForDatastore` inside the filter UIs, not here. See [data-table-system.md](data-table-system.md).

**Dataset-API switch** (lines 42–44, 76):
```js
const useDatasetAPI = typeof window !== 'undefined'
  && window.drupalSettings?.datastore_query_api === true;
const queryID = useDatasetAPI && datasetID ? `${datasetID}/0` : id;
```
Off → distribution path `{resourceId}`. On → dataset path `{datasetID}/0`. Templates passing `datasetID`: `Dataset`, `FilteredResourceBody`. **`StoredQueryPage` does not** ([StoredQueryPage/index.tsx:56](../src/templates/StoredQueryPage/index.tsx)) — always uses distribution path.

## State outside React Query

`useDatastore` keeps 16 `useState` calls (lines 18–40) for `limit`, `offset`, `conditions`, `sort`, `groupings`, `properties`, `values`, `count`, `columns`, `schema`, `totalRows`, `totalColumns`, `id`, `rootUrl`, etc.

- Local state drives the **request** (serialized into `paramsString`, becomes part of cache key).
- React Query caches the **response**. A `useEffect` (lines 102–122) mirrors response data into local state.

**No invalidate path.** Filter change → `setConditions` → new `paramsString` → new cache key → fresh fetch. Old cache entry is never explicitly cleared. Cache keys are flat strings (not arrays) — `queryClient.invalidateQueries(["datastore"])` matches nothing.

## QueryClient is module-scoped

[`src/utilities/QueryProvider/QueryProvider.jsx`](../src/utilities/QueryProvider/QueryProvider.jsx):
```jsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});
const withQueryProvider = (WrappedComponent) => (props) => (
  <QueryClientProvider client={queryClient}>
    <WrappedComponent {...props} />
  </QueryClientProvider>
);
```

Single instance shared across all wrapped consumers. Wrapped at default export:
- Templates: `Dataset` ([index.tsx:312](../src/templates/Dataset/index.tsx)), `DatasetSearch` ([DatasetSearch.tsx:382](../src/templates/DatasetSearch/DatasetSearch.tsx)), `DatasetList` ([DatasetList.tsx:286](../src/templates/DatasetList/DatasetList.tsx)), `FilteredResource` ([index.jsx:87](../src/templates/FilteredResource/index.jsx)).
- Components: `DatasetListSubmenu` ([DatasetListSubmenu.tsx:124](../src/components/DatasetListSubmenu/DatasetListSubmenu.tsx)) — publicly exported, calls a query hook independently. `DatasetDataDictionaryTab` ([index.tsx:37](../src/components/DatasetDataDictionaryTab/index.tsx)) — internal, used by `Dataset`.

Consumer's own `QueryClientProvider` doesn't share the cache — it adds a second client. Storybook uses a different client ([.storybook/queryClient.ts](../.storybook/queryClient.ts) — `retry: false`, `staleTime: Infinity`).

## Data-table contexts

Two layers; nested in this order.

### Layer 1: `DataTableContext` — data

[src/templates/Dataset/DataTableContext.tsx](../src/templates/Dataset/DataTableContext.tsx)

```ts
{
  id: string | null,
  resource?: ResourceType,         // useDatastore result
  distribution?: DistributionType,
  rootUrl?: string,
  customColumns?: ColumnType[],
  dataDictionaryBanner?: boolean,
  datasetTableControls?: boolean,  // gates localStorage persistence
  enableEmptyFilters?: boolean,
}
```

Provided by: `Dataset` (CSV path), `StoredQueryPage`, `FilteredResourceBody`. Consumed by `DatasetTableTab`, `DataTableActionsProvider`, descendants.

### Layer 2: `DataTableActionsContext` — UI state

[src/components/DatasetTableTab/DataTableActionsContext.tsx](../src/components/DatasetTableTab/DataTableActionsContext.tsx)

```ts
{
  columnOrder: string[],
  columnVisibility: { [k: string]: boolean },
  page: number,
  tableDensity: 'compact' | 'normal' | 'expanded',
  + setters
}
```

Provider reads `id` and `datasetTableControls` from `DataTableContext` — must nest below it.

### `DataTableStateWrapper`

[src/components/DatasetTableTab/DataTableStateWrapper.tsx](../src/components/DatasetTableTab/DataTableStateWrapper.tsx) — installs `DataTableActionsProvider` and forwards visibility flags (`showCopyLinkButton`, `showDataTableToolbar`, `showDownloadFilteredDataButton`, `showDownloadFullDataButton`, `showStoredQueryDownloadButton`) to `DatasetTable`.

## localStorage persistence — read once, write at action sites

**Key**: dataset `id` from `DataTableContext`.
**Value**: `{ tableColumnOrder: string[], tableColumnVisibility: { [col]: boolean } }`. `page` and `tableDensity` are not persisted.

**Read** — [DataTableActionsContext.tsx:39–49](../src/components/DatasetTableTab/DataTableActionsContext.tsx). Provider seeds `columnOrder` and `columnVisibility` on mount, gated by `datasetTableControls === true`. `page` always seeds to 1; `tableDensity` always to `'normal'`.

**Writes** (not in the provider):
1. [`ManageColumns.jsx:174–179`](../src/components/ManageColumns/ManageColumns.jsx) — Save button writes both fields.
2. [`DataTableToolbar/index.tsx:74–81`](../src/components/DataTableToolbar/index.tsx) — `resetColumnVisibility` reads, merges, writes back.

Calling `setColumnOrder`/`setColumnVisibility` alone does **not** persist. New write paths must mirror the pattern (set state + write localStorage).

## URL-driven state

| Surface | Mechanism |
|---|---|
| `Dataset` | `qs.parse(location.search)` at mount → seeds `useDatastore` options ([Dataset/index.tsx:70](../src/templates/Dataset/index.tsx)) |
| `FilteredResourceBody` | Same `qs.parse`; QueryBuilder rewrites URL on submit |
| `DatasetSearch` | `useSearchParams` + `useNavigate`; `buildNextQueryString` merges |
| `DatasetList` | `useSearchParams` + `useLocation`; pagination/sort sync |
| `StoredQueryPage` | `query` prop (JSON string) → parsed on mount; operator map `is`→`=`, `is not`→`<>`, `or`→`in` |

Library has no Router context — consumer provides `<BrowserRouter>` (or equivalent) above any template.

## Pitfalls

- **No partial cache invalidation.** Cache keys are strings, not arrays. Force a refetch by changing a setter that affects `paramsString`.
- **`useSearchAPI` debounce applies to pagination.** Removing the debounce will hammer the API on every keystroke — the same effect handles both.
- **localStorage keyed by dataset `id`.** Two datasets in the same browser have independent column state. Re-issued IDs orphan old entries.
- **`datasetTableControls=false` disables localStorage seeding** entirely. Writes still happen. Don't toggle dynamically.
- **`additionalParams.datasetID` is reserved.** Don't put `keys`, `limit`, `offset`, `conditions`, `sorts`, `properties`, `groupings` in `additionalParams` — they collide.
- **`acaToParams` mutates its first argument.**
- **Error handling is asymmetric**: `useMetastoreDataset` swallows into `dataset.error`; `useDatastore` and `useSearchAPI` don't catch. Failed datastore fetch leaves `data` undefined and `loading` false — check `count === null`.
- **Unfiltered overview query always fires.** Runs on every Dataset mount even if Overview tab is never opened.
