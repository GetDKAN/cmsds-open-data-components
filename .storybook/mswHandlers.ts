import { http, HttpResponse, delay } from 'msw';

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
 * Default empty handlers for MSW initialization.
 * Per-story handlers are configured via parameters.msw.handlers.
 */
export const handlers: ReturnType<typeof http.get>[] = [];
