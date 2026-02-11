import { http, HttpResponse, delay } from 'msw';
import qs from 'qs';
import {
  mockDatasetItem,
  mockDatasetItemDocs,
  mockDatasetItemDataDictionary,
  mockDatasetItemDistribution1,
  mockDatasetItemDistribution2,
  mockDatasetItemResults,
  mockDatasetItemSchema,
} from '../__mocks__/mockDatasetItem';

/**
 * Condition parsed from the datastore query string (e.g. conditions[0][property]=npn).
 * value is a string for most operators; for "in" (or) it may be an array or qs object like { 0: '1', 1: '2' }.
 */
interface QueryCondition {
  property?: string;
  value?: string | string[];
  operator?: string;
}

/**
 * Filter mock rows by applying all conditions with AND logic.
 * Used so the "Filter Dataset" UI in Storybook returns in-memory filtered results from the 100-row mock.
 *
 * conditions: from qs.parse of the request URL; may be an array or object with numeric keys (e.g. { '0': {...}, '1': {...} }).
 * Operators: = (is), starts with, contains, <> (is not), in (or). Unknown operators are treated as match-all.
 */
function filterResultsByConditions(
  results: Record<string, unknown>[],
  conditions: QueryCondition[] | Record<string, QueryCondition> | undefined
): Record<string, unknown>[] {
  // Convert to a sorted array of condition objects; qs may return { '0': {...}, '1': {...} }, so we sort keys and take values
  const normalized: QueryCondition[] = !conditions
    ? []
    : Array.isArray(conditions)
    ? conditions.filter((c) => c && c.property != null)
    : Object.keys(conditions)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => (conditions as Record<string, QueryCondition>)[k])
        .filter((c) => c && c.property != null);
  if (normalized.length === 0) return results;

  return results.filter((row) => {
    return normalized.every((cond) => {
      const prop = cond.property;
      const op = (cond.operator || '=').toLowerCase();
      let val = cond.value;
      if (prop == null) return true;
      const cell = row[prop];
      const cellStr = cell != null ? String(cell) : '';
      // qs can parse "in" values as object { 0: '1', 1: '2' }; treat as array of values
      if (val != null && !Array.isArray(val) && typeof val === 'object') {
        val = Object.values(val) as string[];
      }
      const valStr = Array.isArray(val)
        ? val.map((v) => String(v).trim())
        : String(val ?? '').trim();

      if (op === '=' || op === 'is') {
        return cellStr === (Array.isArray(valStr) ? valStr[0] : valStr);
      }
      if (op === '<>' || op === 'is not') {
        return cellStr !== (Array.isArray(valStr) ? valStr[0] : valStr);
      }
      if (op === 'starts with') {
        const v = Array.isArray(valStr) ? valStr[0] : valStr;
        return cellStr.toLowerCase().startsWith(v.toLowerCase());
      }
      if (op === 'contains') {
        const v = Array.isArray(valStr) ? valStr[0] : valStr;
        return cellStr.toLowerCase().includes(v.toLowerCase());
      }
      if (op === 'in') {
        const arr = Array.isArray(valStr) ? valStr : [valStr];
        return arr.some((v) => cellStr === v || cellStr.toLowerCase() === v.toLowerCase());
      }
      return true;
    });
  });
}

/**
 * MSW (Mock Service Worker) request handlers for Storybook stories.
 * These handlers intercept both fetch and axios HTTP requests.
 */

interface Distribution {
  identifier: string;
  data: {
    downloadURL: string;
    format: string;
    title: string;
  };
}

interface DatasetMetadata {
  identifier: string;
  title: string;
  description?: string;
  modified?: string;
  distribution: Distribution[];
}

interface DatastoreRecords {
  results: Record<string, unknown>[];
  count: number;
  schema: Record<string, Record<string, unknown>>;
}

interface SearchResults {
  total: number;
  results: Record<string, unknown>;
}

/**
 * Creates MSW handlers for StoredQueryPage stories.
 * Mocks both metastore dataset metadata and datastore query results.
 */
export const createStoredQueryPageHandlers = (
  datasetMetadata: DatasetMetadata,
  datastoreRecords: DatastoreRecords
) => [
  // Mock metastore dataset metadata endpoint
  http.get('**/metastore/schemas/dataset/items/:id', async () => {
    await delay(500);
    return HttpResponse.json(datasetMetadata);
  }),

  // Mock datastore query endpoint (both filtered and unfiltered)
  http.get('**/datastore/query/:resourceId', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);

    // Check if this is a metadata-only query (results=false)
    const resultsParam = url.searchParams.get('results');
    if (resultsParam === 'false') {
      return HttpResponse.json({
        count: datastoreRecords.count,
        schema: datastoreRecords.schema,
        results: [],
      });
    }

    return HttpResponse.json(datastoreRecords);
  }),
];

/**
 * Creates MSW handlers for DatasetList stories.
 * Mocks the search API endpoint.
 */
export const createDatasetListHandlers = (searchResults: SearchResults) => [
  http.get('**/search/*', async () => {
    await delay(500);
    return HttpResponse.json(searchResults);
  }),
];

