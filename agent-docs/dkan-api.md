# DKAN API reference

HTTP contract this library expects. Endpoints, query parameters, response shapes, condition operator vocabulary. Cross-reference for [data-flow.md](data-flow.md) (client-side plumbing).

Reverse-engineered from: library services/templates, [.storybook/mswHandlers.ts](../.storybook/mswHandlers.ts), [__mocks__/](../__mocks__/), [src/tests/fixtures/](../src/tests/fixtures/). Not sourced from DKAN's own docs. Behavior not exercised by this library is out-of-scope.

All endpoints under a configurable `rootUrl` (e.g. `https://example.org/api/1`). Paths below omit the prefix.

## Endpoint summary

| Endpoint | Method | Purpose | Driven by |
|---|---|---|---|
| `/metastore/schemas/dataset/items/{id}` | GET | Dataset metadata + distributions | `useMetastoreDataset` |
| `/metastore/schemas/dataset/items/{id}/docs` | GET | Per-dataset OpenAPI spec | MSW only (link target, not fetched as JSON) |
| `/metastore/schemas/data-dictionary/items/{id}` | GET | Data dictionary fields | `getDataDictionary` (Dataset template) |
| `/datastore/query/{resourceId}` | GET | Rows + schema for a distribution | `useDatastore` |
| `/datastore/query/{datasetID}/0` | GET | Same payload, dataset-API form | `useDatastore` when `window.drupalSettings.datastore_query_api === true` |
| `/search/` | GET | Faceted dataset search | `useSearchAPI` |
| `/openapi.json` | GET | Full API spec | `APIPage` (Swagger UI) |

