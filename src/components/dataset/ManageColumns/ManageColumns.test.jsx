import { render, screen, fireEvent, act } from '@testing-library/react'
import ManageColumns from './ManageColumns'
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

const componentArgs = {
  datasetTitle: 'Supplier Directory Data',
  showTooltip: false
}

const renderComponent = async (args = componentArgs) => render (
  <FilteredDatasetResource
    resource={filteredDatasetResource}
  >
    <ManageColumns {...args} />
  </FilteredDatasetResource>
)

describe('ManageColumns component.', () => {
  it('Matches snapshot.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let renderedManageColumns = null
    
    await act(async () => {
      renderedManageColumns = await renderComponent()
    })

    expect(renderedManageColumns.asFragment()).toMatchSnapshot()
  })

  it('The list of columns can be reordered with a keyboard and screen reader feedback is provided.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    // Set fake timers
    vi.useFakeTimers()

    let element = null

    await act(async () => {
      element = await renderComponent()
    })

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    // Clicking the Measure Name column button does nothing
    fireEvent.click(screen.getByRole('button', { name: 'Reorder Measure Name column' }))
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('')

    // Grab the Measure Name column reorder button
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Enter'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name grabbed')

    // Move the Measure Name column into the second position
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowDown'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('The rankings have been updated, Measure Name is now ranked 2 of 2')

    // Move the Measure Name column back into the first position
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowUp'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('The rankings have been updated, Measure Name is now ranked 1 of 2')

    // Drop the Measure Name column
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Enter'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name dropped')

    // ===

    // Grab the Measure Name column reorder button again
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Enter'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name grabbed')

    // Press escape key to drop the Measure Name column
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Escape'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name dropped')

    // Advance time by 6 seconds to clear the aria live region content
    await act(async () => {
      vi.advanceTimersByTime(6000)
    })

    // Pressing escape key on the Measure Name column reorder button does nothing when it is not grabbed
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Escape'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('')

    // Pressing arrow up key on the Measure Name column reorder button does nothing when it is not grabbed
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowUp'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('')

    // Pressing arrow down key on the Measure Name column reorder button does nothing when it is not grabbed
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowDown'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('')

    // ===

    // Grab the Measure Name column reorder button again
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Enter'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name grabbed')

    // Blurring the Measure Name column reorder button drops the button
    fireEvent.blur(screen.getByRole('button', { name: 'Reorder Measure Name column' }))

    // Advance time by 6 seconds to clear the aria live region content
    await act(async () => {
      vi.advanceTimersByTime(6000)
    })

    // Attempt to move the Measure Name column into the second position but it shouldn't because it was previously blurred
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowDown'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('')

    // Reset timers
    vi.useRealTimers()
  })

  it('Clicking a column checkbox unchecks it.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let element = null

    await act(async () => {
      element = await renderComponent()
    })

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    expect(element.container.querySelector('#measure_name').checked).toBe(true)

    fireEvent.click(element.container.querySelector('#measure_name'))
    expect(element.container.querySelector('#measure_name').checked).toBe(false)
  })

  it('\'Select all\' button selects/deselects all columns.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let element = null

    await act(async () => {
      element = await renderComponent()
    })

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    // Unselect all
    fireEvent.click(element.container.querySelector('.select-all-choice input[type="checkbox"]'))

    Array.from(element.container.querySelectorAll('.advanced-options > li')).forEach((item) => {
      expect(item.querySelector('input[type="checkbox"]').checked).toBe(false)
    })

    // Select all
    fireEvent.click(element.container.querySelector('.select-all-choice input[type="checkbox"]'))

    Array.from(element.container.querySelectorAll('.advanced-options > li')).forEach((item) => {
      expect(item.querySelector('input[type="checkbox"]').checked).toBe(true)
    })
  })

  it('Dialog closes when columns are updated.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let element = null

    await act(async () => {
      element = await renderComponent()
    })

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    // Uncheck Measure Name column
    fireEvent.click(element.container.querySelector('#measure_name'))
    expect(element.container.querySelector('#measure_name').checked).toBe(false)

    // Click Update columns button
    fireEvent.click(screen.getByRole('button', { name: 'Update columns' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).not.toHaveClass('open')

    // ===
    
    // Reopen the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    // Grab the Measure Name column reorder button
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'Enter'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('Measure Name grabbed')

    // Move the Measure Name column into the second position
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Measure Name column' }), {
      key: 'ArrowDown'
    })
    expect(element.container.querySelector('.sr-only.aria-live-feedback').textContent).toBe('The rankings have been updated, Measure Name is now ranked 2 of 2')

    // Click Update columns button
    fireEvent.click(screen.getByRole('button', { name: 'Update columns' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).not.toHaveClass('open')
  })

  it('Clicking the close dialog button closes the dialog.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let element = null

    await act(async () => {
      element = await renderComponent()
    })

    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Manage columns - Opens in a dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).toHaveClass('open')

    // Close the dialog
    fireEvent.click(screen.getByRole('button', { name: 'Close manage columns dialog' }))
    expect(element.container.querySelector('.ds-c-dialog-wrap')).not.toHaveClass('open')
  })

  it('Dialog height is small when there are less than 5 columns.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse
      }
    })
    
    let element = null
    
    await act(async () => {
      element = await renderComponent()
    })

    expect(element.container.querySelector('.manage-col-dialog')).toHaveClass('manage-col-sm')
  })

  it('Dialog height is medium when there are more than 4 but less than 9 columns.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse,
        schema: {
          'a4eb46a4-fd19-55b0-baf4-de08c3a70abd': {
            fields: {
              test_1: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 1'
              },
              test_2: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 2'
              },
              test_3: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 3'
              },
              test_4: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 4'
              },
              test_5: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 5'
              },
              test_6: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 6'
              },
              test_7: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 7'
              },
              test_8: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 8'
              }
            }
          }
        }
      }
    })

    let element = null
    
    await act(async () => {
      element = await renderComponent()
    })

    expect(element.container.querySelector('.manage-col-dialog')).toHaveClass('manage-col-md')
  })

  it('Dialog height is large when there are more than 8 but less than 13 columns.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse,
        schema: {
          'a4eb46a4-fd19-55b0-baf4-de08c3a70abd': {
            fields: {
              test_1: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 1'
              },
              test_2: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 2'
              },
              test_3: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 3'
              },
              test_4: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 4'
              },
              test_5: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 5'
              },
              test_6: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 6'
              },
              test_7: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 7'
              },
              test_8: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 8'
              },
              test_9: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 9'
              }
            }
          }
        }
      }
    })

    let element = null
    
    await act(async () => {
      element = await renderComponent()
    })

    expect(element.container.querySelector('.manage-col-dialog')).toHaveClass('manage-col-lg')
  })

  it('Dialog height is extra-large when there are more than 13 columns.', async () => {
    axios.mockResolvedValueOnce({
      data: {
        ...mockApiResponse,
        schema: {
          'a4eb46a4-fd19-55b0-baf4-de08c3a70abd': {
            fields: {
              test_1: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 1'
              },
              test_2: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 2'
              },
              test_3: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 3'
              },
              test_4: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 4'
              },
              test_5: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 5'
              },
              test_6: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 6'
              },
              test_7: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 7'
              },
              test_8: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 8'
              },
              test_9: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 9'
              },
              test_10: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 10'
              },
              test_11: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 11'
              },
              test_12: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 12'
              },
              test_13: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 13'
              },
              test_14: {
                type: 'text',
                mysql_type: 'text',
                description: 'Test 14'
              }
            }
          }
        }
      }
    })

    let element = null
    
    await act(async () => {
      element = await renderComponent()
    })

    expect(element.container.querySelector('.manage-col-dialog')).toHaveClass('manage-col-xl')
  })
})
