import { render, screen, fireEvent, act } from '@testing-library/react'
import FilterDataset from './FilterDataset'
import FilteredDatasetResource from '../DatasetResource/FilteredDatasetResource'
import { filteredDatasetResource } from '../../../utilities/data-mocks/data-filteredDatasetResource'
import axios from 'axios'

// Mock axios
vi.mock('axios')

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

const mockApplyFilter = vi.fn()
const mockOnExit = vi.fn()
const componentArgs = {
  lFilters: [
    {
      column: 'measure_name',
      condition: 'LIKE',
      value: '%Average%'
    }
  ],
  open: true,
  addFilter: vi.fn(),
  updateFilters: vi.fn(),
  deleteFilter: vi.fn(),
  resetFilters: vi.fn(),
  applyFilter: mockApplyFilter,
  onExit: mockOnExit
}

const renderComponent = async (args = componentArgs) => render (
  <FilteredDatasetResource
    resource={filteredDatasetResource}
  >
    <FilterDataset {...args} />
  </FilteredDatasetResource>
)

describe('FilterDataset component.', () => {
  beforeEach(() => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
  })

  it('Matches snapshot.', async () => {
    let renderedFilterDataset = null
    
    await act(async () => {
      renderedFilterDataset = await renderComponent()
    })

    expect(renderedFilterDataset.asFragment()).toMatchSnapshot()
  })

  it('Dialog is not open when \'open\' prop is false.', async () => {
    let element = null
    
    await act(async () => {
      element = await renderComponent({
        ...componentArgs,
        open: false
      })
    })

    expect(element.container.querySelector('.filter-dialog')).not.toHaveClass('open')
  })

  it('Apply button is disabled when there are no filters.', async () => {
    await act(async () => {
      await renderComponent({
        ...componentArgs,
        lFilters: []
      })
    })

    expect(screen.getByRole('button', { name: 'Apply 0 Filters' })).toHaveClass('disabled')
  })

  it('Apply button is disabled when filters are undefined.', async () => {
    await act(async () => {
      await renderComponent({
        ...componentArgs,
        lFilters: undefined
      })
    })

    expect(screen.getByRole('button', { name: 'Apply 0 Filters' })).toHaveClass('disabled')
  })

  it('Apply button is disabled when filter values are empty.', async () => {
    await act(async () => {
      await renderComponent({
        ...componentArgs,
        lFilters: [
          {
            column: 'measure_name',
            condition: 'LIKE',
            value: ''
          }
        ]
      })
    })

    expect(screen.getByRole('button', { name: 'Apply 1 Filter' })).toHaveClass('disabled')
  })

  it('Apply button is not disabled when filter filter condition is \'is_empty\'.', async () => {
    await act(async () => {
      await renderComponent({
        ...componentArgs,
        lFilters: [
          {
            column: 'measure_date_range',
            condition: 'is_empty',
            value: ''
          }
        ]
      })
    })

    expect(screen.getByRole('button', { name: 'Apply 1 Filter' })).not.toHaveClass('disabled')
  })

  it('Clicking \'Apply Filters\' button applies the filters and closes the dialog.', async () => {
    await act(async () => {
      await renderComponent({
        ...componentArgs,
        lFilters: [
          {
            column: 'measure_name',
            condition: 'is_empty',
            value: ''
          }
        ]
      })
    })

    fireEvent.click(screen.getByRole('button', { name: 'Apply 1 Filter' }))

    expect(mockApplyFilter).toHaveBeenCalledWith([
      {
        column: 'measure_name',
        condition: 'is_empty',
        value: ''
      }
    ])
    expect(mockOnExit).toHaveBeenCalled()
  })
})
