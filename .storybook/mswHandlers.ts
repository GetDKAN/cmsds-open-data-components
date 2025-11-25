import { http, HttpResponse, delay } from 'msw';

/**
 * MSW (Mock Service Worker) request handlers for Storybook stories.
 * These handlers intercept both fetch and axios HTTP requests.
 */

/**
 * Creates MSW handlers for StoredQueryPage stories
 * Mocks both metastore dataset metadata and datastore query results
 */
export const createStoredQueryPageHandlers = (
  datasetMetadata: any,
  datastoreRecords: any,
  baseUrl: string = 'https://data.cms.gov'
) => [
  // Mock metastore dataset metadata endpoint
  // Use wildcard pattern to match any domain/protocol
  http.get('**/metastore/schemas/dataset/items/:id', async () => {
    await delay(500); // Simulate network latency
    return HttpResponse.json(datasetMetadata);
  }),

  // Mock datastore query endpoint (both filtered and unfiltered)
  // Use wildcard pattern to match any domain/protocol
  http.get('**/datastore/query/:resourceId', async ({ request }) => {
    await delay(500); // Simulate network latency
    const url = new URL(request.url);

    // Check if this is a metadata-only query (results=false)
    const resultsParam = url.searchParams.get('results');
    if (resultsParam === 'false') {
      // Return only count and schema, no results
      return HttpResponse.json({
        count: datastoreRecords.count,
        schema: datastoreRecords.schema,
        results: [],
      });
    }

    // Return full query results
    return HttpResponse.json(datastoreRecords);
  }),
];

/**
 * Creates MSW handlers for DatasetList stories
 * Mocks the search API endpoint
 */
export const createDatasetListHandlers = (
  searchResults: any,
  baseUrl: string = 'https://data.cms.gov'
) => [
  // Use wildcard pattern to match any domain/protocol with trailing slash
  http.get('**/search/*', async ({ request }) => {
    console.log('MSW intercepted DatasetList search:', request.url);
    console.log('MSW returning data:', searchResults);
    console.log('Data has total:', searchResults.total);
    await delay(500); // Simulate network latency
    return HttpResponse.json(searchResults);
  }),
];

/**
 * Default empty handlers (can be overridden per story)
 */
export const handlers = [];
