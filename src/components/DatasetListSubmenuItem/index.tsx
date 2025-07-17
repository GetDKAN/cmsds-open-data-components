import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import './dataset-list-submenu-item.scss';

type SearchItemProps = {
  title: string;
  identifier: string;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
}

const DatasetListSubmenuItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, identifier, dataDictionaryLinks } = props;

  let linkContainerClasses = 'ds-u-margin-bottom--2';
  if (dataDictionaryLinks) {
    linkContainerClasses += ' ds-l-col--6 ds-u-padding-right--0';
  } else {
    linkContainerClasses += ' ds-l-col--auto ds-u-padding-left--0';
  }
  let linkClasses = 'ds-u-display--block ds-u-text-align--left';
  if (desktop) {
    linkContainerClasses = 'ds-u-padding-x--0';
    linkClasses += ' ds-l-col--4 ds-l-md-col--auto';
  }

  return (
    <li className="dc-c-list-item" key={identifier}>
      <div className={`dc-c-searchlist-item`}>
        <NavLink
          className="ds-c-button ds-c-button--ghost ds-u-text-align--left dkan-c-header--link ds-u-padding-x--0 ds-u-margin-left--0"
          to={`/dataset/${identifier}`}
        >
          <span className="ds-text-heading--md ds-u-margin-left--0">{title}</span>
        </NavLink>
      </div>
    </li>
  );
};

export default DatasetListSubmenuItem;
