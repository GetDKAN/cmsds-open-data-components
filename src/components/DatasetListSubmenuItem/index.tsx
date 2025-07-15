import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import './dataset-list-submenu-item.scss';

type SearchItemProps = {
  title: string;
  identifier: string;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
}

const DatasetListSubmenuItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, identifier, paginationEnabled, dataDictionaryLinks } = props;

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
    <li className="dc-c-list-item">
      <div className={`dc-c-searchlist-item`}>
        <Link className="ds-c-button ds-c-button--ghost ds-u-text-align--left" to={`/dataset/${identifier}`}>
          <h2 className="ds-text-heading--md">{title}</h2>
        </Link>
      </div>
    </li>
  );
};

export default DatasetListSubmenuItem;
