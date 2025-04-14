import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import LargeFileDialog from '../LargeFileDialog';
import SearchItemIcon from '../../assets/icons/searchItem';
import TransformedDate from '../TransformedDate';
import './dataset-search-list-item.scss';
import { truncateText } from './truncateText';
import { Button } from '@cmsgov/design-system';

type SearchItemProps = {
  title: string;
  modified: string;
  description: string;
  identifier: string;
  downloadUrl?: string | null;
  largeFile: boolean;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
}

const DatasetSearchListItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, modified, description, identifier, downloadUrl, largeFile = false, paginationEnabled, dataDictionaryLinks } = props;

  let linkContainerClasses = 'ds-u-margin-bottom--2';
  if (dataDictionaryLinks) {
    linkContainerClasses += ' ds-l-col--6 ds-u-padding-right--0';
  } else {
    linkContainerClasses += ' ds-l-col--auto ds-u-padding-left--0';
  }
  let linkClasses = 'ds-u-display--block ds-u-text-align--left';
  if (desktop) {
    linkContainerClasses = 'ds-l-col--auto';
    linkClasses += ' ds-l-col--4 ds-l-md-col--auto';
  }

  return (
    <li className="dc-c-search-list-item ds-u-padding-top--3">
      <div className={`dc-c-searchlist-item ${paginationEnabled ? 'ds-u-border-top--1' : 'ds-u-border-bottom--1 ds-u-padding-bottom--3'}`}>
        <div className="ds-l-row ds-u-align-items--start">
          <span id={`dataset-${identifier}-updated-date`} className={`ds-l-col--12 ds-u-text-align--right ${paginationEnabled ? 'ds-u-padding-top--2' : 'ds-u-padding-top--0'}`}>
            Updated <TransformedDate date={modified} />
          </span>
          <h2 className="ds-l-col--12 ds-text-heading--2xl">
            <Link aria-describedby={`dataset-${identifier}-updated-date`} to={`/dataset/${identifier}`}>{title}</Link>
          </h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-l-md-col--12 ds-u-margin-top--2">{truncateText(description)}</div>
        </div>
        {( downloadUrl ) ? (
            <div className={`ds-u-margin-top--3 ds-u-padding-left--0`}>
                {largeFile ? (
                  <span>
                    {<LargeFileDialog downloadUrl={downloadUrl} />}
                  </span>
                ) : (
                  <Button href={downloadUrl} variation="solid" className="ds-l-sm-col--12 ds-l-md-col--auto">
                    <SearchItemIcon id="download" />
                    Download
                  </Button>
                )}
            </div>
          ) : (
            ''
          )}
        <div className={`ds-l-row ds-u-padding--0 ds-u-flex-direction--row ds-u-margin-top--3 ds-u-margin-x--0 ${!dataDictionaryLinks && 'ds-u-justify-content--center ds-u-md-justify-content--start'}`}>
          <div className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#data-table`}>
                <SearchItemIcon id="data-table" />
                Data Table
              </Link>
            </span>
          </div>
          <div className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#overview`}>
                <SearchItemIcon id="overview" />
                Overview
              </Link>
            </span>
          </div>
          { dataDictionaryLinks && (
            <div className={linkContainerClasses}>
              <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#data-dictionary`}>
                <SearchItemIcon id="data-dictionary" />
                Data Dictionary
              </Link>
              </span>
            </div>
          )}
          <div className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#api`}>
                <SearchItemIcon id="api" />
                API
              </Link>
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default DatasetSearchListItem;
