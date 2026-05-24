import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import DatasetListSubmenu from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../DatasetListSubmenuItem', () => ({ title, identifier }: any) => (
  <li data-testid={`item-${identifier}`}>{title}</li>
));

const buildResults = (count: number) => {
  const results: Record<string, any> = {};
  for (let i = 0; i < count; i++) {
    results[`d-${i}`] = { identifier: `d-${i}`, title: `Sample Dataset ${i}` };
  }
  return results;
};

const renderSubmenu = (props: any = {}) =>
  render(
    <MemoryRouter>
      <DatasetListSubmenu rootUrl="https://example.test/api/1" {...props} />
    </MemoryRouter>,
  );

describe('DatasetListSubmenu', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders dataset items returned from the API', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { total: 3, results: buildResults(3) } });
    renderSubmenu();
    await waitFor(() => expect(screen.getByTestId('item-d-0')).toBeInTheDocument());
    expect(screen.getByTestId('item-d-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-d-2')).toBeInTheDocument();
  });

  it('shows the "Viewing X of Y" count', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { total: 12, results: buildResults(4) } });
    renderSubmenu();
    await waitFor(() => expect(screen.getByText(/Viewing 4 of 12/)).toBeInTheDocument());
  });

  it('caps the visible count at defaultPageSize even if more items are returned', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { total: 20, results: buildResults(10) } });
    renderSubmenu({ defaultPageSize: 4 });
    await waitFor(() => expect(screen.getByText(/Viewing 4 of 20/)).toBeInTheDocument());
  });

  it('shows the "No results found" alert when total is zero', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { total: 0, results: {} } });
    renderSubmenu();
    await waitFor(() => expect(screen.getByText('No results found.')).toBeInTheDocument());
  });

  it('renders the "View all" link only when there are results', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { total: 8, results: buildResults(4) } });
    renderSubmenu();
    await waitFor(() => expect(screen.getByRole('link', { name: /View all 8 entries/ })).toBeInTheDocument());
  });
});
