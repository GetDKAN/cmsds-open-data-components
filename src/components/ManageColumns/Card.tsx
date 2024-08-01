import { useRef } from "react";
import { Choice } from "@cmsgov/design-system";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  CARD: 'card'
}

type DragItem = {
  index: number
}

const Card = ({id, visible, updateVisibility, index, moveCard}: {id: string, visible: boolean, updateVisibility: Function, index: number, moveCard: Function}) => {
  const dragRef = useRef<HTMLLIElement>(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover (item: DragItem, monitor) {
      if (!dragRef.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dragRef.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset() || {y: 0};

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
  const opacity = isDragging ? 0 : 1;
  
  drag(drop(dragRef));

  return (
    <li className="ds-u-display--flex ds-u-justify-content--between ds-u-border-bottom--1" style={{opacity}} ref={dragRef}>
      <Choice
        type="checkbox"
        label={id}
        name={id}
        checked={visible}
        className="ds-l-col--10 ds-u-margin-top--0 ds-u-margin-y--1 ds-u-padding-x--3"
        labelClassName="dc-truncate"
        value=""
        onChange={() => {
          updateVisibility(id, !visible)
        }}
      />
      <button className="ds-l-col--2 dkan-manage-columns-reorder-button">
        <span className="fa fa-sort"></span>
      </button>
    </li>
  )
}

export default Card;