/**
 * Creates MSW handlers for Dataset template stories.
 * Mocks metastore (dataset + docs + data-dictionary) and datastore (query) endpoints
 * using mocks from __mocks__/mockDatasetItem.js.
 */
export const createDatasetPageHandlers = () => [
  // Dataset docs: /api/1/metastore/schemas/dataset/items/wb6u-x2ny/docs (more specific first)
  http.get('**/metastore/schemas/dataset/items/wb6u-x2ny/docs', async () => {
    await delay(300);
    return HttpResponse.json(mockDatasetItemDocs);
  }),

  // Dataset metadata: /api/1/metastore/schemas/dataset/items/wb6u-x2ny?show-reference-ids
  http.get('**/metastore/schemas/dataset/items/wb6u-x2ny', async () => {
    await delay(300);
    return HttpResponse.json(mockDatasetItem);
  }),

  // Data dictionary: /api/1/metastore/schemas/data-dictionary/items/22ad17f4-1b4d-4382-b940-79bddc8bb610
  http.get(
    '**/metastore/schemas/data-dictionary/items/22ad17f4-1b4d-4382-b940-79bddc8bb610',
    async () => {
      await delay(300);
      return HttpResponse.json(mockDatasetItemDataDictionary);
    }
  ),

  // Datastore query for resource 479a03e6-ccf1-5636-9fd3-cad48c11177d (distribution 1)
  http.get('**/datastore/query/479a03e6-ccf1-5636-9fd3-cad48c11177d', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const resultsParam = url.searchParams.get('results');
    const schema = url.searchParams.get('schema');
    const count = url.searchParams.get('count');
    const keys = url.searchParams.get('keys');
    // Parse limit (1–100, default 25) and offset (≥0) for pagination; slice mock results accordingly
    const limit = Math.min(
      100,
      Math.max(1, parseInt(url.searchParams.get('limit') ?? '25', 10) || 25)
    );
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);
    // Parse conditions from query string (e.g. conditions[0][property]=npn&conditions[0][value]=214&conditions[0][operator]=contains).
    // qs yields conditions as array or object with numeric keys; filterResultsByConditions accepts both.
    const params = qs.parse(url.search, { ignoreQueryPrefix: true });
    const rawConditions = params.conditions as
      | QueryCondition[]
      | Record<string, QueryCondition>
      | undefined;

    // Metadata-only: distribution count/query info (no rows, no schema)
    if (resultsParam === 'false' && schema === 'false') {
      return HttpResponse.json(mockDatasetItemDistribution1);
    }
    // Unfiltered metadata: total count + schema for overview/column counts
    if (resultsParam === 'false' && count === 'true' && schema === 'true') {
      return HttpResponse.json(mockDatasetItemSchema);
    }
    // Data request: filter mock rows by conditions (is, starts with, contains, is not, in), then paginate
    if (keys === 'true' || (resultsParam !== 'false' && schema !== 'false')) {
      const sourceResults = filterResultsByConditions(
        mockDatasetItemResults.results as Record<string, unknown>[],
        rawConditions
      );
      const totalCount = sourceResults.length;
      const slicedResults = sourceResults.slice(offset, offset + limit);
      return HttpResponse.json({
        ...mockDatasetItemResults,
        results: slicedResults,
        count: totalCount,
        query: {
          ...mockDatasetItemResults.query,
          limit,
          offset,
        },
      });
    }
    // Fallback: filter by conditions (if any), then slice; count is filtered total so pagination is correct
    const sourceResults = filterResultsByConditions(
      mockDatasetItemResults.results as Record<string, unknown>[],
      rawConditions
    );
    const totalCount = sourceResults.length;
    const slicedResults = sourceResults.slice(offset, offset + limit);
    return HttpResponse.json({
      ...mockDatasetItemResults,
      results: slicedResults,
      count: totalCount,
      query: {
        ...mockDatasetItemResults.query,
        limit,
        offset,
      },
    });
  }),

  // Datastore query for resource 8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b (distribution 2)
  http.get('**/datastore/query/8219e5c2-8fa6-5024-b5cd-bcd4e3858e7b', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const results = url.searchParams.get('results');
    const schema = url.searchParams.get('schema');

    if (results === 'false' && schema === 'false') {
      return HttpResponse.json(mockDatasetItemDistribution2);
    }
    return HttpResponse.json({
      ...mockDatasetItemResults,
      count: mockDatasetItemDistribution2.count,
      schema: {},
      results: [],
    });
  }),
];

/**
 * Creates MSW handlers for APIPage stories.
 * Mocks the OpenAPI specification endpoint for Swagger UI.
 * Returns spec with or without auth based on the authentication query param.
 */
export const createAPIPageHandlers = (openAPISpec: object, openAPISpecWithAuth?: object) => [
  http.get('**/openapi.json', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const authParam = url.searchParams.get('authentication');
    // When hideAuth=true, component sends authentication=false
    // When hideAuth=false, authentication param is not sent
    if (authParam === 'false') {
      return HttpResponse.json(openAPISpec);
    }
    return HttpResponse.json(openAPISpecWithAuth ?? openAPISpec);
  }),
];

/**
 * Default empty handlers for MSW initialization.
 * Per-story handlers are configured via parameters.msw.handlers.
 */
export const handlers: ReturnType<typeof http.get>[] = [];
