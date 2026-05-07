# Consumer integration

For developers of downstream sites using this library. See [architecture.md](architecture.md) for the wider stack.

## Install

```bash
npm install @civicactions/cmsds-open-data-components
```

Required peer deps:
```json
{ "react": "^18.2.0", "react-dom": "^18.2.0", "@cmsgov/design-system": "^12.4.2" }
```

Library brings its own `react-router-dom@^6.8.0`, `@tanstack/react-query@^5.14.1`, `@tanstack/react-table@^8.7.9` (not peer deps). **Consumer must use react-router-dom v6** — the library imports `Link`/`useNavigate`/`useSearchParams`/`useLocation`, which need a single Router instance up the tree.

For local dev with an unreleased version, see the npm-workspaces section in [architecture.md](architecture.md).

## Minimum wrapper

```tsx
import { BrowserRouter } from 'react-router-dom';
import { ACAContext, Dataset, Header, Footer } from '@civicactions/cmsds-open-data-components';
import '@cmsgov/design-system/css/index.css';
import '@cmsgov/design-system/css/core-theme.css';
import '@fortawesome/fontawesome-free/css/all.css';

export default function App() {
  return (
    <ACAContext.Provider value={{ ACA: undefined }}>
      <BrowserRouter>
        <Header>{/* nav, brand */}</Header>
        <Dataset rootUrl="https://api.example.com" id="abc-123" />
        <Footer links={links} />
      </BrowserRouter>
    </ACAContext.Provider>
  );
}
```

- `ACAContext` default is `{ACA: undefined}` — Provider technically optional, but wrap explicitly.
- `Dataset`/`DatasetSearch`/`DatasetList`/`FilteredResource` self-wrap with `withQueryProvider` at default export. No consumer-side `QueryClientProvider` required.
- Templates do not import design-system CSS. Skip the imports → unstyled components.

## Public surface

Only items in [src/index.ts](../src/index.ts) are public.

### Templates

| Export | Renders | `withQueryProvider` wrapped? |
|---|---|---|
| `Dataset` | Tabbed dataset detail (Overview, Data Table, Data Dictionary, API) | yes |
| `DatasetSearch` | Faceted search results | yes |
| `DatasetList` | Simple paginated list | yes |
| `FilteredResource` | Standalone query builder for one distribution | yes |
| `APIPage` | Customized Swagger UI | no |
| `StoredQueryPage` | Saved query against a dataset | no |
| `Header`, `Footer`, `SidebarPage`, `PageNotFound`, `SpecsAndLimits` | Layout chrome | no |

### Components

`DataTable` (renamed from `Datatable`), `DatasetTable` (from `DatasetTableTab`), `DataTableToolbar`, `DataTablePageResults`, `Datatable`, `Hero`, `Breadcrumb`, `TransformedDate`, `SearchInput`, `ErrorBoundary`, `FAQAccordion`, header/nav (`CMSTopNav`, `HeaderNav`, `HeaderNavIconLink`, `HeaderSearch`, `HeaderSiteTitle`, `HeaderTagline`, `MobileMenuButton`, `NavBar`, `SidebarNavigation`, `SubMenu`), dataset cards (`DatasetListItem`, `DatasetSearchListItem`, `DatasetDateItem`, `DatasetDate`, `DatasetListSubmenu`, `DatasetSearchFacets`), resource (`ResourceHeader`, `ResourcePreview`, `ResourceFooter`, `ApiDocumentation`, `ApiRowLimitNotice`).

Named function exports (not classic defaults): `buildRows` (from `DatasetAdditionalInformation`), `truncateText` (from `DatasetSearchListItem/truncateText`).

### Contexts

`ACAContext` (default `{ACA: undefined}`), `HeaderContext`, `DataTableContext`, `DataTableActionsProvider` (provider component, not context object).

### Services / hooks

`useDatastore`, `useMetastoreDataset`, `useSearchAPI`, `useAddLoginLink`, `useScrollToTop`.

### Utilities

