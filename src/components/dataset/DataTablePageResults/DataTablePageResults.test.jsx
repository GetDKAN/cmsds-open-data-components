import { render, fireEvent } from '@testing-library/react'
import DataTablePageResults from './DataTablePageResults'

const componentArgs = {
  total: 100,
  pageSize: 20,
  currentPage: 0,
  className: '',
  viewing: false
}

const renderComponent = (args = componentArgs) => render(
  <DataTablePageResults {...args} />
)

describe('DataTablePageResults component.', () => {
  it('Matches snapshot.', () => {
    const renderedDataTablePageResults = renderComponent({
      ...componentArgs,
      viewing: undefined
    })

    expect(renderedDataTablePageResults.asFragment()).toMatchSnapshot()
  })

  it('Displays \'Viewing\' text when \'viewing\' prop is true.', () => {
    const { container } = renderComponent({
      ...componentArgs,
      viewing: true,
      className: 'test-container'
    })

    expect(container.querySelector('.test-container').textContent).toBe('Viewing 1 - 20 of 100 rows')
  })

  it('Display total is 0 by default.', () => {
    const { container } = renderComponent({
      ...componentArgs,
      className: 'test-container',
      total: -1
    })

    expect(container.querySelector('.test-container').textContent).toBe('0 - 0 of 0 rows')
  })
})
