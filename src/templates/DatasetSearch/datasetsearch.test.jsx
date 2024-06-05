import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetSearch from './index';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.useFakeTimers();
const rootUrl = 'http://dkan.com/api/1';
const data_results = {
  data: {
    total: '1',
    results: {
      'dkan_dataset/5d69-frba': { title: 'dkan', identifier: '1234' },
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

describe('<DatasetSearch />', () => {
  test('Renders correctly', async () => {
    await axios.get.mockImplementation(() => Promise.resolve(data_results));
    render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    await act(async () => {
      jest.useFakeTimers();
    });

    expect(screen.getByRole('heading', { name: 'Dataset Explorer' }));
    expect(screen.getByRole('textbox', { name: 'Search datasets' }));
    expect(screen.getByRole('button', { name: 'Search' }));
  });
  test('Renders correctly after performing a search', async () => {
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
      render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    });

    const dataCurrentResultsElement = screen.getByTestId('currentResults');

    expect(dataCurrentResultsElement).toBeInTheDocument();
    // The CMS Design System select wraps the HTML select/label in another label with a button.
    expect(screen.getAllByLabelText('Sort')).toHaveLength(2);
    expect(screen.getByTestId('results-list'))
  })

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
      render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    });

    const dataCurrentResultsElement = screen.getByTestId('currentResults');
    expect(dataCurrentResultsElement).toHaveAttribute('role', 'region');
    expect(dataCurrentResultsElement).toHaveAttribute('aria-live');
    expect(['polite', 'assertive']).toContain(dataCurrentResultsElement.getAttribute('aria-live'));

  });
});