All requests pass through `acaToParams` — see [data-flow.md § ACA injection](data-flow.md#aca-injection).

## Metastore — dataset metadata

### `GET /metastore/schemas/dataset/items/{id}?show-reference-ids`

Returns DCAT-shaped dataset record. `show-reference-ids` includes `%Ref:*` fields (see [Reference fields](#reference-fields-ref)).

Service: `useMetastoreDataset` ([useMetastoreDataset.tsx:25](../src/services/useMetastoreDataset/useMetastoreDataset.tsx)).

Canonical example (abbreviated, [__mocks__/mockDatasetItem.js](../__mocks__/mockDatasetItem.js)):
```json
{
  "@type": "dcat:Dataset",
  "title": "...",
  "identifier": "wb6u-x2ny",
  "description": "<HTML; sanitized client-side via DOMPurify>",
  "accessLevel": "public",
  "accrualPeriodicity": "R/P10Y",
  "issued":   "2016-03-30T14:54:00+00:00",
  "modified": "2026-02-10T13:47:00+00:00",
  "license":  "https://...",
  "publisher":    { "identifier": "...", "data": { ... } },
  "contactPoint": { "fn": "...", "hasEmail": "mailto:..." },
  "keyword":  [{ "identifier": "...", "data": "healthcare" }],
  "theme":    [{ "identifier": "...", "data": "..." }],
  "distribution": [
    {
      "identifier": "479a03e6-...",
      "data": {
        "@type": "dcat:Distribution",
        "title": "...",
        "format": "csv",
        "mediaType": "text/csv",
        "downloadURL":     "https://.../TBL.csv",
        "describedBy":     "https://.../data-dictionary/items/...",
        "describedByType": "application/vnd.tableschema+json",
        "%Ref:downloadURL": [ /* see Reference fields */ ]
      }
    }
  ],
  "bureauCode":  ["009:38"],
  "programCode": ["009:000"]
}
```

Library reads: `title`, `description`, `identifier`, `modified`, `issued`, `released`, `nextUpdateDate`, `theme[]`, `keyword[]`, `distribution[]`, `accrualPeriodicity`, `publisher`, `contactPoint`, `bureauCode`, `programCode`, `license`, `accessLevel`, `temporal`, `spatial`, `references`, `describedBy`, `describedByType`. Mapping in [src/assets/metadataMapping.jsx](../src/assets/metadataMapping.jsx); overridable per-key via `customMetadataMapping`.

### `GET /metastore/schemas/dataset/items/{id}/docs`

MSW only ([mswHandlers.ts:168](../.storybook/mswHandlers.ts)). The Dataset template plumbs this URL as a link target (`apiPageUrl`/`docsURL`); doesn't fetch as JSON inside the library.

### `GET /metastore/schemas/data-dictionary/items/{id}`

Field-level documentation for a distribution. Fetched by `getDataDictionary` ([Dataset/index.tsx:27](../src/templates/Dataset/index.tsx)) when `dataDictionaryUrl` is provided (caller-supplied URL).

Response (from [src/tests/fixtures/dataDictionary.json](../src/tests/fixtures/dataDictionary.json) and [DatasetDictionaryType](../src/types/dataset.ts)):
```json
{
  "identifier": "...",
  "title": "Field descriptions",
  "data": {
    "fields": [
      { "name": "field_name", "title": "...", "description": "...", "type": "string", "format": "default" }
    ]
  }
}
```

**Note**: data-dictionary's `data.fields` is an **array**. Datastore's `schema[resourceId].fields` is an **object** keyed by field name. Different shapes for "field metadata" depending on endpoint.

## Datastore — rows and schema

### `GET /datastore/query/{resourceId}`

Most-hit endpoint. Returns rows + count + schema in any combination, controlled by query params.

Service: `useDatastore` ([useDatastore.jsx:78–99](../src/services/useDatastore/useDatastore.jsx)). `{resourceId}` is the **distribution identifier**. With dataset-API switch active, path becomes `{datasetID}/0` — see [data-flow.md § operator-rewrites-and-the-dataset-api-switch](data-flow.md#operator-rewrites--dataset-api-switch).

### Query parameters

| Param | Type | Purpose |
|---|---|---|
| `keys` | boolean | Default `true`. Returns rows as `{field: value}` objects vs positional arrays. |
| `limit` | int | Rows per page. Hook default 20; `Dataset` template default 25 (`defaultPageSize` prop). Library doesn't enforce a max; backend may. |
| `offset` | int | Pagination offset. Default 0. |
| `conditions` | array | Filter conditions. Serialized: `conditions[0][property]=npn&conditions[0][value]=214&conditions[0][operator]=contains`. |
| `sorts` | array | `{property, order: 'asc'\|'desc'}`. **Plural key** — set via singular `sort` to the hook. |
| `properties` | array | Column projection. Limits returned fields. |
| `groupings` | array/object | Group-by spec. Forwarded as-is; not test-exercised. |
| `results` | boolean | When `false`, rows omitted. Used with `count`/`schema` for metadata-only calls. |
| `count` | boolean | Return `count` in response. |
| `schema` | boolean | Return `schema` in response. |
| `ACA` | string | Auth token (via `acaToParams`). |
| `redirect` | boolean | Always `false` when `ACA` present. Forces no 30x. |

Two parameter combinations from the same hook (dual query — see [data-flow.md](data-flow.md)):
- **Filtered rows**: full param set with `conditions`, `sorts`, etc.
- **Unfiltered overview**: only `results=false&count=true&schema=true`. Populates Overview tab counts independent of filters.

### Response shapes

Default (rows + count + schema):
```json
{
  "results": [{ "field1": "v1", "field2": "v2" }],
  "count": 100,
  "schema": {
    "<resourceId>": {
      "fields": {
        "field1": { "type": "string",  "mysql_type": "text", "description": "..." },
        "field2": { "type": "integer", "mysql_type": "int",  "description": "..." }
      }
    }
  },
  "query": { "limit": 25, "offset": 0, "results": true, "schema": true, "count": true, "keys": true }
}
```

Variants:
- Rows-only (`schema=false`): `{ results, count, query }`
- Metadata-only (`results=false&count=true&schema=true`): `{ count, schema, results: [], query }`
- Distribution-info-only (`results=false&schema=false`): `{ count, query }`

The `<resourceId>` key inside `schema` matches the URL path component. With dataset-API switch active, the schema key changes accordingly — code reading `schema[id]` must use the same id it queried with.

### Schema field shape

`schema[resourceId].fields[fieldName]`:
```ts
{
  type:        string,   // "string", "integer", "number", "varchar", …
  mysql_type:  string,   // "text", "varchar(10)", "int", "decimal(12,2)", "date", …
  description: string,   // human-readable; column header by default
}
```

`mysql_type` determines filter input control + operator list — see [mysql_type → operator mapping](#mysql_type--operator-mapping). Type def: [SchemaType in src/types/dataset.ts](../src/types/dataset.ts).

## Condition vocabulary

`conditions[]` entries: `{ property, operator, value }` + optional UI-only `key`. Several operator strings; not all reach the wire.

### Wire-level operators

| Operator | UI label | Value | Notes |
|---|---|---|---|
| `=` | Is | string | Pre-strip leading/trailing `%`. |
| `<>` | Is Not | string | Pre-strip leading/trailing `%`. |
| `starts with` | Starts With | string | Case-insensitive prefix. |
| `contains` | Contains | string | Case-insensitive substring. |
| `in` | Or | array of strings | Comma-separated input split into array. |
| `>` | Greater Than | string (date) | Date fields only. |
| `<` | Less Than | string (date) | Date fields only. |
| `like` | (none) | string | Value re-wrapped as `%value%` before sending. **Not in `buildOperatorOptions`** — appears via stored queries, URL conditions, custom column configs. Honored by both `QueryBuilder` and `FilterDataset`: [QueryBuilder/index.tsx:32](../src/components/QueryBuilder/index.tsx), [FilterDataset/index.tsx:24](../src/components/FilterDataset/index.tsx). |

Operator labels/values: `operatorMapping` and `buildOperatorOptions` in [src/templates/FilteredResource/functions.js](../src/templates/FilteredResource/functions.js).

### UI-only operators

Translated by `useDatastore` ([useDatastore.jsx:49–53](../src/services/useDatastore/useDatastore.jsx)):

| UI operator | Sent as |
|---|---|
| `is_empty` | `{ operator: '=',  value: '' }` |
| `not_empty` | `{ operator: '<>', value: '' }` |

Only operators the service rewrites. Other transforms (LIKE wildcards, IN array splitting, `%`-padding cleanup) live in `updateQueryForDatastore` ([QueryBuilder/index.tsx:23](../src/components/QueryBuilder/index.tsx), [FilterDataset/index.tsx:15](../src/components/FilterDataset/index.tsx)) — fire on user submit, before `setConditions`. **Three near-identical implementations diverge** — change one, change all.

### Stored-query operators

`StoredQueryPage` accepts JSON-stringified `query` prop. Operator translation [StoredQueryPage/index.tsx:30–46](../src/templates/StoredQueryPage/index.tsx):

| Stored op | API op |
|---|---|
| `is` | `=` |
| `is not` | `<>` |
| `or` | `in` |
| anything else | passthrough |

Stored entries also use `column` (not `property`) — renamed during parse.

Example:
```json
[ { "column": "state", "operator": "is", "value": "CA" } ]
```

## `mysql_type` → operator mapping

`buildOperatorOptions(mysql_type, enableEmptyFilters)` ([functions.js:69–102](../src/templates/FilteredResource/functions.js)):

| `mysql_type` (or fallback) | Available operators | Input |
|---|---|---|
| `text`, `string` | Is, Starts With, Contains, Is Not, Or [, Is Empty, Not Empty] | TextField |
| `date` | Is, Is Not, Greater Than, Less Than [, Is Empty, Not Empty] | DatePicker (`react-datepicker`, ISO `YYYY-MM-DD`) |
| else (incl. `varchar(*)`, `int`, `decimal(*,*)`) | Is, Is Not [, Is Empty, Not Empty] | TextField |

`Is Empty`/`Not Empty` only with `enableEmptyFilters=true` (set on `DataTableContext`).

Date inputs convert via `convertUTCToLocalDate` ([functions.js:32](../src/templates/FilteredResource/functions.js)) to avoid timezone shifts at midnight, then `date.toJSON().slice(0, 10)`.

## Search

### `GET /search/`

Datasets matching fulltext + theme/keyword facets, plus flat facet list. Service: `useSearchAPI` via `fetchDatasets` ([helpers.ts:46](../src/services/useSearchAPI/helpers.ts)). 1s debounce on every dep change including pagination.

### Query parameters

| Param | Type | Notes |
|---|---|---|
| `fulltext` | string | Omitted if falsy. Validated via `isValidSearch()` regex (alphanumeric + spaces). |
| `theme` | string\|string[] | From `selectedFacets.theme`. Comma-style (`theme=a,b`). |
| `keyword` | string\|string[] | From `selectedFacets.keyword`. Comma-style. |
| `sort` | string | `"modified"` or `"title"`. Omitted if falsy. |
| `sort-order` | string | `"asc"` or `"desc"`. Omitted if falsy. |
| `page` | int (1-indexed) | **Omitted when `=== 1`** — backend default. |
| `page-size` | int | **Omitted when `=== 10`** — backend default. |
| `ACA`/`redirect` | (auth) | Same as datastore. |

Serialization: `qs.stringify(params, { arrayFormat: 'comma', encode: false })`. Don't change either flag — backend expects unencoded comma lists.

### Response shape

```json
{
  "total": 25,
  "results": {
    "<dataset-identifier>": {
      "identifier":  "<dataset-identifier>",
      "title":       "...",
      "description": "...",
      "modified":    "2024-03-15T14:30:00",
      "theme":       ["Medicare"],
      "%Ref:distribution": [
        {
          "identifier": "<distribution-id>",
          "data": {
            "title": "CSV Download",
            "format": "csv",
            "downloadURL":     "https://…",
            "describedBy":     "https://…",
            "describedByType": "application/vnd.tableschema+json"
          }
        }
      ]
    }
  },
  "facets": [
    { "type": "theme",   "name": "Medicare", "total": "12" },
    { "type": "keyword", "name": "2024",     "total": "10" }
  ]
}
```

Two notes:
1. `results` is an **object** keyed by dataset identifier, not an array. Hook converts to array client-side ([useSearchAPI.jsx:62](../src/services/useSearchAPI/useSearchAPI.jsx)).
2. Distributions arrive under `%Ref:distribution`, **not** `distribution` and **not** `%Ref:downloadURL`. Different from metastore endpoint.

### Facets

`facets[]` is flat with `type` discriminating theme vs keyword. Client groups via `separateFacets()` ([helpers.ts:8](../src/services/useSearchAPI/helpers.ts)). Numeric `keyword` facets (e.g. years) sorted numerically descending; non-numeric have no explicit sort.

## OpenAPI

### `GET /openapi.json`

Powers `APIPage`'s Swagger UI. Library doesn't parse the spec — builds a URL and hands it to `swagger-ui-react`. Plugin in [src/utilities/ApiDocsSwaggerUIPlugin/](../src/utilities/ApiDocsSwaggerUIPlugin/) overrides Swagger UI components but doesn't touch spec format.

| Param | Notes |
|---|---|
| `authentication` | Library sends `authentication=false` when `hideAuth={true}` (the default). Pass `hideAuth={false}` to omit (Swagger gets unfiltered spec). |

OpenAPI 3.x. Example: [__mocks__/mockOpenAPISpec.ts](../__mocks__/mockOpenAPISpec.ts).

## Reference fields (`%Ref:*`)

When `show-reference-ids` is set (or backend always includes), responses carry `%Ref:`-prefixed fields resolving linked resources inline.

### `%Ref:downloadURL` — metastore distribution

Inside `dataset.distribution[].data` from metastore. Shape ([__mocks__/mockDatasetItem.js](../__mocks__/mockDatasetItem.js)):
```json
"%Ref:downloadURL": [
  {
    "identifier": "d4dd97900...",
    "data": {
      "filePath":    "https://h-o.st/.../TBL.csv",
      "identifier":  "d4dd97900...",
      "mimeType":    "text/csv",
      "perspective": "source",
      "version":     "1770731333",
      "checksum":    null
    }
  }
]
```

Read by [src/utilities/format.ts](../src/utilities/format.ts) as fallback when `format` and `mediaType` are absent: pulls `mimeType` from first reference, splits on `/`, lower-cased subtype.

### `%Ref:distribution` — search results

Inside each dataset in `/search/` results. Shape ([__mocks__/mockDatasetSearchResults.js](../__mocks__/mockDatasetSearchResults.js)):
```json
"%Ref:distribution": [
  {
    "identifier": "<distribution-id>",
    "data": {
      "title":           "CSV Download",
      "format":          "csv",
      "downloadURL":     "https://…",
      "describedBy":     "https://…",
      "describedByType": "application/vnd.tableschema+json"
    }
  }
]
```

**Strictly smaller** than metastore distribution (no `description`, `mediaType`, `mimeType`, no `%Ref:downloadURL` recursion). Don't pass a search result through code expecting metastore distribution.

### `%modified` — ignored

Metastore mock includes top-level `"%modified"` (different format than `modified`). Not consumed by library.

## Distribution data shape (metastore)

[src/types/dataset.ts](../src/types/dataset.ts):
```ts
type DistributionDataType = {
  downloadURL:        string,
  format:             string,    // "csv", "json", "pdf" — lower-case
  title:              string,
  description:        string,
  describedBy:        string,    // URL to data dictionary
  describedByType:    string,    // typically "application/vnd.tableschema+json"
  mediaType:          string,    // "text/csv"
  mimeType:           string,
  "%Ref:downloadURL": DistributionType[]
}

type DistributionType = {
  identifier: string,
  data:       DistributionDataType
}
```

Format detection (`getFormatType` in [src/utilities/format.ts](../src/utilities/format.ts)): tries `data.format` → `data.mediaType` (split on `/`) → `data["%Ref:downloadURL"][0].data.mimeType` (split on `/`).

## Stored query format

`StoredQueryPage`'s `query` prop is JSON-stringified:
```ts
type StoredQueryEntry = {
  column:   string,                                       // → renamed to property
  operator: 'is' | 'is not' | 'or' | string,              // → '=' | '<>' | 'in' | passthrough
  value:    string | string[]
}
```

Parsed at [StoredQueryPage/index.tsx:30–46](../src/templates/StoredQueryPage/index.tsx). After parsing, conditions go straight to `useDatastore` via `options.conditions`. The `useDatastore` operator-rewrite rules (`is_empty`/`not_empty`) still apply but stored queries don't typically use those.

## Errors

No unified error model.

| Service | Behavior |
|---|---|
| `useMetastoreDataset` | `.catch` swallows into `dataset.error`, preserves prior shape. Templates render `<PageNotFound>` when truthy. |
| `useDatastore` | No catch. React Query error state. `data` undefined, `loading` false. Distinguish "never loaded" via `count === null`. |
| `useSearchAPI` | No catch. Axios errors propagate. `loading` flips false on next dep change. |

Library doesn't interpret HTTP status codes. 404 ≡ network error. No `Retry-After` honors, no error-message extraction. Wrap services or add interceptor at consumer level for richer error UX.