`withQueryProvider`, `acaToParams`, `defaultMetadataMapping`, `transformTableSortToQuerySort`, `buildOperatorOptions`, `convertUTCToLocalDate`, `cleanText`, `buildCustomColHeaders`.

## Required props

Data-fetching templates take `rootUrl` (DKAN API base, e.g. `https://api.example.com/api/1`).

| Template | Required | Notable optional (default) |
|---|---|---|
| `Dataset` | `id`, `rootUrl` | `customColumns`, `customMetadataMapping`, `dataDictionaryUrl`, `apiPageUrl` (`/api`), `defaultPageSize` (25), `enableEmptyFilters`, `topicDetails`, `tabHrefPrepend` |
| `DatasetSearch` | `rootUrl` | `pageTitle` (`Dataset Explorer`), `categoriesTitle`, `filterTitle`, `defaultSort` (`{defaultSort:'modified', defaultOrder:'desc'}`), `defaultPageSize` (10), `largeFileThemes`, `dataDictionaryLinks`, `topicSlugFunction` |
| `DatasetList` | `rootUrl` | mostly same as `DatasetSearch` minus facet/search props |
| `FilteredResource` | `id`, `rootUrl` | `dist_id` (`'data'` → first distribution), `customColumns`, `customDescription`, `apiDocPage` |
| `APIPage` | `rootUrl` | `hideAuth` (`true`), `showRowLimitNotice`, `swaggerButtonClassNames` |
| `StoredQueryPage` | `id`, `rootUrl` | `query` (JSON string), `distributionIndex` (0), `customColumns`, `defaultPageSize` (25) |
| `Header` | `children` | `topNav`, `mobileMaxWidth` (768), `onDark` |
| `Footer` | `links` (`{footerOpenDataToolLinks, footerAdditionalResourcesLinks, footerUtilityLinks}`) | `showEmail`, `email{Title,Body,Link,Button}`, `socialMediaLinks`, `hhsLogo`, `cmsLogo`, `trademarkContent` |
| `SidebarPage` | `links`, `menuTitle`, `children` | `mobileMaxWidth` (768) |
| `SpecsAndLimits` | none | `documentationList`, `children` |
| `PageNotFound` | none | `content` |

`npx generate-usage-report` audits which exports your site uses.

## Routing

Hard-coded paths in the library:
- Theme/keyword filter chips → `/datasets?theme[]=...` and `/datasets?keyword[]=...` ([metadataMapping.jsx](../src/assets/metadataMapping.jsx)).
- "Back to dataset" links → `/dataset/:id`.

Match these in your router or override via `customMetadataMapping`. No router-config object exposed.

Library expects a single Router context above any data template — `BrowserRouter`, `HashRouter`, or `MemoryRouter` (for tests) all work.

## ACA token

```tsx
<ACAContext.Provider value={{ ACA: 'some-token' }}>
  <App />
</ACAContext.Provider>
```

`acaToParams` ([src/utilities/aca.ts](../src/utilities/aca.ts)) injects `{ACA, redirect: false}` when `ACA` is truthy. When undefined, neither is added.

Token rotation: update Provider's `value`. In-flight queries pick up the new token on next refetch — they do not abort and re-send.

## `customMetadataMapping`

Shallow-spread *after* `defaultMetadataMapping` ([src/assets/metadataMapping.jsx](../src/assets/metadataMapping.jsx)):

```ts
Record<string, (data: any) => Array<{ label: string; value: ReactNode }>>
```

Override a field by passing a new function. **Spread, not merge — `undefined` does NOT remove**. To hide a field, pass a function returning `[]`:

```tsx
customMetadataMapping={{
  bureauCode: () => [],
  identifier: (data) => [{ label: 'Custom ID', value: data.identifier }],
}}
```

Default fields: `modified`, `issued`, `accrualPeriodicity`, `publisher`, `identifier`, `contactPoint`, `bureauCode`, `programCode`, `theme`, `keyword`, `license`, `accessLevel`, `temporal`, `spatial`, `references`.

## Surface-level display props (e.g. date format)

