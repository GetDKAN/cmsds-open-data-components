# Data table system

~14 components on TanStack React Table v8 + dnd-kit. Drives the Data Table tab on `Dataset`, `FilteredResource` body, `StoredQueryPage` body. Does not drive `DatasetSearch`/`DatasetList` (simpler list UIs). Read [data-flow.md](data-flow.md) first.

## Anatomy

```
Template (Dataset / FilteredResource / StoredQueryPage)
  · useDatastore() → resource
  · <DataTableContext> { distribution, resource, columns }
  · <DataTableActionsProvider> (UI state + localStorage)
    └── DatasetTableTab / FilteredResourceBody
         · tableDensity → tablePadding
         · downloadURL from conditions
         · <Datatable> + <Pagination> (design-system)
           └── Datatable.jsx
                · useReactTable() with manualSorting
                · <DataTableToolbar>
                · <thead> = TruncatedResizeableTHead | FixedSizeTHead
                · <tbody> rows.map() (no virtualization)
```

## Components

| Role | File |
|---|---|
| Render primitive | [Datatable.jsx](../src/components/Datatable/Datatable.jsx) |
| Resizable header | [TruncatedResizeableTHead.jsx](../src/components/Datatable/TruncatedResizeableTHead.jsx) |
| Fixed header | [FixedSizeTHead.jsx](../src/components/Datatable/FixedSizeTHead.jsx) |
| Resize handle | [HeaderResizeElement.tsx](../src/components/Datatable/HeaderResizeElement.tsx) |
| Orchestrator | [DatasetTableTab/index.tsx](../src/components/DatasetTableTab/index.tsx) |
| State seeder | [DataTableStateWrapper.tsx](../src/components/DatasetTableTab/DataTableStateWrapper.tsx) |
| Toolbar | [DataTableToolbar/index.tsx](../src/components/DataTableToolbar/index.tsx) |
| Page results | [DataTablePageResults.tsx](../src/components/DataTablePageResults/DataTablePageResults.tsx) |
| Density + page size | [DisplaySettings/index.tsx](../src/components/DisplaySettings/index.tsx) |
| Column manager | [ManageColumns.jsx](../src/components/ManageColumns/ManageColumns.jsx) |
| Sortable card | [Card.tsx](../src/components/ManageColumns/Card.tsx) |
| Full-screen toggle | [FullScreenDataTable/index.tsx](../src/components/FullScreenDataTable/index.tsx) |
| Filter modal | [FilterDataset/index.tsx](../src/components/FilterDataset/index.tsx) |
| Filter row (modal) | [FilterDataset/FilterItem.tsx](../src/components/FilterDataset/FilterItem.tsx) |
| Inline query builder | [components/QueryBuilder/index.tsx](../src/components/QueryBuilder/index.tsx) (not in production) |
| Inline filter row | [components/QueryRow/index.tsx](../src/components/QueryRow/index.tsx) (not in production) |
| Clear-all button | [QueryBuilder/ClearFiltersButton.tsx](../src/components/QueryBuilder/ClearFiltersButton.tsx) |
| Row-limit notice | [ApiRowLimitNotice/index.tsx](../src/components/ApiRowLimitNotice/index.tsx) (rendered by parent templates) |

`FilteredResource` template duplicates several: [QueryBuilder.jsx](../src/templates/FilteredResource/QueryBuilder.jsx) (160 LOC) and [QueryRow.jsx](../src/templates/FilteredResource/QueryRow.jsx) shadow the components-level files — see "Filter UIs" below.

## Click-to-fetch flow

1. User edits condition in `FilterDataset` or `QueryBuilder`. Held in local component state until "Apply".
2. Apply handler: `updateQueryForDatastore(conditions)` normalizes values → `setConditions(...)` on `useDatastore` → `setPage(1)` + `setOffset(0)` → `updateBrowserURL(conditions)`.
3. `useDatastore` query key changes → React Query refetches.
4. `is_empty`/`not_empty` rewrites happen inside `useDatastore`'s queryFn ([useDatastore.jsx:49-53](../src/services/useDatastore/useDatastore.jsx)) — never persisted to context or URL.

No "Run query" button. Sort and pagination work the same way: TanStack updates state → query key includes the value → refetch.

## Datatable.jsx

[Datatable.jsx:91-107](../src/components/Datatable/Datatable.jsx) wiring:

- `getCoreRowModel()` + `getSortedRowModel()`.
- `manualSorting: true` — TanStack tracks UI state, server sorts. Parent passes `sortTransform` to convert TanStack sort array to wire format for `useDatastore.setSort`.
- `columnResizeMode: 'onChange'` — live width updates.
- `state` from `DataTableActionsContext`: `columnOrder`, `columnVisibility`, `sorting`. Setters flow back via `onColumnOrderChange`/`onColumnVisibilityChange`/`onSortingChange`.

