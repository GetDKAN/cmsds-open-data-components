import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import DatasetList from './index';

// Mock useQuery directly so each test can dictate isPending + data without
// going through the module-singleton QueryClient cache that
// withQueryProvider sets up. This also obviates an axios mock.
const mockUseQuery = jest.fn();
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return { ...actual, useQuery: (opts) => mockUseQuery(opts) };
});

// Stub child renderers — DatasetList's own logic is what we're testing.
jest.mock('../../components/DatasetListItem', () => (props) => (
  <li data-testid={`dataset-item-${props.identifier}`}>{props.title}</li>
));
jest.mock('../../components/LargeFileInfo', () => () => (
  <div data-testid="large-file-info" />
));
jest.mock('../../components/PageHeader', () => (props) => (
  <header data-testid="page-header">{props.headerText}</header>
));

// useQuery's data IS the resolved axios response; api body sits at data.data
const buildResponse = (results, total = Object.keys(results).length) => ({
  data: { results, total },
});

const sampleResults = {
  'dataset-001': {
    identifier: 'dataset-001',
    title: 'Quarterly Sales',
    modified: '2024-01-15',
  },
  'dataset-002': {
    identifier: 'dataset-002',
    title: 'Regional Inventory',
    modified: '2024-02-10',
  },
};

describe('DatasetList', () => {
  beforeEach(() => mockUseQuery.mockReset());

  it('shows a loading spinner while the query is pending', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isPending: true, error: null });
    renderWithProviders(<DatasetList rootUrl="https://example.test/api/1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders one DatasetListItem per result once the query resolves', () => {
    mockUseQuery.mockReturnValue({
      data: buildResponse(sampleResults, 2),
      isPending: false,
      error: null,
    });
    renderWithProviders(<DatasetList rootUrl="https://example.test/api/1" />);
    expect(screen.getByTestId('dataset-item-dataset-001')).toHaveTextContent('Quarterly Sales');
    expect(screen.getByTestId('dataset-item-dataset-002')).toHaveTextContent(
      'Regional Inventory',
    );
  });

  it('shows the "Could not connect to the API" alert when results are missing', () => {
    mockUseQuery.mockReturnValue({
      data: { data: { results: null, total: 0 } }, // axios response wrapping a null-results body
      isPending: false,
      error: null,
    });
    renderWithProviders(<DatasetList rootUrl="https://example.test/api/1" />);
    expect(screen.getByRole('region', { name: /could not connect to the api/i })).toBeInTheDocument();
  });

  it('hides the large-file-warning accordion by default', () => {
    mockUseQuery.mockReturnValue({
      data: buildResponse(sampleResults, 2),
      isPending: false,
      error: null,
    });
    renderWithProviders(<DatasetList rootUrl="https://example.test/api/1" />);
    expect(
      screen.queryByRole('button', { name: /please read before downloading datasets/i }),
    ).not.toBeInTheDocument();
  });

  it('renders the large-file-warning accordion when showLargeFileWarning is true', () => {
    mockUseQuery.mockReturnValue({
      data: buildResponse(sampleResults, 2),
      isPending: false,
      error: null,
    });
    renderWithProviders(
      <DatasetList rootUrl="https://example.test/api/1" showLargeFileWarning />,
    );
    expect(
      screen.getByRole('button', { name: /please read before downloading datasets/i }),
    ).toBeInTheDocument();
  });
});
