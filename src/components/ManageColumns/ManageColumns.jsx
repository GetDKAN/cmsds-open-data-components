import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Button, Choice, Dialog } from '@cmsgov/design-system'
import Card from './Card'
import { DataTableActionsContext } from '../DatasetTableTab/DataTableActionsContext'
import './ManageColumns.scss'

class ExcludeCheckboxKeyboardSensor extends KeyboardSensor {
  // Custom function to exclude checkbox from keyboard dragging
  static activators = [
    {
      eventName: 'onKeyDown',
      handler: ({nativeEvent: event}) => {
        // prevent scrolling the list
        const isCheckbox = ["input", "checkbox"].indexOf(event.target.tagName.toLowerCase()) !== -1;
        if(event.key === " " && !isCheckbox){ 
          event.preventDefault();
        } 

        // only activate on a space or return press
        if ([" ", "Enter"].indexOf(event.key) === -1) return false;
        if (!isCheckbox)
        {
          return true;
        }
        return false;
      },
    },
  ];
}

class ExcludeCheckboxPointerSensor extends PointerSensor {
  // Custom function to stop accidental checkbox clicks on pointer activation
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({nativeEvent: event}) => {
        if (event.target.tagName.toLowerCase() === "input") return false;
        if (event.target.tagName.toLowerCase() === "label") {
          event.target.blur();
        }
        return true;
      }
    }
  ]
}

const ManageColumns = ({
  id,
  columns,
  defaultColumnOrder
}) => {
  const {columnOrder, setColumnOrder, setColumnVisibility, columnVisibility} = useContext(DataTableActionsContext);
  const [modalOpen, setModalOpen] = useState(false);
  // maintain card state separately from table state - only sync states when the Save button is pressed
  const [cards, setCards] = useState(columns.map(c => {
    return {id: c.id, visible: c.getIsVisible()}
  }));
  const cardOrder = useMemo(() => 
    cards.map(({id}) => id),
    [cards]
  );

  // keep state in sync
  useEffect(() => {
    if (columnOrder.length)
      setCards(columnOrder.map(c => {
        const column = columns.filter(col => col.id === c)[0];
        return {id: column.id, visible: column.getIsVisible()}
      }))
  }, [columnOrder])

  const sensors = useSensors(
    useSensor(ExcludeCheckboxPointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(ExcludeCheckboxKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const cardHiddenColumns = cards.filter(c => c.visible === false).length

  const updateVisibility = useCallback((id, newVisibility) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        return {...card, visible: newVisibility}
      }
      return card;
    }))
  });

  function handleDragEnd(e) {
    const { active, over } = e;
    if (active.id !== over.id) {
      const oldIndex = cardOrder.indexOf(active.id);
      const newIndex = cardOrder.indexOf(over.id);
      let newCards = arrayMove(cards, oldIndex, newIndex);
      setCards(newCards);
    }
  }

  const resetCards = () => {
    setCards(columns.map(c => {
      return {id: c.id, visible: c.getIsVisible()}
    }));
  }

  const hiddenColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key] === false).length;

  return (
    <div className="dkan-manage-columns-wrapper">
      <button
        aria-label='Manage columns - Opens in a dialog'
        className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent"
        onClick={() => {
          setModalOpen(true)
        }}
      >
        <i className="fa fa-columns ds-u-margin-right--1"></i>
        Manage Columns {hiddenColumns ? `(${hiddenColumns})` : ''}
      </button>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
        heading='Manage columns'
          isOpen={modalOpen}
          onExit={() => {
            setModalOpen(false);
            resetCards();
          }}
          className="dkan-manage-columns-dialog"
          actions={(
            <div className='ds-u-display--flex ds-u-justify-content--between ds-u-flex-wrap--wrap ds-u-padding-x--3 ds-u-padding-bottom--1 ds-u-sm-padding-bottom--3'>
              <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0">
                <Button
                variation="solid"
                className="ds-l-col--6 ds-l-sm-col--auto"
                onClick={() => {
                  setModalOpen(false);
                  // update table state

                  // Visibility
                  // This code is building a new columnVisibility state object from the card state and doing a single setState on the table
                  // vs doing a setState on every changed column individually
                  const newColumnVisibility = Object.fromEntries(cards.map(c => Object.values(c)));
                  setColumnVisibility(newColumnVisibility);

                  // Card order
                  const newCardOrder = cards.map(c => {
                    return c.id;
                  });
                  setColumnOrder(newCardOrder);

                  // save to localStorage
                  const localStorageData = {
                    tableColumnOrder: newCardOrder,
                    tableColumnVisibility: newColumnVisibility
                  }
                  localStorage.setItem(id, JSON.stringify(localStorageData))
                }}
                >
                  Save
                </Button>
                <Button
                  variation="ghost"
                  className="ds-l-col--6 ds-l-sm-col--auto"
                  onClick={() => {
                    setModalOpen(false)
                    resetCards();
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="ds-l-col--12 ds-l-sm-col--auto ds-u-padding-x--0 ds-u-padding-top--1 ds-u-sm-padding-y--0">
                <Button
                  variation="ghost"
                  className="ds-l-col--6 ds-l-sm-col--auto"
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
            hint={cardHiddenColumns && cardHiddenColumns + " columns hidden"}
          />
          <div className='ds-u-display--flex ds-u-justify-content--between ds-u-font-weight--bold ds-u-padding-y--2 ds-u-padding-x--3 ds-u-border-y--1 ds-u-margin-top--2'>
            <span>Display column</span>
            <span>Reorder</span>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
              <ul className="dkan-manage-columns-list">
                {cards.map((card) => {
                  return (
                    <Card id={card.id} visible={card.visible} key={card.id} updateVisibility={updateVisibility} />
                  )
                })}
              </ul>
            </SortableContext>
          </DndContext>
        </Dialog>
      </div>
    </div>
  )
};

export default ManageColumns;
