import { render } from '@testing-library/react'
import ManageColumnsCard from './ManageColumnsCard'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Choice } from '@cmsgov/design-system'

/*
  We can't fully test this components included logic because DndProvider actually lives in ManageColumns.js 
  and this component only yields a single card and we'd need the full DnD list in order to test all functionality.
  We have unit tests for ManageColumns.js that test reordering the DnD list.
*/

const mockMoveCard = vi.fn()
const componentArgs = {
  id: 'col1',
  index: 0,
  children: (
    <>
      <Choice
        id='col1'
        type='checkbox'
        checked
        name='col1'
        value=''
        label='col1'
      />
      <div className='manage-columns-reorder'>
        <FontAwesomePro icon='sort' customClass='manage-columns-reorder-icon' />
      </div>
    </>
  ),
  moveCard: mockMoveCard
}

const renderComponent = (args = componentArgs) => render (
  <DndProvider backend={HTML5Backend}>
    <ManageColumnsCard {...args} />
  </DndProvider>
)

describe('ManageColumnsCard component.', () => {
  it('Matches snapshot.', () => {
    const renderedManageColumnsCard = renderComponent()

    expect(renderedManageColumnsCard.asFragment()).toMatchSnapshot()
  })
})
