import React, { useCallback, useState,} from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Alert, Button, Choice, Dialog } from '@cmsgov/design-system'
import Card from './Card'

import './ManageColumns.scss'

const ManageColumns = ({ columns, defaultColumnOrder, setColumnOrder, setColumnVisibility }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState();

  // maintain card state separately from table state - only sync states when the Save button is pressed
  const [cards, setCards] = useState(columns.map(c => {
    return {id: c.id, visible: c.getIsVisible()}
  }));

  const hiddenColumns = columns.filter(c => c.getIsVisible() === false ).length;
  const cardHiddenColumns = cards.filter(c => c.visible === false).length

  const updateVisibility = useCallback((id, newVisibility) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        return {...card, visible: newVisibility}
      }
      return card;
    }))
  });

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = JSON.parse(JSON.stringify(cards[dragIndex]));
      const newCards = cards.toSpliced(dragIndex, 1).toSpliced(hoverIndex, 0, dragCard);
      setCards(newCards);
    },
    [cards, setCards]
  )

  return (
    <>
      <div className='ds-u-border-top--1 ds-u-fill--gray-lightest ds-u-display--flex ds-u-justify-content--between'>
        <div>
          {hiddenColumns > 0 && (
            <Alert variation="warn">{hiddenColumns} Columns Hidden</Alert>
          )}
        </div>
        <button
          aria-label='Manage columns - Opens in a dialog'
          icon='columns'
          text='Manage columns'
          className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
          onClick={() => {
            setModalOpen(true)
          }}
        ><i className="far fa-cog ds-u-margin-right--1"></i>Manage Columns</button>
      </div>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
        heading='Manage columns'
          isOpen={modalOpen}
          onExit={() => setModalOpen(false)}
          className="dkan-manage-columns-dialog"
          actions={(
            <div className='ds-u-display--flex ds-u-justify-content--between ds-u-padding-x--3 ds-u-padding-bottom--3'>
              <div>
                <Button
                variation="solid"
                onClick={() => {
                  setModalOpen(false);
                  // update table state

                  // Visibility
                  // this isn't very performant when there are many changes - is there a better way?
                  // This code is building a new columnVisibility state object from the card state and doing a single setState on the table
                  // vs doing a setState on every changed column individually
                  const newColumnVisibility = Object.fromEntries(cards.map(c => Object.values(c)));
                  setColumnVisibility(newColumnVisibility);

                  // Card order
                  const newCardOrder = cards.map(c => {
                    return c.id;
                  });
                  setColumnOrder(newCardOrder);
                  
                }}
                  // disabled={checkedLength === 0} todo
                >
                  Save
                </Button>
                <Button
                  variation="ghost"
                  onClick={() => {
                    setModalOpen(false)
                    setCards(columns.map(c => {
                      return {id: c.id, visible: c.getIsVisible()}
                    }));
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Button
                variation="ghost"
                onClick={() => {
                  // reset to default column order and set all cards to visible
                  // do not save this to the table state until the "Save" button is clicked
                  setCards(defaultColumnOrder.map(column => {
                    const card = cards.filter(c => c.id === column)[0]
                    return {...card, visible: true }
                  }));
                }}
              >
                Reset Columns
              </Button>
            </div>
          )}
        >
          <p id='reorder-help' className='ds-u-padding-x--3'>Activate the reorder button and use the arrow keys to reorder the list or use your mouse to drag/reorder. Press escape to cancel the reordering.</p>
          <Choice
            checked={cardHiddenColumns === 0}
            type='checkbox'
            onChange={() => {
              setCards(cards.map(c => {
                return {...c, visible: cardHiddenColumns !== 0}
              }))
            }}
            className='ds-u-padding-x--3'
            name=''
            value=''
            label='Select all'
          />
          <div className='ds-u-display--flex ds-u-justify-content--between ds-u-font-weight--bold ds-u-padding-y--2 ds-u-padding-x--3 ds-u-border-y--1 ds-u-margin-top--2'>
            <span>Display column</span>
            <span>Reorder</span>
          </div>
          <DndProvider backend={HTML5Backend}>
            <ul className="dkan-manage-columns-list">
              {cards.map((card, i) => {
                return (
                  <Card id={card.id} visible={card.visible} key={card.id} updateVisibility={updateVisibility} index={i} moveCard={moveCard} />
                )
              })}
            </ul>
          </DndProvider>
        </Dialog>
      </div>
    </>
  )
}

export default ManageColumns
