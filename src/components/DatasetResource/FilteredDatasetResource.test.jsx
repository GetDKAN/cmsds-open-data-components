import { useContext } from 'react';
import { render, act } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { DatasetContext } from '../../context/DatasetContext';
import FilteredDatasetResource from './FilteredDatasetResource';
import { filteredDatasetResource } from '../../utilities/data-mocks/data-filteredDatasetResource';
import { FilteredDispatch } from './FilteredDatasetContext';
import * as useDatastore from '../../hooks/useDataStore';

const mockDatasetResponse = require('../../utilities/data-mocks/api-response-dataset.json');

// Mock useDataStore hook value
const mockUseDataStoreDefaultValue = {
  loading: false,
  values: [
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '022',
      col4: '0',
      col5: '1745108',
      col6: 'M0023901',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '804',
      col4: '0',
      col5: '545293',
      col6: 'M0004994',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '804',
      col4: '0',
      col5: '545293',
      col6: 'M0012387',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '806',
      col4: '0',
      col5: '1251596',
      col6: 'M0004994',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '017',
      col4: '0',
      col5: '1482814',
      col6: 'M0004771',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '802',
      col4: '0',
      col5: '795085',
      col6: 'M0374010',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '802',
      col4: '0',
      col5: '848164',
      col6: 'M0023901',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '801',
      col4: '0',
      col5: '2200177',
      col6: 'M0006031',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '021',
      col4: '0',
      col5: '1653166',
      col6: 'M0023901',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '803',
      col4: '0',
      col5: '1720881',
      col6: 'M0004994',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '009',
      col4: '0',
      col5: '1745108',
      col6: 'M0023901',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '022',
      col4: '0',
      col5: '795085',
      col6: 'M0005335',
    },
    {
      col1: '00022225',
      col2: 'S5660',
      col3: '804',
      col4: '0',
      col5: '545293',
      col6: 'M0019437',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '004',
      col4: '0',
      col5: '795085',
      col6: 'M0001750',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '801',
      col4: '0',
      col5: '1653166',
      col6: 'M0004771',
    },
    {
      col1: '00022509',
      col2: 'H5050',
      col3: '019',
      col4: '0',
      col5: '795085',
      col6: 'M0374010',
    },
  ],
  count: 16,
  columns: ['col1', 'col2', 'col3', 'col4', 'col5', 'col6'],
  limit: 20,
  offset: 0,
  schema: {
    '7d48577d-2944-56f7-bb48-2f8272e87007': {
      fields: {
        col1: {
          type: 'text',
          mysql_type: 'text',
        },
        col2: {
          type: 'text',
          mysql_type: 'text',
        },
        col3: {
          type: 'text',
          mysql_type: 'text',
        },
        col4: {
          type: 'text',
          mysql_type: 'text',
        },
        col5: {
          type: 'int',
          length: 11,
          mysql_type: 'int',
          description: 'Column 5',
        },
        col6: {
          type: 'text',
          mysql_type: 'text',
        },
      },
    },
  },
  conditions: undefined,
  properties: undefined,
  setProperties: vi.fn(),
  setGroupings: vi.fn(),
  setResource: vi.fn(),
  setRootUrl: vi.fn(),
  setLimit: vi.fn(),
  setOffset: vi.fn(),
  setConditions: vi.fn(),
  setSort: vi.fn(),
  setManual: vi.fn(),
  setRequireConditions: vi.fn(),
  fetchData: vi.fn(),
};

const datasetContextProviderValue = {
  data: mockDatasetResponse,
  error: null,
  isLoading: true,
  setDatasetState: vi.fn(),
  resetDatasetState: vi.fn(),
};

let datasetState;
const renderComponent = ({
  contextValue = datasetContextProviderValue,
  resource = filteredDatasetResource,
  getStateValue = (data) => {
    datasetState = data;
  },
}) => {
  return render(
    <DatasetContext.Provider value={contextValue}>
      <FilteredDatasetResource resource={resource}>
        <FilteredDatasetResourceTestingComponent getStateValue={getStateValue} />
      </FilteredDatasetResource>
    </DatasetContext.Provider>
  );
};

