import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { ACAContext } from '../../utilities/ACAContext';
import useMetastoreDataset from './useMetastoreDataset';
import { makeDatasetMetadata } from '../../tests/fixtures/generic/makeDatasetMetadata';

jest.mock('axios');
const mockedAxios = axios;

const buildWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }) => (
    <ACAContext.Provider value={{ ACA: undefined }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ACAContext.Provider>
  );
};

describe('useMetastoreDataset', () => {
  afterEach(() => jest.clearAllMocks());

  it('populates dataset and clears isPending on success', async () => {
    const dataset = makeDatasetMetadata();
    mockedAxios.get.mockResolvedValueOnce({ data: dataset });
    const { result } = renderHook(
      () => useMetastoreDataset('dataset-abc-123', 'https://example.test/api/1'),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.dataset.title).toBe('Sample Sales Dataset'));
    expect(result.current.isPending).toBe(false);
  });

  it('produces an error-shaped dataset on axios rejection', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderHook(
      () => useMetastoreDataset('dataset-abc-123', 'https://example.test/api/1'),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.dataset.error).toBeTruthy());
    expect(result.current.dataset.error.message).toBe('network down');
  });

  it('refetches when setId is called with a new id', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: makeDatasetMetadata({ identifier: 'dataset-abc-123' }) })
      .mockResolvedValueOnce({
        data: makeDatasetMetadata({ identifier: 'dataset-xyz-789', title: 'Other Dataset' }),
      });
    const { result } = renderHook(
      () => useMetastoreDataset('dataset-abc-123', 'https://example.test/api/1'),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.dataset.identifier).toBe('dataset-abc-123'));
    act(() => result.current.setId('dataset-xyz-789'));
    await waitFor(() => expect(result.current.dataset.title).toBe('Other Dataset'));
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('exposes setRootUrl and setId from its return value', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: makeDatasetMetadata() });
    const { result } = renderHook(
      () => useMetastoreDataset('dataset-abc-123', 'https://example.test/api/1'),
      { wrapper: buildWrapper() },
    );
    await waitFor(() => expect(result.current.dataset.title).toBe('Sample Sales Dataset'));
    expect(typeof result.current.setId).toBe('function');
    expect(typeof result.current.setRootUrl).toBe('function');
  });
});
