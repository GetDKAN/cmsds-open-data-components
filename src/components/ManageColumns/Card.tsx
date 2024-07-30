import { Choice } from "@cmsgov/design-system"

const Card = ({id, visible, updateVisibility}: {id: string, visible: boolean, updateVisibility: Function}) => {
  return (
    <li className="ds-u-display--flex ds-u-justify-content--between ds-u-border-bottom--1">
      <Choice
        type="checkbox"
        label={id}
        name={id}
        checked={visible}
        className="ds-u-margin-top--0 ds-u-margin-y--1 ds-u-padding-x--3"
        value=""
        onChange={() => {
          updateVisibility(id, !visible)
        }}
      />
      <button className="ds-l-col--1 dkan-manage-columns-reorder-button">
        <span className="fa fa-sort"></span>
      </button>
    </li>
  )
}

export default Card;