Rendering:
- `<thead>` = `TruncatedResizeableTHead` if `canResize`, else `FixedSizeTHead`.
- `<tbody>` = `table.getRowModel().rows.map()` — every row renders, no virtualization. Page size cap (default 20, set by `DisplaySettings`) keeps it tractable.
- `<td>` gets `tablePadding` from parent (density mechanism).
- Sort indicator: CSS class (`dc-c-sort--asc`/`--desc`/`--default`) + FA `::after` glyph. `aria-sort` on `<th>`.
- Loading: empty `<tbody>`, separate `<Spinner>` + aria-live region.
- No results: `<Alert>` "No results found for the current filters" + assertive aria-live.

Sticky header: `position: sticky; top: 0` ([datatable.scss](../src/components/Datatable/datatable.scss)).

## DatasetTableTab

[DatasetTableTab/index.tsx](../src/components/DatasetTableTab/index.tsx):

- Reads `distribution`, `resource`, `customColumns` from `DataTableContext`; `page`, `setPage`, `tableDensity` from `DataTableActionsContext`.
- `tableDensity` → `tablePadding`: `compact`→`ds-u-padding-y--1`, `normal`→`ds-u-padding-y--2`, `expanded`→`ds-u-padding-y--3`.
- `downloadURL = ${rootUrl}/datastore/query/${id}/0/download?conditions={...}`.
- Columns via `prepareColumns()` or `buildCustomColHeaders()` (cell renderers by accessor or `mysql_type`).
- `<Pagination>`: `totalPages = Math.ceil(resource.count / limit)`, `onPageChange` calls `setOffset((page-1)*limit)` + `setPage(page)`. `renderHref={(p) => '?page=' + p}` is per-link only — does not write to history.
- `dkan-datatable-fullscreen-mode` class when `isModal=true`.

`DataTableStateWrapper` ([file](../src/components/DatasetTableTab/DataTableStateWrapper.tsx)) mounts `DataTableActionsProvider` around `DatasetTableTab` — public entry point used by `Dataset`.

## DataTableToolbar

[DataTableToolbar/index.tsx](../src/components/DataTableToolbar/index.tsx). Two rows:

- **Top**: page-results text + control buttons (`FilterDataset`, `ManageColumns`, `DisplaySettings`, `FullScreenDataTable`). Each is feature-flagged via `show*` props.
- **Bottom**: active-filter chips (one per condition) + "hidden columns" chip + "Clear all filters".

Two functions:
- `removeCondition(index)` ([line 84-91](../src/components/DataTableToolbar/index.tsx)) — splices condition, updates URL.
- `resetColumnVisibility()` ([line 63-82](../src/components/DataTableToolbar/index.tsx)) — restores all columns, **writes localStorage**.

## ManageColumns

[ManageColumns.jsx](../src/components/ManageColumns/ManageColumns.jsx). Dialog with draggable `<Card>` rows + checkboxes.

- Custom sensors `ExcludeCheckboxPointerSensor` and `ExcludeCheckboxKeyboardSensor` ([line 11-49](../src/components/ManageColumns/ManageColumns.jsx)) prevent drag activation when clicking checkboxes. Don't replace with defaults.
- Local `cards` state mirrors visibility + order, separate from table state. Only Save commits.
- Save (line 156-182): `setColumnVisibility` → `setColumnOrder` → **localStorage write at [line 179](../src/components/ManageColumns/ManageColumns.jsx)**: `localStorage.setItem(id, JSON.stringify({tableColumnOrder, tableColumnVisibility}))`.
- Cancel restores `cards` to initial state.
- "Reset Columns" reorders to default + unhides all.

localStorage key = distribution `id`. Provider reads localStorage once on mount ([DataTableActionsContext.tsx:39](../src/components/DatasetTableTab/DataTableActionsContext.tsx)) — see [data-flow.md](data-flow.md).

## DisplaySettings

[DisplaySettings/index.tsx](../src/components/DisplaySettings/index.tsx). Tooltip-triggered popover:

- Three density buttons (`compact`/`normal`/`expanded`) → `setTableDensity`.
- "Rows per page" dropdown → `setLimit` + `setPage(1)` + `setOffset(0)`.

`tableDensity` not persisted — always seeds as `'normal'` ([DataTableActionsContext.tsx:50](../src/components/DatasetTableTab/DataTableActionsContext.tsx)).

[DataTableDensity/index.jsx](../src/components/DataTableDensity/index.jsx) is unused — DisplaySettings supersedes.

## FullScreenDataTable

[FullScreenDataTable/index.tsx](../src/components/FullScreenDataTable/index.tsx). Toggle button → design-system `<Dialog>` containing fresh `<DatasetTable isModal={true}>`. Early `return null` if `isModal=true` prevents nesting. Escape + backdrop come from `<Dialog>`.

ManageColumns and FilterDataset call `restoreFullscreenDialogScrollLock()` on dialog exit because nested dialogs would otherwise leave scroll locked.

`DatasetTableTab` re-mounts when the toggle opens, but `useDatastore` is **not** re-instantiated — the `useDatastore` call lives in the parent `Dataset` template ([Dataset/index.tsx:92](../src/templates/Dataset/index.tsx)), which doesn't re-mount. The modal reads `resource` from the same `DataTableContext` and shows the same data.

## Filter UIs — three implementations, two in production

