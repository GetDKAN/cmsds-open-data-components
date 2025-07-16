import { render } from '@testing-library/react'
import DatasetResource from './DatasetResource'
import { DatasetContext } from '../../../context/DatasetContext'
import FilteredDatasetResource from './FilteredDatasetResource'
import { filteredDatasetResource } from '../../../utilities/data-mocks/data-filteredDatasetResource'

const mockDatasetResponse = require('../../../utilities/data-mocks/api-response-dataset.json')

// Mock useDataStore hook
vi.mock('../../../hooks/useDataStore', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    values: [
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '022',
        col4: '0',
        col5: '1745108',
        col6: 'M0023901'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '804',
        col4: '0',
        col5: '545293',
        col6: 'M0004994'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '804',
        col4: '0',
        col5: '545293',
        col6: 'M0012387'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '806',
        col4: '0',
        col5: '1251596',
        col6: 'M0004994'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '017',
        col4: '0',
        col5: '1482814',
        col6: 'M0004771'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '802',
        col4: '0',
        col5: '795085',
        col6: 'M0374010'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '802',
        col4: '0',
        col5: '848164',
        col6: 'M0023901'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '801',
        col4: '0',
        col5: '2200177',
        col6: 'M0006031'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '021',
        col4: '0',
        col5: '1653166',
        col6: 'M0023901'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '803',
        col4: '0',
        col5: '1720881',
        col6: 'M0004994'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '009',
        col4: '0',
        col5: '1745108',
        col6: 'M0023901'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '022',
        col4: '0',
        col5: '795085',
        col6: 'M0005335'
      },
      {
        col1: '00022225',
        col2: 'S5660',
        col3: '804',
        col4: '0',
        col5: '545293',
        col6: 'M0019437'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '004',
        col4: '0',
        col5: '795085',
        col6: 'M0001750'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '801',
        col4: '0',
        col5: '1653166',
        col6: 'M0004771'
      },
      {
        col1: '00022509',
        col2: 'H5050',
        col3: '019',
        col4: '0',
        col5: '795085',
        col6: 'M0374010'
      }
    ],
    count: 16,
    columns: [
      'col1',
      'col2',
      'col3',
      'col4',
      'col5',
      'col6'
    ],
    limit: 20,
    offset: 0,
    schema: {
      '7d48577d-2944-56f7-bb48-2f8272e87007': {
        fields: {
          col1: {
            type: 'text',
            mysql_type: 'text'
          },
          col2: {
            type: 'text',
            mysql_type: 'text'
          },
          col3: {
            type: 'text',
            mysql_type: 'text'
          },
          col4: {
            type: 'text',
            mysql_type: 'text'
          },
          col5: {
            type: 'int',
            length: 11,
            mysql_type: 'int',
            description: 'Column 5'
          },
          col6: {
            type: 'text',
            mysql_type: 'text'
          }
        }
      }
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
    fetchData: vi.fn()
  })
}))

const datasetContextProviderValue = {
  data: mockDatasetResponse,
  error: null,
  isLoading: true,
  setDatasetState: vi.fn(),
  resetDatasetState: vi.fn()
}

const componentArgs = {
  resource: filteredDatasetResource,
  datasetTitle: 'Medicare Plan Info Data',
  datasetDescription: 'A dataset showing all Medicare plan information from CMS.',
  datasetModified: '2021-11-29',
  datasetReleased: '2021-11-29',
}

describe('DatasetResource component.', () => {
  it('Matches snapshot.', async () => {
    const renderedSearchContent = render(
      <DatasetContext.Provider value={datasetContextProviderValue}>
        <FilteredDatasetResource
          resource={filteredDatasetResource}
        >
          <DatasetResource {...componentArgs} />
        </FilteredDatasetResource>
      </DatasetContext.Provider>
    )

    expect(renderedSearchContent.asFragment()).toMatchSnapshot()
  })
})
