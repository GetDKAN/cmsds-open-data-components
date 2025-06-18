import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DatasetHeader from './DatasetHeader'
import moment from 'moment'

const componentArgs = {
  title: 'Medicare Plan Info Data',
  description: 'A dataset showing all Medicare plan information from CMS.',
  modified: '2021-11-29',
  released: '2021-11-29',
  refresh: '2022-11-29',
  isLoading: false
}

const renderComponent = async (args = componentArgs) => render(
  <DatasetHeader {...args} />
)

describe('DatasetHeader component.', () => {
  it('Matches snapshot.', async () => {
    const renderedDatasetHeader = renderer.create(
      <DatasetHeader {...componentArgs} />
    ).toJSON()

    expect(renderedDatasetHeader).toMatchSnapshot()
  })

  it('Renders all passed prop values.', async () => {
    const { container } = await renderComponent()

    expect(screen.queryByText('Medicare Plan Info Data')).toBeInTheDocument()
    expect(screen.queryByText('A dataset showing all Medicare plan information from CMS.')).toBeInTheDocument()
    expect(container.querySelector('.dataset-date-item:first-child span.dataset-data-item-label').textContent).toBe(`Last Modified: ${moment(componentArgs.modified).format('MMMM D, YYYY')}`)
    expect(container.querySelector('.dataset-date-item:nth-child(3) span.dataset-data-item-label').textContent).toBe(`Released: ${moment(componentArgs.released).format('MMMM D, YYYY')}`)
    expect(container.querySelector('.dataset-date-item:last-child span.dataset-data-item-label').textContent).toBe(`Planned Update: ${moment(componentArgs.refresh).format('MMMM D, YYYY')}`)
  })

  it('Renders the loading component is \'isLoading\' prop is true.', () => {
    renderComponent({
      ...componentArgs,
      isLoading: true
    })

    expect(screen.queryByTestId('DatasetHeaderLoading')).toBeInTheDocument()
  })
})
