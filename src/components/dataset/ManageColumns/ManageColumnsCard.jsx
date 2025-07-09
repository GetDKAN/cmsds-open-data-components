import React from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'

const ItemTypes = {
  CARD: 'card'
}

const ManageColumnsCard = ({ id, index, moveCard, children }) => {
  const ref = React.useRef(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover (item, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item: { id, index },
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  drag(drop(ref))

  return (
    <li key={id} ref={ref} style={{ opacity }}>
      {children}
    </li>
  )
}

ManageColumnsCard.propTypes = {
  /**
   * Used for `key` attribute on wrapping element
   */
  id: PropTypes.string.isRequired,
  /**
   * Index ID used for drag/drop logic
   */
  index: PropTypes.number.isRequired,
  /**
   * Child elements inside drag/drop element
   */
  children: PropTypes.node.isRequired,
  /**
   * Callback function fired when item is moved.
   * `dragIndex` and `hoverIndex` are passed as arguments
   */
  moveCard: PropTypes.func.isRequired
}

ManageColumnsCard.displayName = 'ManageColumnsCard'
export default ManageColumnsCard
