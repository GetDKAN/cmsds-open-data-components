import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Choice, Dialog } from '@cmsgov/design-system'
import ManageColumnsCard from './ManageColumnsCard'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'
import DataHeaderButton from '../DataTableHeader/DataHeaderButton'
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext'
import isEqual from 'lodash/isEqual'
import Tooltip from '../../common/Tooltip/Tooltip'

import './ManageColumns.scss'

const defaultCard = (card, index, moveCard, cards, setCards, cardGrabbed, setCardGrabbed, setAriaLiveFeedback) => {
  const grabbedCards = cardGrabbed.filter(item => item.id === card.id)
  let grabbedCard = null

  if (grabbedCards.length > 0) {
    grabbedCard = grabbedCards[0]
  }

  if (grabbedCard) {
    return (
      <ManageColumnsCard
        key={card.id}
        index={index}
        id={card.id}
        column={card}
        moveCard={moveCard}
      >
        <Choice
          id={card.id}
          type='checkbox'
          {...card.getToggleHiddenProps()}
          checked={card.checked}
          onChange={() => {
            const updatedCards = cards.map((c) => {
              if (c.id === card.id) {
                return {
                  ...c,
                  checked: !card.checked
                }
              } else {
                return c
              }
            })

            setCards(updatedCards)
          }}
          name={card.Header}
          label={card.Header}
          value=''
        />
        <button
          className={`manage-columns-reorder${grabbedCard.grabbed ? ' grabbed' : ''}`}
          type='button'
          aria-describedby="reorder-help"
          aria-label={`Reorder ${grabbedCard.header} column`}
          onClick={(e) => {
            e.preventDefault()
          }}
          onKeyDown={(e) => {
            const listParent = e.currentTarget.closest('ul.advanced-options')
            const listItem = e.currentTarget.closest('li')
            const thisIndex = Array.from(listParent.children).indexOf(listItem)
            const previousIndex = (index - 1 < 0) ? listParent.children.length - 1 : index - 1
            const nextIndex = (index + 1 > listParent.children.length - 1) ? 0 : index + 1

            switch (e.key) {
              case 'Enter':
              case ' ':
                e.preventDefault()
                e.stopPropagation()

                setCardGrabbed(cardGrabbed.map((item) => item.id === card.id ? { ...item, grabbed: !item.grabbed } : item))
                setAriaLiveFeedback(`${grabbedCard.header} ${!grabbedCard.grabbed ? 'grabbed' : 'dropped'}`)
                break

              case 'Escape':
                if (grabbedCard.grabbed) {
                  e.preventDefault()
                  e.stopPropagation()

                  setCardGrabbed(cardGrabbed.map((item) => item.id === card.id ? { ...item, grabbed: false } : item))
                  setAriaLiveFeedback(`${grabbedCard.header} dropped`)
                }
                break

              case 'ArrowUp':
                if (grabbedCard.grabbed) {
                  e.preventDefault()
                  e.stopPropagation()

                  moveCard(thisIndex, previousIndex)
                  setAriaLiveFeedback(`The rankings have been updated, ${grabbedCard.header} is now ranked ${previousIndex + 1} of ${listParent.children.length}`)
                }
                break

              case 'ArrowDown':
                if (grabbedCard.grabbed) {
                  e.preventDefault()
                  e.stopPropagation()

                  moveCard(thisIndex, nextIndex)
                  setAriaLiveFeedback(`The rankings have been updated, ${grabbedCard.header} is now ranked ${nextIndex + 1} of ${listParent.children.length}`)
                }
                break
            }
          }}
          onBlur={() => {
            setCardGrabbed(cardGrabbed.map((item) => ({ ...item, grabbed: false })))
          }}
        >
          <FontAwesomePro icon='sort' customClass='manage-columns-reorder-icon' />
        </button>
      </ManageColumnsCard>
    )
  }

  return null
}

