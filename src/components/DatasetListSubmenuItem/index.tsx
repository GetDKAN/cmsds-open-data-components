import React from 'react';
import { NavLink } from 'react-router-dom';
import './dataset-list-submenu-item.scss';

type SearchItemProps = {
  title: string;
  identifier: string;
  linkClasses?: string;
}

const DatasetListSubmenuItem = (props: SearchItemProps) => {
  const { title, identifier, linkClasses } = props;

  return (
    <li className="dc-c-list-item" key={identifier}>
      <NavLink
        className={`ds-u-display-flex ds-u-align-items--center ds-u-text-align--left ${linkClasses}`}
        to={`/dataset/${identifier}`}
      >
        <span className="ds-text-heading--md ds-u-margin-left--0">{title}</span>
      </NavLink>
    </li>
  );
};

export default DatasetListSubmenuItem;
