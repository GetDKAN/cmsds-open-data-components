import { render, fireEvent, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import AddFilter from './AddFilter'

describe('AddFilter component.', () => {
  it('Matches snapshot.', () => {
    const renderedAddFilter = renderer.create(
      <AddFilter addFilter={() => {}} />
    ).toJSON()

    expect(renderedAddFilter).toMatchSnapshot()
  })

  it('\'addFilter\' prop is called when button is clicked.', () => {
    const addFilter = vi.fn()
    
    render(
      <AddFilter addFilter={addFilter} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add filter' }))

    expect(addFilter).toHaveBeenCalled()
  })
})
