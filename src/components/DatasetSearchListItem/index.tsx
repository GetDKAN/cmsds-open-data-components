import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import TextTruncate from 'react-text-truncate';
import { useMediaQuery } from 'react-responsive';

import SearchItemIcon from '../../assets/icons/searchItem';
import TransformedDate from '../TransformedDate';
import './dataset-search-list-item.scss';

type SearchItemProps = {
  title: string;
  modified: string;
  description: string;
  theme: string[];
  identifier: string;
  downloadUrl?: string;
  showDownload: boolean;
  largeFile: boolean;
}

const dangerousDescriptionElement = ({ children } : {children: string}) => (
  <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(children) }} />
);

const DatasetSearchListItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, modified, description, theme, identifier, downloadUrl, showDownload = false, largeFile = false } = props;

  let linkContainerClasses = 'ds-l-col--12 ds-u-margin-bottom--2';
  let linkClasses = 'ds-c-button ds-u-display--block ds-u-text-align--left';
  if (desktop) {
    linkContainerClasses = 'ds-l-col--auto';
    linkClasses = 'ds-u-display--block ds-u-text-align--left';
  }

  const truncatedDescription = (
    <TextTruncate
      line={3}
      element={'p'}
      containerClassName="ds-u-margin-top--0"
      truncateText="…"
      textElement={dangerousDescriptionElement}
      text={description}
      textTruncateChild=""
    />
  );
  return (
    <li className="dc-c-search-list-item" key={identifier}>
      <div className="dc-c-searchlist-item ds-u-border-top--1 ds-u-margin-bottom--4">
        <div className="ds-l-row ds-u-align-items--start">
          <span className="ds-l-col--12 ds-u-text-align--right ds-u-padding-top--2">
            Updated <TransformedDate date={modified} />
          </span>
          <h2 className="ds-l-col--12">
            <Link to={`/dataset/${identifier}`}>{title}</Link>
          </h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-l-md-col--12">{truncatedDescription}</div>
        </div>
        <ul className="ds-l-row ds-u-padding--0">
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#overview`}>
                <SearchItemIcon id="overview" />
                Overview
              </Link>
            </span>
          </li>
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#data-table`}>
                <SearchItemIcon id="data-table" />
                Data Table
              </Link>
            </span>
          </li>
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`/dataset/${identifier}#api`}>
                <SearchItemIcon id="api" />
                API
              </Link>
            </span>
          </li>
          {(showDownload && downloadUrl )? (
            <li className={linkContainerClasses}>
              <span className={linkClasses}>
                {largeFile ? (
                  <span>
                    <SearchItemIcon id="download" />
                    {/*<LargeFileDialog downloadUrl={downloadUrl} /> */}
                  </span>
                ) : (
                  <a href={downloadUrl}>
                    <SearchItemIcon id="download" />
                    Download
                  </a>
                )}
              </span>
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
    </li>
  );
};

export default DatasetSearchListItem;