| File | LOC | In production? | Used by |
|---|---|---|---|
| [components/FilterDataset/index.tsx](../src/components/FilterDataset/index.tsx) | 317 | yes | [DataTableToolbar:112](../src/components/DataTableToolbar/index.tsx) — modal on Dataset |
| [templates/FilteredResource/QueryBuilder.jsx](../src/templates/FilteredResource/QueryBuilder.jsx) | 160 | yes | [FilteredResourceBody:101](../src/templates/FilteredResource/FilteredResourceBody.jsx) — inline |
| [components/QueryBuilder/index.tsx](../src/components/QueryBuilder/index.tsx) | 217 | **no** | imported but never rendered in [DatasetTableTab:7](../src/components/DatasetTableTab/index.tsx); kept alive by stories/tests |

The components-level `QueryBuilder` looks like an abandoned refactor. Verify usage before editing.

`FilterDataset` is modal; FilteredResource `QueryBuilder` is inline accordion. Filter rows are also separate:

- Modal: [FilterDataset/FilterItem.tsx](../src/components/FilterDataset/FilterItem.tsx) — schema-aware, respects `enableEmptyFilters`.
- Inline: [templates/FilteredResource/QueryRow.jsx](../src/templates/FilteredResource/QueryRow.jsx) — schema-aware, ignores `enableEmptyFilters`.
- Third row file [components/QueryRow/index.tsx](../src/components/QueryRow/index.tsx) — only consumed by the unused QueryBuilder.

`FilterDataset` is the only filter UI that respects `enableEmptyFilters` (passed through `DataTableContext`).

### `updateQueryForDatastore` (duplicated in all three filter files)

[components/QueryBuilder:23-48](../src/components/QueryBuilder/index.tsx), [FilterDataset:15-40](../src/components/FilterDataset/index.tsx), [FilteredResource/QueryBuilder](../src/templates/FilteredResource/QueryBuilder.jsx):

- Strips client-side `key` (React list key).
- `=` and `<>`: strips leading/trailing `%`.
- `like`: wraps value in `%`.
- `in`: comma-separated string → array.

Change one, change all.

### Operator dropdown — `buildOperatorOptions(mysql_type, enableEmptyFilters = false)`

[src/templates/FilteredResource/functions.js](../src/templates/FilteredResource/functions.js):

| `mysql_type` | UI options |
|---|---|
| `text` / `string` | Is, Starts With, Contains, Is Not, Or |
| `date` | Is, Is Not, Greater Than, Less Than |
| anything else | Is, Is Not |

If `enableEmptyFilters=true`: append "Is Empty" / "Not Empty". Only `FilterDataset/FilterItem.tsx` passes this.

`like` and `between` are reachable via stored queries and hand-built URLs — not selectable in the dropdown.

### Condition row inputs

By type: `mysql_type === 'date'` → DatePicker, else TextField.
By operator: `is_empty`/`not_empty` → no value input ([FilterItem.tsx:102-103](../src/components/FilterDataset/FilterItem.tsx)). Otherwise single text/date input.

No special UI for `between` (no two-input range). No chip UI for `in` — user types comma-separated, `updateQueryForDatastore` splits.

Property dropdown: built from `schema[id].fields` populated by `useDatastore` from metastore response ([useDatastore.jsx:102-114](../src/services/useDatastore/useDatastore.jsx)). Label = `field.description` || field name.

### Validation

Only `FilterDataset` validates ([line 164-187](../src/components/FilterDataset/index.tsx)): every condition needs property + operator + (empty-filter operator OR non-empty value).

FilteredResource inline builder only filters out conditions with missing `property`. Empty-value conditions get sent.

### URL sync

`updateBrowserURL(conditions)` uses `qs.stringify` + `window.history.pushState`. Conditions become indexed params: `?conditions[0][property]=ndc1&conditions[0][value]=test&conditions[0][operator]==`. Called on submit and clear in all three implementations. `FilteredResource` parses the same shape on mount via `qs.parse(location.search)`.

### Stored queries

Only via `StoredQueryPage`. Operator translation [StoredQueryPage/index.tsx:30-46](../src/templates/StoredQueryPage/index.tsx): `is`→`=`, `is not`→`<>`, `or`→`in`. Renames `column`→`property`. No other entry point accepts stored-query syntax.

## Pitfalls

- **Manual sort + server sort**. TanStack tracks UI state, server sorts. Don't add client-side sort logic.
- **No virtualization**. Page size cap is the only thing keeping render times tractable.
- **Three copies of `updateQueryForDatastore`** — one is in unused production code (`components/QueryBuilder`). Easy to update the wrong one.
- **`like` and `between` reachable but not selectable**. Wire supports them; dropdown doesn't list them.
- **Full-screen toggle re-mounts `DatasetTableTab` only** — `useDatastore` lives in the parent `Dataset` template and is **not** re-instantiated. The modal reads `resource` from the same `DataTableContext`.
- **Don't replace ManageColumns custom sensors** — checkbox would trigger drag.
- **`requireConditions` accepted but unused** — [useDatastore.jsx:31,70](../src/services/useDatastore/useDatastore.jsx). No template sets it.
- **No `manualFilter` toggle** despite older notes referencing one.
