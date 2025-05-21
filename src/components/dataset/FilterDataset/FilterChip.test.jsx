import { render, fireEvent, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
import FilterChip from './FilterChip'

const componentArgs = {
  filter: {
    column: 'col4',
    condition: 'is_empty',
    value: ''
  },
  i: 0,
  deleteFilter: vi.fn()
}

const conditions = [
  {
    condition: '=',
    text: 'equals'
  },
  {
    condition: '<>',
    text: 'not equal to'
  },
  {
    condition: '>',
    text: 'greater than'
  },
  {
    condition: '<',
    text: 'less than'
  },
  {
    condition: 'LIKE',
    text: 'contains'
  },
  {
    condition: 'starts with',
    text: 'starts with'
  },
  {
    condition: 'is_empty',
    text: 'is empty'
  },
  {
    condition: 'not_empty',
    text: 'not empty'
  },
  {
    condition: '',
    text: 'contains'
  }
]

describe('FilterChip component.', () => {
  it('Matches snapshot.', () => {
    const renderedFilterChip = renderer.create(
      <FilterChip {...componentArgs} />
    ).toJSON()

    expect(renderedFilterChip).toMatchSnapshot()
  })

  conditions.forEach((condition) => {
    const conditionName = condition.condition === '' ? 'Default \'contains\'' : condition.condition

    it(`'${conditionName}' condition chip is rendered.`, () => {
      const deleteFilter = vi.fn()
      
      render(
        <FilterChip
          {...componentArgs}
          deleteFilter={deleteFilter}
          filter={{
            column: 'col4',
            condition: condition.condition,
            value: condition.condition !== 'is_empty' && condition.condition !== 'not_empty' ? 'test' : ''
          }}
        />
      )
      
      const buttonName = `Remove col4 ${condition.text}${condition.condition !== 'is_empty' && condition.condition !== 'not_empty' ? ' test' : ''} filter`
      
      expect(screen.queryByRole('button', { name: buttonName })).toBeInTheDocument()
  
      fireEvent.click(screen.getByRole('button', { name: buttonName }))
  
      expect(deleteFilter).toHaveBeenCalled()
    })
  })
})
