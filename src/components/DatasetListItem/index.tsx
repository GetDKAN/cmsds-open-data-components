import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import TransformedDate from '../TransformedDate';
import './dataset-list-item.scss';
import { truncateText } from './truncateText';

type SearchItemProps = {
  title: string;
  modified: string;
  identifier: string;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
}

const DatasetListItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, modified, identifier, paginationEnabled, dataDictionaryLinks } = props;

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
          <span id={`dataset-${identifier}-updated-date`} className={`ds-l-col--12 ds-u-text-align--left ds-text-heading--sm ${paginationEnabled ? 'ds-u-padding-top--3' : 'ds-u-padding-top--0'}`}>
            Updated <TransformedDate date={modified} />
          </span>
          <h2 className="ds-l-col--12 ds-text-heading--2xl">{title}</h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-l-md-col--12 ds-u-margin-top--2">The {title} dataset was updated.</div>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12">
            <Link aria-describedby={`dataset-${identifier}-updated-date`} to={`/dataset/${identifier}`}>View the Dataset for {title} </Link></div>
        </div>
      </div>
    </li>
  );
};

export default DatasetListItem;
