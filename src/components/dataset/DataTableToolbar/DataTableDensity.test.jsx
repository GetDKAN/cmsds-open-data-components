import { render, fireEvent } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DataTableDensity from './DataTableDensity'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'

const componentArgs = {
  title: 'Display Density',
  items: [
    {
      icon: (
        <FontAwesomePro icon='density-1' aria-hidden />
      ),
      text: 'Expanded',
      value: 'density-1'
    },
    {
      icon: (
        <FontAwesomePro icon='density-2' aria-hidden />
      ),
      text: 'Normal',
      value: 'density-2'
    },
    {
      icon: (
        <FontAwesomePro icon='density-3' aria-hidden />
      ),
      text: 'Compact',
      value: 'density-3'
    }
  ],
  densityChange: vi.fn(),
  screenReaderClass: 'sr-only sr-only-focusable',
  className: 'data-table-density',
  active: 'Normal'
}

describe('DataTableDensity component.', () => {
  it('Matches snapshot.', () => {
    const renderedDataTableDensity = renderer.create(
      <DataTableDensity {...componentArgs} />
    ).toJSON()

    expect(renderedDataTableDensity).toMatchSnapshot()
  })

  it('\'densityChange\' prop is called when buttons are clicked.', () => {
    const densityChange = vi.fn()

    const { container } = render(
      <DataTableDensity
        {...componentArgs}
        densityChange={densityChange}
      />
    )

    componentArgs.items.forEach((button) => {
      fireEvent.click(container.querySelector(`button[aria-label*="${componentArgs.title}, ${button.text}"]`))
      expect(densityChange).toHaveBeenCalled()

      fireEvent.mouseUp(container.querySelector(`button[aria-label*="${componentArgs.title}, ${button.text}"]`))
      expect(densityChange).toHaveBeenCalled()

      fireEvent.touchEnd(container.querySelector(`button[aria-label*="${componentArgs.title}, ${button.text}"]`))
      expect(densityChange).toHaveBeenCalled()
    })
  })

  it('Screen reader class is not applied when buttons aren\'t provided with icons.', () => {
    const { container } = render(
      <DataTableDensity
        {...componentArgs}
        items={[
          {
            text: 'Expanded',
            value: 'density-1'
          },
          {
            text: 'Normal',
            value: 'density-2'
          },
          {
            text: 'Compact',
            value: 'density-3'
          }
        ]}
      />
    )

    componentArgs.items.forEach((button) => {
      expect(container.querySelector(`button[aria-label*="${componentArgs.title}, ${button.text}"] > span`)).not.toHaveClass(componentArgs.screenReaderClass)
    })
  })
})
