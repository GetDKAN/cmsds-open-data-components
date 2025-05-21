import { render, screen, fireEvent, act } from '@testing-library/react'
import DataTableHeader from './DataTableHeader'
import FilteredDatasetResource from '../DatasetResource/FilteredDatasetResource'
import { filteredDatasetResource } from '../../../utilities/data-mocks/data-filteredDatasetResource'
import { DatasetContext } from '../../../context/DatasetContext'
import axios from 'axios'

// Mock axios
vi.mock('axios')

const mockDatasetResponse = require('../../../utilities/data-mocks/api-response-dataset.json')

// This suppresses console warnings for components
// DataTableHeader logs for debugging purposes
vi.mock('../../../log', async () => {
  const actual = await vi.importActual('../../../log')

  return {
    ...actual,
    debug: () => {}
  }
})

// Mock window.scrollTo
global.scrollTo = vi.fn()

const mockApiResponse = {
  'results': [
    {
      measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - agency score',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - count',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'For patients with diabetes, how often the home health team got doctor\u0027s orders, gave foot care, and taught patients about foot care',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often home health patients had new or worsened pressure ulcers',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often home health patients had to be admitted to the hospital',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often home health patients, who have had a recent hospital stay, had a preventable hospital readmission within 30 days of discharge from home health',
      measure_date_range: 'January 1, 2016 - December 31, 2018'
    },
    {
      measure_name: 'How often patients got better at bathing',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients got better at getting in and out of bed',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients got better at taking their drugs correctly by mouth',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients got better at walking or moving around',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients receiving home health care needed any urgent, unplanned care in the hospital emergency room - without being admitted to the hospital',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients remained at home within 31 days of being discharged from home health',
      measure_date_range: 'January 1, 2017 - December 31, 2018'
    },
    {
      measure_name: 'How often patients\u0027 breathing improved',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often patients\u0027 wounds improved or healed after an operation',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team began their patients\u0027 care in a timely manner',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team checked patients for depression',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team checked patients\u0027 medications and got doctor\u0027s orders for medication issues in a timely manner',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team checked patients\u0027 risk of falling',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team made sure that their patients have received a flu shot for the current flu season',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    },
    {
      measure_name: 'How often the home health team made sure that their patients have received a pneumococcal vaccine (pneumonia shot)',
      measure_date_range: 'January 1, 2018 - December 31, 2018'
    }
  ],
  count: 21,
  schema: {
    'a4eb46a4-fd19-55b0-baf4-de08c3a70abd': {
      fields: {
        measure_name: {
          type: 'text',
          mysql_type: 'text',
          description: 'Measure Name'
        },
        measure_date_range: {
          type: 'text',
          mysql_type: 'text',
          description: 'Measure Date Range'
        }
      }
    }
  },
  query: {
    keys: true,
    limit: 20,
    offset: 0,
    resources: [
      {
        id: 'a4eb46a4-fd19-55b0-baf4-de08c3a70abd',
        alias: 't'
      }
    ],
    count: true,
    results: true,
    schema: true,
    format: 'json',
    rowIds: false,
    properties: [
      'measure_name',
      'measure_date_range'
    ]
  }
}

const datasetContextProviderValue = {
  data: mockDatasetResponse,
  error: null,
  isLoading: true,
  setDatasetState: vi.fn(),
  resetDatasetState: vi.fn()
}

const componentArgs = {
  fullscreen: false,
  datasetTitle: 'Supplier Directory Data',
  datasetDescription: 'A list of Suppliers that indicates the supplies carried at that location and the supplier\'s Medicare participation status.',
  datasetModified: '2020-05-10',
  datasetReleased: '2020-05-10',
  instanceId: 1
}

const renderComponent = async (args = componentArgs) => render (
  <DatasetContext.Provider value={datasetContextProviderValue}>
    <FilteredDatasetResource
      resource={filteredDatasetResource}
    >
      <DataTableHeader {...args} />
    </FilteredDatasetResource>
  </DatasetContext.Provider>
)

