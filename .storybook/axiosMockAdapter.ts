import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

/**
 * Creates a new MockAdapter instance for intercepting axios requests in Storybook.
 * Includes a 500ms delay to simulate network latency for more realistic stories.
 */
export const createAxiosMock = () => {
  return new MockAdapter(axios, { delayResponse: 500 });
};

/**
 * Sets up mock response for DatasetList /search/ endpoint.
 * Matches any URL containing /search/ and returns the provided mock data.
 *
 * @param mock - MockAdapter instance
 * @param responseData - Mock API response data (should match { total, results } structure)
 */
export const setupDatasetListMock = (mock: MockAdapter, responseData: any) => {
  // Use function matcher to intercept any URL containing /search/
  mock.onGet().reply((config) => {
    if (config.url && config.url.includes('/search/')) {
      return [200, responseData];
    }
    return [404, { error: 'Not mocked' }];
  });
};

/**
 * Sets up mock responses for StoredQueryPage metastore and datastore endpoints.
 * Handles dataset metadata fetching and datastore query results.
 *
 * @param mock - MockAdapter instance
 * @param datasetMetadata - Mock dataset metadata (should include distribution array)
 * @param datastoreRecords - Mock datastore query results (should include results, count, schema)
 */
export const setupStoredQueryPageMock = (
  mock: MockAdapter,
  datasetMetadata: any,
  datastoreRecords: any
) => {
  mock.onGet().reply((config) => {
    const url = config.url || '';

    // Mock metastore dataset metadata endpoint
    if (url.includes('/metastore/schemas/dataset/items/')) {
      return [200, datasetMetadata];
    }

    // Mock datastore query endpoint
    if (url.includes('/datastore/query/')) {
      return [200, datastoreRecords];
    }

    return [404, { error: 'Not mocked' }];
  });
};

/**
 * Resets all mocks on a MockAdapter instance.
 * Call this in story cleanup if needed (though MockAdapter resets between stories automatically).
 *
 * @param mock - MockAdapter instance to reset
 */
export const resetAxiosMock = (mock: MockAdapter) => {
  mock.reset();
};
