import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Alert, Button, Choice, Dialog } from '@cmsgov/design-system'
import ManageColumnsCard from './ManageColumnsCard'
import isEqual from 'lodash.isequal'

import './ManageColumns.scss'

const Card = ({id, visible}) => {
  return (
    <li className="ds-u-display--flex ds-u-justify-content--between ds-u-border-bottom--1">
      <Choice
        type="checkbox"
        label={id}
        name={id}
        checked={visible}
        className="ds-u-margin-top--0 ds-u-margin-bottom--1"
        //todo on change change card state
      />
      <button className="ds-l-col--1 dkan-manage-columns-reorder-button">
        <span className="fa fa-sort"></span>
      </button>
    </li>
  )
}

const ManageColumns = ({ columns, columnOrder }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState()
  
  const [cards, setCards] = useState(columns.map(c => {
    return {id: c.id, visible: c.getIsVisible()}
  }));

  const hiddenColumns = columns.filter(c => c.getIsVisible() === false ).length;

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
        > Manage Columns </button>
      </div>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
        heading='Manage columns'
          isOpen={modalOpen}
          onExit={() => setModalOpen(false)}
          className="dkan-manage-columns-dialog"
          actions={(
            <div className='ds-u-display--flex ds-u-justify-content--between'>
              <div>
                <Button
                variation="solid"
                onClick={() => setModalOpen(false)}
                  // disabled={checkedLength === 0} todo
                >
                  Save
                </Button>
                <Button
                  variation="ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
              <Button variation="ghost">
                Reset Columns
              </Button>
            </div>
          )}
        >
          <p id='reorder-help'>Activate the reorder button and use the arrow keys to reorder the list or use your mouse to drag/reorder. Press escape to cancel the reordering.</p>
          <Choice
            checked={true} // todo
            type='checkbox'
            // onChange={handleSelectAllChangeClick} todo
            name=''
            value=''
            label='Select all'
          />
          <div className='ds-u-display--flex ds-u-justify-content--between ds-u-font-weight--bold ds-u-padding-y--2 ds-u-border-y--1 ds-u-margin-top--2 ds-u-margin-bottom--1'>
            <span>Display column</span>
            <span>Reorder</span>
          </div>
          <ul className="dkan-manage-columns-list">
            {cards.map((card) => {
              return (
                <Card id={card.id} visible={card.visible} key={card.id} />
              )
            })}
          </ul>
        </Dialog>
      </div>
    </>
  )
}

export default ManageColumns
