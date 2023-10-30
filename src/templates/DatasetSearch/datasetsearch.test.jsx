import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetSearch from './index';
import { selectedFacetsMessage } from '../../services/useSearchAPI/helpers';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.useFakeTimers();
const rootUrl = 'http://dkan.com/api/1';
const data_results = {
  data: {
    total: '1',
    results: {
      'dkan_dataset/5d69-frba': { title: 'dkan' },
    },
    facets: [
      {
        type: 'theme',
        name: 'general',
        total: '2',
      },
    ],
  },
};

describe('selectedFacetsMessage', () => {
  test('turns selectedFacets and titles into a string', () => {
    const selectedFacets = { theme: ['dkan'], keyword: ['react'] };
    expect(selectedFacetsMessage(selectedFacets, { theme: 'Categories', keyword: 'Tags' })).toEqual(
      'Categories: dkan & Tags: react'
    );
  });
});

describe('<DatasetSearchFacets />', () => {
  test('Renders correctly', async () => {
    await axios.get.mockImplementation(() => Promise.resolve(data_results));
    const { debug } = render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    await act(async () => {
      // debug()
      jest.useFakeTimers();
    });
    // debug()
    // expect(axios.get).toHaveBeenCalledWith(
    //     `${rootUrl}/search/?`,
    //   );
    // await act(async () => {  });

    expect(screen.getByRole('heading', { name: 'Datasets' }));
    expect(screen.getByRole('textbox', { name: 'Search term' }));
    expect(screen.getByText('Sort by', {selector: 'span'}));
    expect(screen.getByRole('button', { name: 'Search' }));
  });

  test('Announces search results to screen readers', async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    await axios.get.mockImplementation(() => Promise.resolve(data_results));
    await act(async () => {
      // debug()
      jest.useFakeTimers();
      const { debug } = render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    });

    const dataCurrentResultsElement = screen.getByTestId('currentResults');

    expect(dataCurrentResultsElement).toBeInTheDocument();
    expect(dataCurrentResultsElement).toHaveAttribute('role', 'region');
    expect(dataCurrentResultsElement).toHaveAttribute('aria-live');
    expect(['polite', 'assertive']).toContain(dataCurrentResultsElement.getAttribute('aria-live'));

  });
});


