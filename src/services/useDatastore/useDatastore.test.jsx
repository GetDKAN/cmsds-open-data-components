import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ACAContext } from '../../utilities/ACAContext';
import useDatastore from './useDatastore';

const buildWrapper = (aca = undefined) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }) => (
    <ACAContext.Provider value={{ ACA: aca }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ACAContext.Provider>
  );
};

const mockFetch = (response, { ok = true, status = 200 } = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Bad Request',
    json: () => Promise.resolve(response),
  });
};

const datasetResponse = {
  results: [{ product_name: 'Alpha', quantity: 5 }],
  count: 1,
  schema: {
    'dist-001': {
      fields: {
        product_name: { mysql_type: 'varchar(64)', description: 'Name', type: 'string' },
        quantity: { mysql_type: 'int', description: 'Qty', type: 'integer' },
      },
    },
  },
};

describe('useDatastore', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete window.drupalSettings;
  });

  it('populates values, count, columns, and schema on a successful fetch', async () => {
    mockFetch(datasetResponse);
    const { result } = renderHook(
      () => useDatastore('dist-001', 'https://example.test/api/1', {}),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.count).toBe(1));
    expect(result.current.values).toEqual(datasetResponse.results);
    expect(result.current.columns).toEqual(['product_name', 'quantity']);
    expect(result.current.schema).toEqual(datasetResponse.schema);
    expect(result.current.error).toBeNull();
  });

  it('rewrites is_empty / not_empty operators before sending to the API', async () => {
    mockFetch(datasetResponse);
    renderHook(
      () =>
        useDatastore('dist-001', 'https://example.test/api/1', {
          conditions: [
            { operator: 'is_empty', property: 'product_name', value: 'ignored' },
            { operator: 'not_empty', property: 'quantity', value: 'ignored' },
          ],
        }),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const url = decodeURIComponent(global.fetch.mock.calls[0][0]);
    // is_empty → '=' + empty value; not_empty → '<>' + empty value
    expect(url).toContain('conditions[0][operator]==');
    expect(url).toContain('conditions[1][operator]=<>');
    expect(url).not.toContain('is_empty');
    expect(url).not.toContain('not_empty');
  });

  it('exposes a structured error when fetch returns a non-OK response', async () => {
    mockFetch({ message: 'Bad request' }, { ok: false, status: 400 });
    const { result } = renderHook(
      () => useDatastore('dist-001', 'https://example.test/api/1', {}),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error.status).toBe(400);
    expect(result.current.error.message).toBe('Bad request');
  });

  it('does not fetch when requireConditions is true and conditions are empty', async () => {
    mockFetch(datasetResponse);
    const { result } = renderHook(
      () =>
        useDatastore('dist-001', 'https://example.test/api/1', {
          requireConditions: true,
        }),
      { wrapper: buildWrapper() },
    );
    // The filtered query should not fire. The unfiltered overview query may still run,
    // but it hits a different URL signature — assert no call to the conditions endpoint.
    await new Promise((r) => setTimeout(r, 50));
    const conditionalCalls = global.fetch.mock.calls.filter(
      ([url]) => !url.includes('results=false'),
    );
    expect(conditionalCalls).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });

  it('uses {datasetID}/0 in the URL when drupalSettings.datastore_query_api is true', async () => {
    window.drupalSettings = { datastore_query_api: true };
    mockFetch(datasetResponse);
    renderHook(
      () =>
        useDatastore('dist-001', 'https://example.test/api/1', {}, { datasetID: 'dataset-abc-123' }),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch.mock.calls[0][0]).toContain('/datastore/query/dataset-abc-123/0');
  });
});
