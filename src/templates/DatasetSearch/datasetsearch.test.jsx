import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
    expect(screen.getByRole('combobox', { name: 'Sort by' }));
    expect(screen.getByRole('button', { name: 'Search' }));
  });

  test.skip('Announces search results to screen readers', async () => {
    await axios.get.mockImplementation(() => Promise.resolve(data_results));
    const { debug } = render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    await act(async () => {
      // debug()
      jest.useFakeTimers();
    });

    const dataCurrentResultsElement = screen.getByTestId('data-currentResults');

    expect(dataCurrentResultsElement).toBeInTheDocument();
    expect(dataCurrentResultsElement).toHaveAttribute('role', 'region');
    expect(dataCurrentResultsElement).toHaveAttribute('aria-live');
    expect(['polite', 'assertive']).toContain(dataCurrentResultsElement.getAttribute('aria-live'));

  });
});


