import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import LargeFileDialog from '../LargeFileDialog';
import SearchItemIcon from '../../assets/icons/searchItem';
import TransformedDate from '../TransformedDate';
import './dataset-search-list-item.scss';
import { truncateText } from './truncateText';
import { Button } from '@cmsgov/design-system';
import DatasetDate from '../DatasetDate';

type LocationType = {
  pathname: string;
  search?: string;
  hash?: string;
  state?: any;
};

type SearchItemProps = {
  title: string;
  modified: string;
  description: string;
  url: string;
  downloadUrl?: string | null;
  largeFile: boolean;
  paginationEnabled: boolean;
  dataDictionaryLinks: boolean;
  refresh?: string;
  released?: string;
  showTopics?: boolean;
  showDateDetails?: boolean;
  theme?: string[];
  topicSlugs?: { [key: string]: string }; // Map of topic titles to their slugs
  location: LocationType;
}

const DatasetSearchListItem = (props: SearchItemProps) => {
  const desktop = useMediaQuery({ minWidth: 1024 });
  const { 
    title, 
    modified, 
    description, 
    url, 
    downloadUrl, 
    largeFile = false, 
    paginationEnabled, 
    dataDictionaryLinks,
    refresh,
    released,
    showDateDetails = false,
    showTopics = false,
    theme,
    topicSlugs,
    location
  } = props;

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

  let themes

  if (theme && showTopics) {
    themes = (
      <ul className='theme-list item-theme'>
        {theme.map((topic: string, index: number) => {
          const title = topic || 'Unknown Topic'
          const prefix = 'topics'
          
          // Use the provided slug or fallback to a simple slug generation
          const slug = topicSlugs?.[title]
          const link = `/${prefix}/${slug}`
          
          return (
            <li className='ds-u-fill--primary ds-u-radius--pill' key={`dist-${title}-${index}`}>
              <Link
                to={link}
                state={{
                  fromUrl: location.pathname,
                  fromTitle: false,
                  fromSearchList: location.pathname.includes('search')
                }}
              >
                {title}
              </Link>
            </li>)
        })}
      </ul>
    )
  }

  const date: { modified?: string; released?: string; refresh?: string } = {
    modified,
    released,
    refresh
  };

  return (
    <li className="dc-c-search-list-item ds-u-padding-top--3">
      <div className={`dc-c-searchlist-item ${paginationEnabled ? 'ds-u-border-top--1' : 'ds-u-border-bottom--1 ds-u-padding-bottom--3'}`}>
        {themes}
        <div className="ds-l-row ds-u-align-items--start">
          {!showDateDetails && <span id={`dataset-${url}-updated-date`} className={`ds-l-col--12 ds-u-text-align--right ${paginationEnabled ? 'ds-u-padding-top--2' : 'ds-u-padding-top--0'}`}>
            <span className="ds-u-font-weight--bold">Updated:</span> <TransformedDate date={modified} />
          </span>}
          <h2 className="ds-l-col--12 ds-text-heading--2xl">
            <Link aria-describedby={`dataset-${url}-updated-date`} to={`${url}`}>{title}</Link>
          </h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12 ds-l-md-col--12 ds-u-margin-top--2">{truncateText(description)}{description.length > 240 ? (
            <>
             {' '}<Link to={`/dataset/${identifier}`}>See more</Link> 
            </>
          ) : ''}</div>
        </div>
        {( downloadUrl ) ? (
            <div className={`ds-u-margin-top--3 ds-u-padding-left--0 download-button`}>
                {largeFile ? (
                  <span>
                    {<LargeFileDialog downloadUrl={downloadUrl} />}
                  </span>
                ) : (
                  <Button href={downloadUrl} variation="solid" className="ds-l-col--12 ds-l-md-col--auto">
                    <SearchItemIcon id="download" />
                    Download
                  </Button>
                )}
            </div>
          ) : (
            ''
          )}
          {showDateDetails && <div className='dataset-dates'>
            <DatasetDate date={date} displayTooltips={false}/>
          </div>}
        <ul className={`ds-l-row ds-u-padding--0 ds-u-flex-direction--row ds-u-justify-content--between ds-u-md-justify-content--start ds-u-margin-top--3 ds-u-margin-x--0 ${!dataDictionaryLinks ? 'ds-u-justify-content--center ds-u-md-justify-content--start' : ''}`}>
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`${url}#data-table`}>
                <SearchItemIcon id="data-table" />
                Data Table
              </Link>
            </span>
          </li>
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`${url}#overview`}>
                <SearchItemIcon id="overview" />
                Overview
              </Link>
            </span>
          </li>
          { dataDictionaryLinks ? (
            <li className={linkContainerClasses}>
              <span className={linkClasses}>
              <Link to={`${url}#data-dictionary`}>
                <SearchItemIcon id="data-dictionary" />
                Data Dictionary
              </Link>
              </span>
            </li>
          ) : ''}
          <li className={linkContainerClasses}>
            <span className={linkClasses}>
              <Link to={`${url}#api`}>
                <SearchItemIcon id="api" />
                API
              </Link>
            </span>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default DatasetSearchListItem;