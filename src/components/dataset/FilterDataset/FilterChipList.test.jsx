import { render, fireEvent, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import FilterChipList from './FilterChipList'

const componentArgs = {
  filters: [
    {
      column: 'col4',
      condition: 'is_empty',
      value: ''
    },
    {
      column: 'col2',
      condition: 'LIKE',
      value: '%medicare%'
    }
  ],
  hidden: false,
  reordered: false,
  deleteFilter: vi.fn(),
  resetColumnOrder: vi.fn(),
  resetHiddenColumns: vi.fn(),
  resetFilters: vi.fn()
}

describe('FilterChipList component.', () => {
  it('Matches snapshot.', () => {
    const renderedFilterChipList = renderer.create(
      <FilterChipList {...componentArgs} />
    ).toJSON()

    expect(renderedFilterChipList).toMatchSnapshot()
  })

  it('Renders the \'Columns hidden\' chip when \'hidden\' prop is set.', () => {
    const resetHiddenColumns = vi.fn()
    
    render(
      <FilterChipList
        {...componentArgs}
        hidden={true}
        resetHiddenColumns={resetHiddenColumns}
      />
    )

    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Columns hidden' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Columns hidden' }))

    expect(resetHiddenColumns).toHaveBeenCalled()
  })

  it('Renders the \'Columns reordered\' chip when \'reordered\' prop is set.', () => {
    const resetColumnOrder = vi.fn()
    
    render(
      <FilterChipList
        {...componentArgs}
        reordered={true}
        resetColumnOrder={resetColumnOrder}
      />
    )

    expect(screen.getByRole('button', { name: 'Columns reordered' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Columns reordered' }))

    expect(resetColumnOrder).toHaveBeenCalled()
  })

  it('All filters are removed when \'Clear all filters\' is clicked.', () => {
    const resetColumnOrder = vi.fn()
    const resetHiddenColumns = vi.fn()
    const resetFilters = vi.fn()
    
    render(
      <FilterChipList
        {...componentArgs}
        resetColumnOrder={resetColumnOrder}
        resetHiddenColumns={resetHiddenColumns}
        resetFilters={resetFilters}
      />
    )

    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }))

    expect(resetColumnOrder).toHaveBeenCalled()
    expect(resetHiddenColumns).toHaveBeenCalled()
    expect(resetFilters).toHaveBeenCalled()
  })

  it('Renders the \'Clear all filters\' button when there are no filters but hidden columns are set.', () => {
    render(
      <FilterChipList
        {...componentArgs}
        filters={[]}
        hidden={true}
      />
    )

    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument()
  })

  it('Renders the \'Clear all filters\' button when there are no filters but reordered columns are set.', () => {    
    render(
      <FilterChipList
        {...componentArgs}
        filters={[]}
        reordered={true}
      />
    )

    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument()
  })
})
