import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  beforeEach(async() => {
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
  })
  test('Renders correctly', async () => {
    render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    await act(async () => {
      jest.useFakeTimers();
    });

    expect(screen.getByRole('heading', { name: 'Dataset Explorer' }));
    expect(screen.getByRole('textbox', { name: 'Search datasets' }));
    expect(screen.getByRole('button', { name: 'Search' }));
  });
  test('Renders correctly after performing a search', async () => {
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
    await act(async () => {
      // debug()
      jest.useFakeTimers();
      render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    });

    const dataCurrentResultsElement = screen.getByTestId('currentResults');
    expect(dataCurrentResultsElement).toHaveAttribute('aria-live');
    expect(['polite', 'assertive']).toContain(dataCurrentResultsElement.getAttribute('aria-live'));

  });
  test("Updates the browser URL params when a facet is added", async () => {
    window.history.pushState = jest.fn();
    await act(async () => {
      // debug()
      jest.useFakeTimers();
      render(<MemoryRouter><DatasetSearch rootUrl={rootUrl} /></MemoryRouter>);
    });
    
    await act(() => {
      screen.getByRole("checkbox", { name: "general (2)" }).click();
    });
    // Check that the URL params were updated
    expect(window.history.pushState).toHaveBeenNthCalledWith(1, {}, "", expect.stringContaining("/?theme[0]=general"))
  });
});