const FilteredDatasetResourceTestingComponent = ({ getStateValue }) => {
  getStateValue(useContext(FilteredDispatch));
};

describe('FilteredDatasetResource component', () => {
  beforeEach(() => {
    datasetState = null;

    vi.spyOn(useDatastore, 'default').mockImplementation(() => mockUseDataStoreDefaultValue);
  });

  it('Matches snapshot', () => {
    const renderedFilteredDatasetResource = renderer
      .create(
        <DatasetContext.Provider value={datasetContextProviderValue}>
          <FilteredDatasetResource resource={filteredDatasetResource}>
            Dataset content goes here
          </FilteredDatasetResource>
        </DatasetContext.Provider>
      )
      .toJSON();

    expect(renderedFilteredDatasetResource).toMatchSnapshot();
  });

  it('Dataset state columns are correct', () => {
    renderComponent({});

    expect(datasetState.filteredResource.columns).toEqual([
      'col1',
      'col2',
      'col3',
      'col4',
      'col5',
      'col6',
    ]);
  });

  it('Dataset state columns are empty if useDatastore returns none', () => {
    vi.spyOn(useDatastore, 'default').mockImplementation(() => ({
      loading: false,
      values: [],
      count: 0,
      columns: [],
      limit: 20,
      offset: 0,
      schema: {},
      conditions: undefined,
      properties: undefined,
      setProperties: vi.fn(),
      setGroupings: vi.fn(),
      setResource: vi.fn(),
      setRootUrl: vi.fn(),
      setLimit: vi.fn(),
      setOffset: vi.fn(),
      setConditions: vi.fn(),
      setSort: vi.fn(),
      setManual: vi.fn(),
      setRequireConditions: vi.fn(),
      fetchData: vi.fn(),
    }));

    const mockResource = Object.assign({}, filteredDatasetResource);
    delete mockResource.identifier;

    renderComponent({
      resource: mockResource,
    });

    expect(datasetState.filteredResource.columns).toEqual([]);
  });

  it('Dataset columns are properly updated when filtered', async () => {
    renderComponent({});

    // Filter the columns
    await act(async () => {
      datasetState.filteredResource.loading = true; // This is just for full test coverage
      datasetState.setVisCol(['col1', 'col2']);
    });

    const filteredTableColumns = [];
    datasetState.filteredTable.columns.forEach((column) => {
      filteredTableColumns.push(column.id);
    });

    expect(datasetState.visCol).toEqual(['col1', 'col2']);
    expect(filteredTableColumns).toEqual(['col1', 'col2']);

    // Reset the columns
    await act(async () => {
      datasetState.filteredResource.loading = false; // This is just for full test coverage
      datasetState.resetVisibility();
    });

    const resetTableColumns = [];
    datasetState.filteredTable.columns.forEach((column) => {
      resetTableColumns.push(column.id);
    });

    expect(datasetState.visCol).toEqual(['col1', 'col2', 'col3', 'col4', 'col5', 'col6']);
    expect(resetTableColumns).toEqual(['col1', 'col2', 'col3', 'col4', 'col5', 'col6']);
  });

  it('Data table rows are properly filtered when triggered', () => {
    renderComponent({});

    // This is just to get full test coverage
    const modifiedRows = { ...datasetState.filteredTable.rows };
    modifiedRows[1].values['col6'] = undefined;

    // Filter table rows at column 6 with 'M0023901' filter - uses 'starts with'
    const filteredRows = datasetState.filteredTable.filterTypes.text(
      datasetState.filteredTable.rows,
      'col6',
      'M0023901'
    );
    const expectedRowIds = ['0', '1', '6', '8', '10'];
    const actualRowIds = [];

    filteredRows.forEach((row) => {
      actualRowIds.push(row.id);
    });

    expect(filteredRows.length).toEqual(5);
    expect(actualRowIds).toEqual(expectedRowIds);
  });
});
