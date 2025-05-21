import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DataHeaderButton from './DataHeaderButton'

describe('DataHeaderButton component.', () => {
  it('Matches snapshot.', () => {
    const renderedDataHeaderButton = renderer.create(
      <DataHeaderButton
        ariaLabel='Filter dataset'
        text='Filter dataset'
        icon='filter'
        click={() => {}}
      />
    ).toJSON()

    expect(renderedDataHeaderButton).toMatchSnapshot()
  })

  it('Renders with active class if \'active\' prop is true.', () => {
    const { container } = render(
      <DataHeaderButton
        ariaLabel='Filter dataset'
        text='Filter dataset'
        icon='filter'
        active={true}
        click={() => {}}
      />
    )

    expect(container.querySelector('.dataset-button')).toHaveClass('active')
  })

  it('Renders secondary icon if \'secondary\' prop is passed.', () => {
    const { container } = render(
      <DataHeaderButton
        ariaLabel='Filter dataset'
        text='Filter dataset'
        icon='filter'
        secondary='chevron-right'
        click={() => {}}
      />
    )

    expect(container.querySelector('svg[aria-label="chevron right"]')).toBeInTheDocument()
  })
})
