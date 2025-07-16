import renderer from 'react-test-renderer'
import DataTable from './DataTable'
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilteredDatasetResource from '../DatasetResource/FilteredDatasetResource'
import { filteredDatasetResource } from '../../../utilities/data-mocks/data-filteredDatasetResource'
import axios from 'axios'

// Mock axios
vi.mock('axios')

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

const renderComponent = async () => render(
  <FilteredDatasetResource
    resource={filteredDatasetResource}
  >
    <DataTable datasetTitle='Home Health Care - Measure Date Range' />
  </FilteredDatasetResource>
)

describe('DataTable component.', () => {
  it('Matches snapshot.', async () => {
    let renderedDataTable

    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    await act(async () => {
      renderedDataTable = renderer.create(
        <FilteredDatasetResource
          resource={filteredDatasetResource}
        >
          <DataTable datasetTitle='Home Health Care - Measure Date Range' />
        </FilteredDatasetResource>
      )
    })

    expect(renderedDataTable.toJSON()).toMatchSnapshot()
  })

  it('The \'Next\' and \'Previous\' buttons change data pages in the table.', async () => {
    axios
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse
        }
      })
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse,
          results: [
            {
              measure_name: 'How often the home health team taught patients (or their family caregivers) about their drugs',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            }
          ],
          offset: 20
        }
      })
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse
        }
      })
    
    let element
    await act(async () => {
      element = await renderComponent({})
    })

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Next data page'} )))
    expect(element.container.querySelector('.-pageInfo')).toHaveTextContent('Page 2 of 2 for Home Health Care - Measure Date Range')

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Previous data page'} )))
    expect(element.container.querySelector('.-pageInfo')).toHaveTextContent('Page 1 of 2 for Home Health Care - Measure Date Range')
  })

  it('User can resize the table columns with a keyboard', async () => {
    // Set fake timers
    vi.useFakeTimers()

    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })

    let element
    await act(async () => {
      element = await renderComponent({})
    })

    // Click just for higher test coverage
    fireEvent.click(screen.getByLabelText('Resize Measure Name column'))

    // Enter key to grab the resize handle
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name grabbed.')

    // ArrowRight key to increase the first column width 10px
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: 39,
      charCode: 39
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name has been resized. The new width is 160 pixels.')

    // Escape key to drop the column
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name dropped.')

    // Enter key to grab the resize handle
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name grabbed.')

    // ArrowLeft key to reduce the first column width 10px
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: 37,
      charCode: 37
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name has been resized. The new width is 150 pixels.')

    // Space key to drop the column
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      charCode: 32
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name dropped.')

    // Enter key to grab the resize handle one last time
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name grabbed.')

    // Advance time by 5 seconds
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    // aria-live region clears text after 5 seconds so it's not left hanging around
    expect(element.container.querySelector('.aria-live-feedback')).toBeEmptyDOMElement()

    // Blur the resize handle to end resizing
    fireEvent.blur(screen.getByLabelText('Resize Measure Name column'))
    expect(element.container.querySelector('[aria-label="Resize Measure Name column"]').classList.contains('isResizing')).toBe(false)

    // Reset timers
    vi.useRealTimers()
  })

  it('Columns don\'t resize above 400px', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })

    let element
    await act(async () => {
      element = await renderComponent({})
    })

    // Enter key to grab the resize handle
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    // ArrowRight key to increase the first column width 10px
    for (let i = 1; i <= 26; i++) { // Iterate 26 times to set the width to 410px (Increments by 10 and starts at 150)
      fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
        charCode: 39
      })
    }
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name has been resized. The new width is 400 pixels.')
  })

  it('Columns don\'t resize below 30px', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })

    let element
    await act(async () => {
      element = await renderComponent({})
    })

    // Enter key to grab the resize handle
    fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    // ArrowRight key to increase the first column width 10px
    for (let i = 1; i <= 13; i++) { // Iterate 13 times to set the width to 20px (Increments by 10 and starts at 150)
      fireEvent.keyDown(screen.getByLabelText('Resize Measure Name column'), {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        keyCode: 37,
        charCode: 37
      })
    }
    expect(element.container.querySelector('.aria-live-feedback')).toHaveTextContent('Measure Name has been resized. The new width is 30 pixels.')
  })

  it('User can sort the table columns', async () => {
    axios
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse
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
          query: {
            ...mockApiResponse.query,
            sorts: [
              {
                property: 'measure_name',
                order: 'asc'
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          ...mockApiResponse,
          results: [
            {
              measure_name: 'How often the home health team taught patients (or their family caregivers) about their drugs',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team made sure that their patients have received a pneumococcal vaccine (pneumonia shot)',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team made sure that their patients have received a flu shot for the current flu season',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients\u0027 risk of falling',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients\u0027 medications and got doctor\u0027s orders for medication issues in a timely manner',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team checked patients for depression',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often the home health team began their patients\u0027 care in a timely manner',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients\u0027 wounds improved or healed after an operation',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients\u0027 breathing improved',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients remained at home within 31 days of being discharged from home health',
              measure_date_range: 'January 1, 2017 - December 31, 2018'
            },
            {
              measure_name: 'How often patients receiving home health care needed any urgent, unplanned care in the hospital emergency room - without being admitted to the hospital',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at walking or moving around',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at taking their drugs correctly by mouth',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at getting in and out of bed',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often patients got better at bathing',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often home health patients, who have had a recent hospital stay, had a preventable hospital readmission within 30 days of discharge from home health',
              measure_date_range: 'January 1, 2016 - December 31, 2018'
            },
            {
              measure_name: 'How often home health patients had to be admitted to the hospital',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'How often home health patients had new or worsened pressure ulcers',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'For patients with diabetes, how often the home health team got doctor\u0027s orders, gave foot care, and taught patients about foot care',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            },
            {
              measure_name: 'Average Medicare spending associated with an agency\u0027s home health episodes compared with all home health episodes nationally - count',
              measure_date_range: 'January 1, 2018 - December 31, 2018'
            }
          ],
          query: {
            ...mockApiResponse.query,
            sorts: [
              {
                property: 'measure_name',
                order: 'desc'
              }
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
      element = await renderComponent({})
    })

    // Check initial value
    expect(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button').getAttribute('aria-label')).toEqual('Sort Measure Name column in ascending order')

    // Check sorting asc
    await act(async () => {
      fireEvent.click(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button'))
    })
    expect(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button').getAttribute('aria-label')).toEqual('Sort Measure Name column in descending order')

    // Check sorting desc
    await act(async () => {
      fireEvent.click(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button'))
    })
    expect(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button').getAttribute('aria-label')).toEqual('Reset Measure Name column sort order')

    // Check sorting reset
    await act(async () => {
      fireEvent.click(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button'))
    })
    expect(element.container.querySelector('.dc-thead > .tr > .th:first-child .sort-icon > button').getAttribute('aria-label')).toEqual('Sort Measure Name column in ascending order')
  })
})
