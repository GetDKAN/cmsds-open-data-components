import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import ToggleBlock from './ToggleBlock'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import ReactDOMServer from 'react-dom/server'

const componentArgs = {
  customId: '',
  title: 'Donec eu libero sit amet quam egestas semper?',
  children: (
    <div>
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
    </div>
  ),
  headingClasses: 'toggle-block-title',
  innerClasses: 'toggle-block-inner',
  allowToggle: true,
  className: 'toggle-block',
  defaultClosed: false
}

const renderComponent = (args = componentArgs) => render(
  <ToggleBlock {...args} />
)

describe('ToggleBlock component.', () => {
  it('Matches snapshot.', () => {
    const renderedToggleBlock = renderer.create(
      <ToggleBlock {...componentArgs} />
    ).toJSON()

    expect(renderedToggleBlock).toMatchSnapshot()
  })

  it('Renders toggle header if \'allowToggle\' prop is \'true\'.', () => {
    const { container } = renderComponent()

    expect(container.querySelector('.toggle-block-title')).toBeInTheDocument()
    expect(container.querySelector('.toggle-block-title').textContent).toEqual(componentArgs.title)
  })

  it('Does not render toggle header if \'allowToggle\' prop is \'false\'.', () => {
    const { container } = renderComponent({
      ...componentArgs,
      allowToggle: false
    })

    expect(container.querySelector('.toggle-block-title > button')).toBeNull()
  })

  it('Renders toggle panel open if \'defaultClosed\' prop is \'false\'.', () => {
    const { container } = renderComponent()

    expect(container.querySelector('.toggle-block-inner')).toHaveClass('open')
    expect(container.querySelector('.toggle-block-inner').innerHTML).toEqual(ReactDOMServer.renderToStaticMarkup(componentArgs.children))
  })

  it('Renders toggle panel closed if \'defaultClosed\' prop is \'true\'.', () => {
    const { container } = renderComponent({
      ...componentArgs,
      defaultClosed: true
    })

    expect(container.querySelector('.toggle-block-inner')).toHaveClass('closed')
  })

  it('Toggle panel opens and closes when header button is clicked.', async () => {
    const toggleCallback = vi.fn()

    const { container } = renderComponent({
      ...componentArgs,
      toggleCallback: toggleCallback()
    })

    // Panel rendered open initially
    expect(container.querySelector('.toggle-block-title > button').getAttribute('aria-expanded')).toEqual('true')

    // Click to close panel
    await waitFor(() => userEvent.click(container.querySelector('.toggle-block-title > button')))

    // Make assertions
    expect(toggleCallback).toHaveBeenCalled()
    expect(container.querySelector('.toggle-block-inner')).toHaveClass('closed')
    expect(container.querySelector('.toggle-block-title > button').getAttribute('aria-expanded')).toEqual('false')

    // Click to open panel
    await waitFor(() => userEvent.click(container.querySelector('.toggle-block-title > button')))

    // Make assertions
    expect(toggleCallback).toHaveBeenCalled()
    expect(container.querySelector('.toggle-block-inner')).toHaveClass('open')
    expect(container.querySelector('.toggle-block-inner').innerHTML).toEqual(ReactDOMServer.renderToStaticMarkup(componentArgs.children))
    expect(container.querySelector('.toggle-block-title > button').getAttribute('aria-expanded')).toEqual('true')
  })
})