Display props that vary per surface — like `updateDateMonthYearOnly` (date format), `showDateDetails`, `showTopics` — flow through the **templates** (`Dataset`, `DatasetSearch`) into list-item components like `DatasetSearchListItem`, which in turn render `TransformedDate`. They do **not** flow through the shared `DatasetDate`/`DatasetDateItem` primitives — those don't read these props.

When adding a new display flag, plumb it through the template props and into the list-item, not through `DatasetDate*`. See PR #379 (`updateDateMonthYearOnly`) as the canonical pattern.

## `customColumns`

Two shapes:

1. **Sparse override** — `Array<{accessor, header, cell?}>` for some columns; schema fills the rest. Used by `Dataset`, `FilteredResource`, `StoredQueryPage`.
2. **Full column definition** — every element has `header`. Schema not consulted. Detected by `isFullColumnDef` ([DatasetTableTab/index.tsx:71](../src/components/DatasetTableTab/index.tsx)).

`buildCustomColHeaders` is exported for explicit merge logic.

## Styling

Mandatory imports:
```ts
import '@cmsgov/design-system/css/index.css';
import '@cmsgov/design-system/css/core-theme.css';
```

No standalone `dist/main.css`. Component styles bundle into the JS module via Parcel.

### Font Awesome

Source uses some Pro classes (`fa-file-xls`, `far`/`fal`/`fad`). Storybook's `FontAwesomeProToFree` decorator does NOT run in consumer sites. Options:
1. Load `@fortawesome/fontawesome-pro` (license required), or
2. Load `@fortawesome/fontawesome-free` — small number of Pro-only icons may render incorrectly.

## React Query

Six exports self-wrap with `withQueryProvider` (module-scoped `QueryClient`):
- Templates: `Dataset`, `DatasetSearch`, `DatasetList`, `FilteredResource`.
- Components: `DatasetListSubmenu` (publicly exported, calls a query hook), `DatasetDataDictionaryTab` (internal).

Consumer's own `QueryClientProvider` does not share with the library — two clients in memory. No API to inject a custom client.

Direct calls to `useDatastore`/`useMetastoreDataset`/`useSearchAPI` outside a wrapped export need their own `withQueryProvider` or `QueryClientProvider`.

## Drupal switch

`useDatastore` reads `window.drupalSettings.datastore_query_api === true` ([useDatastore.jsx:43](../src/services/useDatastore/useDatastore.jsx)):
- `false`/undefined → `/datastore/query/{resourceId}` (default outside Drupal).
- `true` → `/datastore/query/{datasetID}/0` (DKAN newer routing).

No opt-out needed for non-Drupal hosts.

## `generate-usage-report` CLI

[package.json:bin](../package.json) → [scripts/generate-usage-report.cjs](../scripts/generate-usage-report.cjs).

```bash
npx generate-usage-report                  # → ./COMPONENT_USAGE_REPORT.md
npx generate-usage-report custom-name.md   # → ./custom-name.md
```

Scans `src`, `app`, `pages`, `components`, `templates` for `@civicactions/cmsds-open-data-components` imports, cross-references `dist/index.d.ts` of installed package. Reports: imported exports + locations, unused exports, frequency, category breakdown. Local read only — no network.

## Gotchas

- **One Router**: a second router up the tree breaks navigation silently.
- **`useMetastoreDataset` swallows errors** into `dataset.error`. Check before trusting other fields.
- **`customMetadataMapping` is additive**: `undefined` keeps the default. Hide via `() => []`.
- **Two QueryClients** if consumer also wraps with `QueryClientProvider`. Benign, doubles memory.
- **Hard-coded routes** `/datasets`, `/dataset/:id`. Match or override.
- **APIPage uses Pro FA classes** for row-limit notice + copy buttons. Free fallback may render incorrectly.
- **CSS load order**: design-system CSS must come before consumer overrides.
- **Local-dev version drift**: consumer lockfile must match this repo's `package.json` version, or imports resolve to the published copy.

## Reference

No public minimal-example app. Closest worked example: Storybook decorators in [DatasetList.stories.tsx](../src/templates/DatasetList/DatasetList.stories.tsx).
