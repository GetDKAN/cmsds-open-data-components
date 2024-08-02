import { CSSProperties } from "react";
import { Choice } from "@cmsgov/design-system";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({id, visible, updateVisibility}: {id: string, visible: boolean, updateVisibility: Function}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: 'white',
  };

  return (
    <li className="ds-u-display--flex ds-u-justify-content--between ds-u-border-bottom--1" ref={setNodeRef} style={style} {...listeners} {...attributes} >
      <Choice
        type="checkbox"
        label={id}
        name={id + "_visibility"}
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