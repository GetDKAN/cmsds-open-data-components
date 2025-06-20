import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import './dataset-list-item.scss';

type SearchItemProps = {
  title: string;
  identifier: string;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
}

const DatasetSubmenuListItem = (props: SearchItemProps) => {
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
    <li className="dc-c-list-item ds-u-padding-top--4">
      <div className={`dc-c-searchlist-item ${paginationEnabled ? 'ds-u-border-top--1' : 'ds-u-border-bottom--1 ds-u-padding-bottom--3'}`}>
        <div className="ds-l-row ds-u-align-items--start">
          <Link aria-describedby={`dataset-${identifier}-updated-date`} to={`/dataset/${identifier}`}>
            <h2 className="ds-l-col--12 ds-text-heading--md">{title}</h2>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default DatasetSubmenuListItem;
