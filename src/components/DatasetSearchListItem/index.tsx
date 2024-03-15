import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import TextTruncate from 'react-text-truncate';
import { useMediaQuery } from 'react-responsive';
import LargeFileDialog from '../LargeFileDialog';
import SearchItemIcon from '../../assets/icons/searchItem';
import TransformedDate from '../TransformedDate';
import './dataset-search-list-item.scss';

type SearchItemProps = {
  title: string;
  modified: string;
  description: string;
  theme: string[];
  identifier: string;
  downloadUrl?: string | null;
  largeFile: boolean;
  paginationEnabled: boolean;
}

function prepDescription(description: string) {
  if (!description) {
    return;
  }

  if (description.length > 1 && description.substring(0, 1) === "<") {
    const elementTagStart = description.indexOf('<');
    const elementTagEnd = description.indexOf('>')
    const elementTagInner = description.substring(elementTagStart + 1, elementTagEnd)
    const elementTagLength = elementTagInner.length
    const isolatedDescriptionStart = description.indexOf(`<${elementTagInner}>`) + (elementTagLength + 2)
    const isolatedDescriptionEnd = description.indexOf(`</${elementTagInner}>`)
    const isolatedDescription = description.substring(isolatedDescriptionStart, isolatedDescriptionEnd)
    return DOMPurify.sanitize(isolatedDescription, {ALLOWED_TAGS: []});
  } 
  return DOMPurify.sanitize(description, {ALLOWED_TAGS: []})
}


const DatasetSearchListItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { title, modified, description, theme, identifier, downloadUrl, largeFile = false, paginationEnabled } = props;

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
      truncateText="…"
      text={prepDescription(description)}
    />
  );

  return (
    <li className="dc-c-search-list-item ds-u-padding-top--3" key={identifier}>
      <div className={`dc-c-searchlist-item ${paginationEnabled ? 'ds-u-border-top--1' : 'ds-u-border-bottom--1 ds-u-padding-bottom--3'}`}>
        <div className="ds-l-row ds-u-align-items--start">
          <span className={`ds-l-col--12 ds-u-text-align--right ${paginationEnabled ? 'ds-u-padding-top--2' : 'ds-u-padding-top--0'}`}>
            Updated <TransformedDate date={modified} />
          </span>
          <h2 className="ds-l-col--12 ds-text-heading--2xl">
            <Link to={`/dataset/${identifier}`}>{title}</Link>
          </h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-l-md-col--12">{truncatedDescription}</div>
        </div>
        <ul className="ds-l-row ds-u-padding--0 ds-u-flex-direction--row ds-u-margin-top--4">
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
          {( downloadUrl ) ? (
            <li className={linkContainerClasses}>
              <span className={linkClasses}>
                {largeFile ? (
                  <span>
                    <SearchItemIcon id="download" />
                    {<LargeFileDialog downloadUrl={downloadUrl} />}
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