describe('DataHeaderButton component.', () => {
  beforeEach(() => {
    // Mock useDatastore hook
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
  })

  it('Matches snapshot.', async () => {
    let renderedDataTableHeader

    await act(async () => {
      renderedDataTableHeader = await renderComponent()
    })

    expect(renderedDataTableHeader.asFragment()).toMatchSnapshot()
  })

  it('User can set a filter and remove a filter for a dataset.', async () => {
    axios
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse,
          results: [
            {
              measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - agency score',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - count',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            }
          ],
          count: 2,
          query: {
            keys: true,
            limit: 20,
            offset: 0,
            conditions: [
              {
                property: 'measure_name',
                operator: 'LIKE',
                value: '%%Average%%'
              },
              {
                property: 'measure_date_range',
                operator: 'LIKE',
                value: '%January 1, 2018 - December 31, 2018%'
              }
            ],
            resources: [
              {
                id: 'a4eb46a4-fd19-55b0-baf4-de08c3a70abd',
                alias: 't'
              }
            ],
            count: true,
            results: true,
            schema: true,
            format: 'json',
            rowIds: false,
            properties: [
              'measure_name',
              'measure_date_range'
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse,
          results: [
            {
              measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - agency score',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - count',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'For patients with diabetes, how often the home health team got doctor\u0027s orders, gave foot care, and taught patients about foot care',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often home health patients had new or worsened pressure ulcers',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often home health patients had to be admitted to the hospital',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at bathing',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at getting in and out of bed',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at taking their drugs correctly by mouth',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at walking or moving around',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients receiving home health care needed any urgent, unplanned care in the hospital emergency room - without being admitted to the hospital',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients\u0027 breathing improved',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients\u0027 wounds improved or healed after an operation',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team began their patients\u0027 care in a timely manner',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients for depression',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients\u0027 medications and got doctor\u0027s orders for medication issues in a timely manner',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients\u0027 risk of falling',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team made sure that their patients have received a flu shot for the current flu season',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team made sure that their patients have received a pneumococcal vaccine (pneumonia shot)',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team taught patients (or their family caregivers) about their drugs',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            }
          ],
          count: 19,
          query: {
            keys: true,
            limit: 20,
            offset: 0,
            conditions: [
              {
                property: 'measure_date_range',
                operator: 'LIKE',
                value: '%January 1, 2018 - December 31, 2018%'
              }
            ],
            resources: [
              {
                id: 'a4eb46a4-fd19-55b0-baf4-de08c3a70abd',
                alias: 't'
              }
            ],
            count: true,
            results: true,
            schema: true,
            format: 'json',
            rowIds: false,
            properties: [
              'measure_name',
              'measure_date_range'
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse
        }
      })
      
    let element

    await act(async () => {
      element = await renderComponent()
    })
    
    // Click 'Filter dataset' button to open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Filter dataset - Opens in a dialog' }))
    expect(element.container.querySelector('.filter-dialog')).toBeInTheDocument()

    // Choose a column name for first filter
    fireEvent.change(screen.getAllByLabelText('Select column')[0], { target: { value: 'measure_name' } })
    
    // Choose a condition for first filter
    fireEvent.change(screen.getAllByLabelText('Select condition')[0], { target: { value: 'LIKE' } })

    // Type a value for first filter
    fireEvent.change(screen.getAllByLabelText('Enter value')[0], { target: { value: 'Average' } })

    // Add another filter
    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }))

    // Choose a column name for second filter
    fireEvent.change(screen.getAllByLabelText('Select column')[1], { target: { value: 'measure_date_range' } })
    
    // Choose a condition for second filter
    fireEvent.change(screen.getAllByLabelText('Select condition')[1], { target: { value: 'LIKE' } })

    // Type a value for second filter
    fireEvent.change(screen.getAllByLabelText('Enter value')[1], { target: { value: 'January 1, 2018 - December 31, 2018' } })

    // Click 'Appy 2 Filters' button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Apply 2 Filters' }))
    })
    expect(element.container.querySelector('.data-table-results > p')).toHaveTextContent('Viewing 1 - 2 of 2 rows')
    expect(screen.queryByRole('button', { name: 'Remove measure_name contains Average filter' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove measure_date_range contains January 1, 2018 - December 31, 2018 filter' })).toBeInTheDocument()

    // Remove the measure_name filter
    await act(async () => {
      fireEvent.click(screen.queryByRole('button', { name: 'Remove measure_name contains Average filter' }))
    })
    expect(element.container.querySelector('.data-table-results > p')).toHaveTextContent('Viewing 1 - 19 of 19 rows')
    expect(screen.queryByRole('button', { name: 'Remove measure_name contains Average filter' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove measure_date_range contains January 1, 2018 - December 31, 2018 filter' })).toBeInTheDocument()

    // Remove the measure_date_range filter
    await act(async () => {
      fireEvent.click(screen.queryByRole('button', { name: 'Remove measure_date_range contains January 1, 2018 - December 31, 2018 filter' }))
    })
    expect(element.container.querySelector('.data-table-results > p')).toHaveTextContent('Viewing 1 - 20 of 21 rows')
    expect(screen.queryByRole('button', { name: 'Remove measure_date_range contains January 1, 2018 - December 31, 2018 filter' })).not.toBeInTheDocument()

    // Click 'Filter dataset' button to open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Filter dataset - Opens in a dialog' }))
    expect(element.container.querySelector('.filter-dialog')).toBeInTheDocument()

    // Choose a column name for first filter
    fireEvent.change(screen.getAllByLabelText('Select column')[0], { target: { value: 'measure_name' } })
    
    // Choose a condition for first filter
    fireEvent.change(screen.getAllByLabelText('Select condition')[0], { target: { value: 'LIKE' } })

    // Type a value for first filter
    fireEvent.change(screen.getAllByLabelText('Enter value')[0], { target: { value: 'Average' } })

    // Delete the filter from the dialog
    fireEvent.click(screen.getByRole('button', { name: 'delete filter' }))

    // Close the filter dialog
    fireEvent.click(screen.getByRole('button', { name: 'Close filter dataset dialog' }))

    expect(element.container.querySelector('.data-table-results > p')).toHaveTextContent('Viewing 1 - 20 of 21 rows')
    expect(element.container.querySelector('.chip-list')).toBeEmptyDOMElement()
  })

  it('User can reorder the columns for a dataset.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })

    let element

    await act(async () => {
      element = await renderComponent()
    })

    // Click 'Manage columns' button to open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.manage-col-dialog')).toBeInTheDocument()

    // Enter key to grab the move handle
    fireEvent.keyDown(screen.getAllByLabelText('Reorder Measure Name column')[0], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name grabbed')

    // ArrowDown key to change the column order
    fireEvent.keyDown(screen.getAllByLabelText('Reorder Measure Name column')[0], {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('The rankings have been updated, Measure Name is now ranked 2 of 2')

    // Enter key to drop the move handle
    fireEvent.keyDown(screen.getAllByLabelText('Reorder Measure Name column')[0], {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name dropped')

    // Update the column order
    fireEvent.click(screen.getByRole('button', { name: 'Update columns' }))
    expect(screen.queryByRole('button', { name: 'Columns reordered' })).toBeInTheDocument()

    // Clear column reorder
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }))
    })
    expect(screen.queryByRole('button', { name: 'Columns reordered' })).not.toBeInTheDocument()
  })

  it('User can change the row height of the data table.', async () => {
    let element

    await act(async () => {
      element = await renderComponent()
    })

    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }),
      writable: true
    })

    // Open the 'Display settings' dropdown
    fireEvent.click(screen.getByRole('button', { name: 'Display settings' }))
    expect(element.container.querySelector('.popover-row.data-table-density')).toBeInTheDocument()

    // Click 'Expanded' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Expanded' }))
    expect(screen.queryByRole('button', { name: 'Row height, Expanded - selected' })).toHaveClass('active')

    // Click 'Normal' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Normal' }))
    expect(screen.queryByRole('button', { name: 'Row height, Normal - selected' })).toHaveClass('active')

    // Click 'Compact' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Compact' }))
    expect(screen.queryByRole('button', { name: 'Row height, Compact - selected' })).toHaveClass('active')

    // Close 'Display settings' dropdown
    await act(async () => {
      fireEvent.blur(screen.getByRole('button', { name: 'Display settings' }))
    })
    expect(element.container.querySelector('.popover-row.data-table-density')).not.toBeInTheDocument()
  })

  it('User can change the rows per page of the data table.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse,
        results: [
          ...mockApiResponse.results,
          {
            measure_name: 'How often the home health team taught patients (or their family caregivers) about their drugs',
            measure_date_range: 'January 1, 2018 - December 31, 2018'
          }
        ],
        query: {
          ...mockApiResponse.query,
          limit: 50
        }
      }
    })

    let element

    await act(async () => {
      element = await renderComponent()
    })

    // Open the 'Display settings' dropdown
    fireEvent.click(screen.getByRole('button', { name: 'Display settings' }))
    expect(element.container.querySelector('.popover-row.data-table-density')).toBeInTheDocument()

    // Select rows per page value
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Rows per page'), { target: { value: '50' } })
    })

    expect(element.container.querySelector('.data-table-results > p')).toHaveTextContent('Viewing 1 - 21 of 21 rows')
  })

  it('User can open dataset explorer in fullscreen mode.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })

    let element

    await act(async () => {
      element = await renderComponent()
    })

    // Open the 'Fullscreen' dialog
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Fullscreen - Opens in a dialog' }))
    })
    expect(element.container.querySelector('.fullscreen-resource')).toBeInTheDocument()
    expect(element.container.querySelector('.fullscreen-resource .DataTable')).toBeInTheDocument()
  })
})
