import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { ACAContext } from '../../utilities/ACAContext';
import useSearchAPI from './useSearchAPI';
import { separateFacets } from './helpers';
import { makeSearchResults } from '../../tests/fixtures/generic/makeSearchResults';

jest.mock('axios');
const mockedAxios = axios;

const wrapper = ({ children }) => (
  <ACAContext.Provider value={{ ACA: undefined }}>{children}</ACAContext.Provider>
);

describe('separateFacets', () => {
  it('returns undefined when given undefined input', () => {
    expect(separateFacets(undefined)).toBeUndefined();
  });

  it('groups facets by type', () => {
    const result = separateFacets([
      { type: 'theme', name: 'Sales', total: '2' },
      { type: 'theme', name: 'Inventory', total: '1' },
      { type: 'keyword', name: '2024', total: '5' },
    ]);
    expect(result.theme).toHaveLength(2);
    expect(result.keyword).toHaveLength(1);
  });

  it('sorts numeric keyword facets descending', () => {
    const result = separateFacets([
      { type: 'keyword', name: '2024', total: '5' },
      { type: 'keyword', name: '2026', total: '5' },
      { type: 'keyword', name: '2025', total: '5' },
    ]);
    expect(result.keyword.map((f) => f.name)).toEqual(['2026', '2025', '2024']);
  });
});

describe('useSearchAPI', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
    mockedAxios.get.mockResolvedValue({ data: makeSearchResults() });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('fires a single request after the 1s debounce when fulltext changes', async () => {
    const { result } = renderHook(() => useSearchAPI('https://example.test/api/1'), { wrapper });
    act(() => result.current.setFulltext('widget'));
    expect(mockedAxios.get).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    const url = mockedAxios.get.mock.calls[0][0];
    expect(url).toContain('fulltext=widget');
  });

  it('elides page=1 and page-size=10 from the request params', async () => {
    renderHook(() => useSearchAPI('https://example.test/api/1'), { wrapper });
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    const url = mockedAxios.get.mock.calls[0][0];
    expect(url).not.toContain('page=1');
    expect(url).not.toContain('page-size=10');
  });

  it('serializes selectedFacets arrays with comma format', async () => {
    renderHook(
      () =>
        useSearchAPI('https://example.test/api/1', {
          selectedFacets: { theme: ['Sales', 'Inventory'] },
        }),
      { wrapper },
    );
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    const url = mockedAxios.get.mock.calls[0][0];
    expect(url).toContain('theme=Sales%2CInventory');
  });

  it('resetFilters clears fulltext and selectedFacets', async () => {
    const { result } = renderHook(
      () =>
        useSearchAPI('https://example.test/api/1', {
          selectedFacets: { theme: ['Sales'] },
          fulltext: 'widget',
        }),
      { wrapper },
    );
    act(() => result.current.resetFilters());
    expect(result.current.fulltext).toBe('');
    expect(result.current.selectedFacets).toEqual({});
  });

  it('populates items, facets, and totalItems after a successful fetch', async () => {
    const { result } = renderHook(() => useSearchAPI('https://example.test/api/1'), { wrapper });
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => expect(result.current.totalItems).toBe(3));
    expect(result.current.items).toHaveLength(3);
    expect(result.current.facets).toBeDefined();
  });
});