const ManageColumns = ({ datasetTitle, showTooltip, fullscreen = false }) => {
  const { filteredTable, initOrder, setCurOrder, setVisCol } = useContext(FilteredDispatch)
  const [cards, setCards] = useState([])
  const [cardGrabbed, setCardGrabbed] = useState([])
  const [modalOpen, toggleModal] = useState(false)
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState()

  const cardsInitOrder = initOrder.map((card) => Object.assign({}, card))
  cardsInitOrder.forEach((card) => {
    card.checked = true
  })

  const {
    allColumns,
    setColumnOrder
  } = filteredTable

  const hiddenColumns = filteredTable.state.hiddenColumns
  const globalOrder = filteredTable.state.columnOrder
  // update order of cards based on global state
  useEffect(() => {
    if (globalOrder.length === 0) {
      setCards(cardsInitOrder)
    } else {
      setCards((prevCards) => {
        const copyCards = prevCards.slice()
        const orderedCards = copyCards.sort((a, b) => globalOrder.indexOf(a.id) - globalOrder.indexOf(b.id))
        return orderedCards
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalOrder])

  useEffect(() => {
    if (cards.length && !cardGrabbed.length) {
      setCardGrabbed(cards.map(card => ({
        id: card.id,
        header: card.Header,
        grabbed: false
      })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])

  const checkAll = (bool) => {
    const updatedCards = cardsInitOrder.map((card) => Object.assign({}, card))
    updatedCards.forEach((card) => {
      card.checked = bool
    })

    setCards(updatedCards)
  }
  const handleSelectAllChangeClick = () => {
    if (initOrderLength === checkedLength) {
      checkAll(false)
    } else {
      checkAll(true)
    }
  }
  // update all our columns to checked upon initalization.
  useEffect(() => {
    if (cardsInitOrder.length) {
      const updatedCards = cardsInitOrder.map((card) => Object.assign({}, card))
      updatedCards.forEach((card) => {
        card.checked = true
      })

      setCards(updatedCards)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsInitOrder.length])

  // update our checked upon state change
  useEffect(() => {
    if (filteredTable.allColumns.length) {
      const filteredColumns = []
      filteredTable.allColumns.forEach((col) => {
        filteredColumns.push(col.id)
      })

      const updatedCards = cardsInitOrder.map((card) => Object.assign({}, card))
      updatedCards.forEach((card) => {
        if (filteredColumns.includes(card.id)) {
          card.checked = true
        } else {
          card.checked = false
        }
      })

      setCards(updatedCards)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTable.allColumns.length])

  const initOrderLength = cardsInitOrder.length
  const checkedLength = cards.reduce((acc, cur) => {
    if (cur.checked) {
      acc += 1
    }
    return acc
  }, 0)
  // initialize cards as local state to track changes before submission
  useEffect(() => {
    if (initOrderLength && cards.length === 0) {
      setCards(cardsInitOrder)
    }
  }, [cardsInitOrder, initOrderLength, cards])

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex]
      const newCards = update(cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      })
      setCards(newCards)
    },
    [cards, setCards]
  )

  const handleSubmit = () => {
    const currentOrder = allColumns.map((c) => c.id)
    const newOrder = cards.map((d) => d.id)
    setCurOrder(newOrder)
    if (!isEqual(currentOrder, newOrder)) {
      setColumnOrder(cards.map((d) => d.id))
    }
    const newVisCol = cards.filter((card) => card.checked === true).map((item) => {
      return item.id
    })
    setVisCol(newVisCol)
    toggleModal(false)
  }

  const manageColClass = () => {
    const sm = 4
    const md = 8
    const lg = 12
    let colHelper = 'manage-col-'
    // 4 & below
    if (initOrderLength <= sm) {
      colHelper = colHelper + 'sm'
      // 5 - 8
    } else if (initOrderLength > sm && initOrderLength <= md) {
      colHelper = colHelper + 'md'
      // 9 - 12
    } else if (initOrderLength > md && initOrderLength <= lg) {
      colHelper = colHelper + 'lg'
      // 13 & above
    } else /* istanbul ignore else */ if (initOrderLength > lg) {
      colHelper = colHelper + 'xl'
    }
    return colHelper
  }

  const resetFeedbackTimer = useRef(undefined)

  const resetFeedback = () => {
    if (resetFeedbackTimer.current) {
      clearTimeout(resetFeedbackTimer.current)
    }

    resetFeedbackTimer.current = setTimeout(() => {
      setAriaLiveFeedback('')
    }, 5000)
  }

  useEffect(() => {
    if (ariaLiveFeedback) {
      resetFeedback()
    }
  }, [ariaLiveFeedback])

  return (
    <div className='table-control-item manage-columns-button-container'>
      <Tooltip tooltip='Manage columns' position='top' trigger='hover' show={showTooltip}>
        <DataHeaderButton
          ariaLabel='Manage columns - Opens in a dialog'
          icon='columns'
          text='Manage columns'
          click={() => {
            toggleModal(!modalOpen)
          }}
        />
      </Tooltip>

      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
          isOpen={modalOpen}
          heading='Manage columns'
          className={`manage-col-dialog ${manageColClass()}`}
          onExit={() => {
            toggleModal(false)
          }}
          ariaCloseLabel='Close manage columns dialog'
          actions={(
            <div className='manage-col-dialog-actions'>
              <Choice
                checked={checkedLength === initOrderLength}
                type='checkbox'
                onChange={handleSelectAllChangeClick}
                className={cx('select-all-choice', {
                  'ds-c-choice--partial': hiddenColumns.length > 0
                })}
                name=''
                value=''
                label='Select all'
              />
              <button
                className='btn blueberry'
                key='primary'
                onClick={() => {
                  handleSubmit()
                }}
                disabled={checkedLength === 0}
              >
                Update columns
              </button>
            </div>
          )}
        >
          <div className='column-labels'>
            <span>Display column</span>
            <span>Reorder</span>
          </div>
          <p id='reorder-help'>Activate the reorder button and use the arrow keys to reorder the list or use your mouse to drag/reorder. Press escape to cancel the reordering.</p>
          <ul className='advanced-options'>
            <DndProvider backend={HTML5Backend}>
              {cards &&
                cards.map((column, i) => {
                  return defaultCard(column, i, moveCard, cards, setCards, cardGrabbed, setCardGrabbed, setAriaLiveFeedback)
                })}
            </DndProvider>
          </ul>
          <div className='sr-only aria-live-feedback' aria-live='assertive' aria-atomic='true'>{ariaLiveFeedback}</div>
        </Dialog>
      </div>
    </div>
  )
}

ManageColumns.propTypes = {
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * `true` shows mobile helper tooltips for button
   */
  showTooltip: PropTypes.bool,
  /**
   * Used when in fullscreen mode
   */
  fullscreen: PropTypes.bool
}

ManageColumns.displayName = 'ManageColumns'
export default ManageColumns
