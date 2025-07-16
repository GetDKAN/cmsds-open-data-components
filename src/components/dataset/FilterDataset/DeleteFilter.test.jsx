import { render, fireEvent, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DeleteButton from './DeleteFilter'

const componentArgs = {
  enabled: false,
  i: 0,
  deleteFilter: vi.fn()
}

describe('DeleteButton component.', () => {
  it('Matches snapshot.', () => {
    const renderedDeleteButton = renderer.create(
      <DeleteButton {...componentArgs} />
    ).toJSON()

    expect(renderedDeleteButton).toMatchSnapshot()
  })

  it('\'deleteFilter\' prop is called when button is clicked.', () => {
    const deleteFilter = vi.fn()
    
    render(
      <DeleteButton
        {...componentArgs}
        enabled={true}
        deleteFilter={deleteFilter}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'delete filter' }))

    expect(deleteFilter).toHaveBeenCalled()
  })
})
