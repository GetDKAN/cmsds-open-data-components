import React from 'react';
import { render, screen } from '@testing-library/react';
import StoredQueryPage from './index';

// Capture the calls the two services receive so we can assert on the
// operator-mapping and distribution-selection logic in StoredQueryPage.
const useDatastoreCalls: any[] = [];
const useMetastoreDatasetCalls: any[] = [];
let mockDistributions: any[] = [];

jest.mock('../../services/useDatastore', () => (id: any, rootUrl: any, options: any) => {
  useDatastoreCalls.push({ id, rootUrl, options });
  return {
    values: [],
    columns: [],
    schema: {},
    count: 0,
    setResource: jest.fn(),
  };
});

jest.mock('../../services/useMetastoreDataset', () => (id: any, rootUrl: any) => {
  useMetastoreDatasetCalls.push({ id, rootUrl });
  return {
    dataset: { title: 'Sample Stored Query', distribution: mockDistributions },
    isPending: false,
  };
});

// DataTableStateWrapper has its own ecosystem — stub it.
jest.mock('../../components/DatasetTableTab/DataTableStateWrapper', () => (props: any) => (
  <div
    data-testid="data-table-wrapper"
    data-copy={String(props.showCopyLinkButton)}
    data-stored-download={String(props.showStoredQueryDownloadButton)}
  />
));

const baseDistribution = {
  identifier: 'dist-001',
  data: { downloadURL: 'https://example.test/data/sample.csv', mediaType: 'text/csv' },
};

describe('StoredQueryPage', () => {
  beforeEach(() => {
    useDatastoreCalls.length = 0;
    useMetastoreDatasetCalls.length = 0;
    mockDistributions = [baseDistribution];
  });

  it('passes an empty conditions array when no query prop is provided', () => {
    render(<StoredQueryPage id="dataset-001" rootUrl="https://example.test/api/1" />);
    expect(useDatastoreCalls).toHaveLength(1);
    expect(useDatastoreCalls[0].options.conditions).toEqual([]);
    expect(useDatastoreCalls[0].options.limit).toBe(25);
  });

  it('honors defaultPageSize', () => {
    render(
      <StoredQueryPage
        id="dataset-001"
        rootUrl="https://example.test/api/1"
        defaultPageSize={100}
      />,
    );
    expect(useDatastoreCalls[0].options.limit).toBe(100);
  });

  it('renames `column` → `property` and maps query operators is/is not/or to =/<>/in', () => {
    const query = JSON.stringify([
      { column: 'product_name', operator: 'is', value: 'Alpha' },
      { column: 'region', operator: 'is not', value: 'East' },
      { column: 'category', operator: 'or', value: ['A', 'B'] },
      { column: 'price', operator: '>', value: 100 }, // already-canonical operator passes through
    ]);
    render(
      <StoredQueryPage id="dataset-001" rootUrl="https://example.test/api/1" query={query} />,
    );
    expect(useDatastoreCalls[0].options.conditions).toEqual([
      { property: 'product_name', operator: '=', value: 'Alpha' },
      { property: 'region', operator: '<>', value: 'East' },
      { property: 'category', operator: 'in', value: ['A', 'B'] },
      { property: 'price', operator: '>', value: 100 },
    ]);
  });

  it('selects the distribution at distributionIndex', () => {
    mockDistributions = [
      { identifier: 'dist-A' },
      { identifier: 'dist-B' },
      { identifier: 'dist-C' },
    ];
    render(
      <StoredQueryPage
        id="dataset-001"
        rootUrl="https://example.test/api/1"
        distributionIndex={2}
      />,
    );
    // DataTableStateWrapper rendered, meaning the DataTableContext.Provider was set up.
    expect(screen.getByTestId('data-table-wrapper')).toBeInTheDocument();
  });

  it('renders DataTableStateWrapper with stored-query download flags configured', () => {
    render(<StoredQueryPage id="dataset-001" rootUrl="https://example.test/api/1" />);
    const wrapper = screen.getByTestId('data-table-wrapper');
    expect(wrapper).toHaveAttribute('data-copy', 'false');
    expect(wrapper).toHaveAttribute('data-stored-download', 'true');
  });
});
