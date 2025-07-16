import { render, screen, fireEvent } from '@testing-library/react'
import renderer from 'react-test-renderer'
import PopOverContent from './PopOverContent'
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext'

const updateRowsProp = vi.fn()
const setActiveDensityFn = vi.fn()

const componentArgs = {
  datasetTitle: 'Home Health Care - Measure Date Range',
  limit: 20,
  updateRows: updateRowsProp
}

const renderComponent = (args = componentArgs) => render (
  <FilteredDispatch.Provider
    value={{
      activeDensity: 'Normal',
      setActiveDensity: setActiveDensityFn
    }}
  >
    <PopOverContent {...componentArgs} />
  </FilteredDispatch.Provider>
)

describe('PopOverContent component.', () => {
  it('Matches snapshot.', async () => {
    const renderedPopOverContent = renderer.create(
      <FilteredDispatch.Provider
        value={{
          activeDensity: 'Normal',
          setActiveDensity: setActiveDensityFn
        }}
      >
        <PopOverContent {...componentArgs} />
      </FilteredDispatch.Provider>
    ).toJSON()

    expect(renderedPopOverContent).toMatchSnapshot()
  })

  it('Row density can be changed.', () => {
    renderComponent()

    // Click 'Expanded' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Expanded' }))
    expect(setActiveDensityFn).toHaveBeenCalled()

    // Click 'Normal' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Normal - selected' }))
    expect(setActiveDensityFn).toHaveBeenCalled()

    // Click 'Compact' option
    fireEvent.click(screen.getByRole('button', { name: 'Row height, Compact' }))
    expect(setActiveDensityFn).toHaveBeenCalled()
  })

  it('Rows per page can be changed.', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText('Rows per page'), { target: { value: '50' } })

    expect(updateRowsProp).toHaveBeenCalled()
  })
})
