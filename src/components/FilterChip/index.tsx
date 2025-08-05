import React from "react";

import "./FilterChip.scss";

export type FilterChipProps = {
  iconClass: string;
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const FliterChip: React.FC<FilterChipProps> = ({ iconClass, text, onClick }) => {
  return (
    <button className="dkan-filter-chip ds-u-display--flex ds-u-font-size--sm ds-u-align-items--center ds-u-padding-x--1 ds-u-padding-y--05 ds-u-margin--0 ds-u-margin-right--1 ds-u-margin-bottom--1" onClick={onClick}>
      <i className={`${iconClass} ds-u-color--primary ds-u-margin-right--1`} />
      {text}
      <i className="fa fa-xmark ds-u-font-size--sm ds-u-margin-left--1" />
    </button>
  )
}

export default FliterChip;