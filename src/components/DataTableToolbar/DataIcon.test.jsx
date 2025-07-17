import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DataIcon from './DataIcon'

const componentArgs = {
  icon: 'density-1',
  color: '#0C2499',
  width: 50,
  height: 50
}

describe('DataIcon component.', () => {
  it('Matches snapshot.', () => {
    const renderedDataIcon = renderer.create(
      <DataIcon {...componentArgs} />
    ).toJSON()

    expect(renderedDataIcon).toMatchSnapshot()
  })

  it('Renders \'density-2\' icon.', () => {
    const { container } = render(
      <DataIcon
        {...componentArgs}
        icon='density-2'
      />
    )

    expect(container.querySelector('svg.density-2')).toBeInTheDocument()
  })

  it('Renders \'density-3\' icon.', () => {
    const { container } = render(
      <DataIcon
        {...componentArgs}
        icon='density-3'
      />
    )

    expect(container.querySelector('svg.density-3')).toBeInTheDocument()
  })

  it('Renders \'group\' icon.', () => {
    const { container } = render(
      <DataIcon
        {...componentArgs}
        icon='group'
      />
    )

    expect(container.querySelector('svg.group')).toBeInTheDocument()
  })

  it('Renders \'select\' icon.', () => {
    const { container } = render(
      <DataIcon
        {...componentArgs}
        icon='select'
      />
    )

    expect(container.querySelector('svg.select')).toBeInTheDocument()
  })

  it('Renders \'times\' icon.', () => {
    const { container } = render(
      <DataIcon
        {...componentArgs}
        icon='times'
      />
    )

    expect(container.querySelector('svg.times')).toBeInTheDocument()
  })
})
