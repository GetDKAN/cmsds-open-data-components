import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import Tooltip from './Tooltip'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

const componentArgs = {
  tooltip: 'Tooltip',
  show: true,
  hideArrow: false,
  children: (
    <div style={{ display: 'inline-block' }}>
      <span>Hover over me</span>
    </div>
  )
}

const renderComponent = (args = componentArgs) => render(
  <Tooltip {...args} />
)

describe('Tooltip component.', () => {
  it('Matches snapshot.', () => {
    const renderedTooltip = renderer.create(
      <Tooltip {...componentArgs} />
    ).toJSON()

    expect(renderedTooltip).toMatchSnapshot()
  })

  it('Renders tooltip when \'show\' prop is \'true\'.', async () => {
    renderComponent()

    // Ensure trigger exists
    expect(screen.queryByText('Hover over me')).toBeInTheDocument()

    // Trigger tooltip
    await waitFor(() => userEvent.hover(screen.getByText('Hover over me')))

    // Ensure tooltip shows
    expect(screen.queryByText(componentArgs.tooltip)).toBeInTheDocument()
  })

  it('Does not render tooltip when \'show\' prop is \'false\'.', async () => {
    renderComponent({
      ...componentArgs,
      show: false
    })

    // Ensure trigger exists
    expect(screen.queryByText('Hover over me')).toBeInTheDocument()

    // Trigger tooltip
    await waitFor(() => userEvent.hover(screen.getByText('Hover over me')))

    // Ensure tooltip does not show
    expect(screen.queryByText(componentArgs.tooltip)).not.toBeInTheDocument()
  })

  it('Tooltip shows when triggered.', async () => {
    renderComponent()

    await waitFor(() => userEvent.hover(screen.getByText('Hover over me')))

    expect(screen.queryByText(componentArgs.tooltip)).toBeInTheDocument()
  })
})
