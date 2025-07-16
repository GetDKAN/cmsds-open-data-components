import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import FontAwesomePro from './FontAwesomePro'

describe('FontAwesomePro component.', () => {
  it('Matches snapshot.', () => {
    const renderedFontAwesomePro = renderer.create(
      <FontAwesomePro icon='info-circle' />
    ).toJSON()

    expect(renderedFontAwesomePro).toMatchSnapshot()
  })

  it('Renders the custom fill if provided via props.', () => {
    const { container } = render(<FontAwesomePro icon='info-circle' fill='#990000' />)

    expect(container.querySelector('path').getAttribute('fill')).toEqual('#990000')
  })
})