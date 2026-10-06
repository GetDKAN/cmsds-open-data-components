import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ACAContext } from '../../utilities/ACAContext';
import ResourceInformation from './index';

jest.mock('axios');
const mockedAxios = axios as unknown as { get: jest.Mock };

const buildWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <ACAContext.Provider value={{ ACA: undefined }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ACAContext.Provider>
  );
};

describe('ResourceInformation', () => {
  beforeEach(() => {
    mockedAxios.get = jest.fn();
  });

  it('renders empty Rows/Columns cells while the query is pending', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // never resolves
    const Wrapper = buildWrapper();
    render(
      <Wrapper>
        <ResourceInformation datasetID="dataset-abc-123" distribution={0} rootUrl="https://example.test" />
      </Wrapper>,
    );
    expect(screen.getByText('Rows')).toBeInTheDocument();
    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('populates the row count and column count once the query resolves', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        count: 1234,
        query: { properties: ['product_name', 'region', 'quantity'] },
      },
    });
    const Wrapper = buildWrapper();
    render(
      <Wrapper>
        <ResourceInformation datasetID="dataset-abc-123" distribution={0} rootUrl="https://example.test" />
      </Wrapper>,
    );
    await waitFor(() => expect(screen.getByText('1,234')).toBeInTheDocument());
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('queries the datastore by dataset ID and distribution index', async () => {
    mockedAxios.get.mockResolvedValue({ data: { count: 1, query: { properties: [] } } });
    const Wrapper = buildWrapper();
    render(
      <Wrapper>
        <ResourceInformation datasetID="dataset-abc-123" distribution={1} rootUrl="https://example.test" />
      </Wrapper>,
    );
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    expect(mockedAxios.get.mock.calls[0][0]).toMatch(
      /^https:\/\/example\.test\/datastore\/query\/dataset-abc-123\/1\?/,
    );
  });
});
