import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import PageNotFound from '../PageNotFound';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import { Tabs, TabPanel } from '@cmsgov/design-system';
import SearchItemIcon from '../../assets/icons/searchItem';
import './dataset.scss';

const Dataset = ({
  id,
  rootUrl,
  additionalParams,
  customColumns,
  setDatasetTitle,
  columnSettings,
  columnWidths,
  customMetadataMapping,
}) => {
  const metastore = useMetastoreDataset(id, rootUrl, additionalParams);
  const { dataset } = metastore;
  const title = dataset.title ? dataset.title : '';
  const metadataMapping = {
    ...defaultMetadataMapping,
    ...customMetadataMapping,
  };
  useEffect(() => {
    if (title) {
      if (setDatasetTitle) {
        setDatasetTitle(title);
      }
    }
  }, [title]);
  const notFoundContent = (
    <div className="ds-u-padding-top--3">
      <h1 className="ds-title">Error: Dataset not found</h1>
      <p>
        We're sorry, but there is no dataset ID that matches your entry. You may have been directed
        here because:
      </p>
      <ol>
        <li>The address you typed contains a typo;</li>
        <li>The requested dataset no longer exists.</li>
      </ol>
      <p>
        <span className="ds-u-font-weight--bold">Note:</span> If you were using a bookmark, please
        reset it once you find the correct dataset.
      </p>
    </div>
  );
  return (
    <>
      {dataset.error ? (
        <PageNotFound content={notFoundContent} />
      ) : (
        <div className={'ds-l-container'}>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--9'}>
              <h1 className={'ds-u-margin-bottom--7 ds-h1 title-underline'}>{title}</h1>
              <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
                <p className="dc-c-metadata-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dataset.description) }}/>
              </div>
            </div>
          </div>
          <div className={'ds-l-row'}>
            <div className={'ds-l-md-col--12 dc-dataset'}>
              <Tabs onChange={function noRefCheck() {}}>
                <TabPanel
                  id={'data-table'}
                  tab={
                    <span>
                      <SearchItemIcon id="data-table" />
                      Data Table
                    </span>
                  }
                >
                  <p>Data Table</p>
                </TabPanel>
                <TabPanel
                  id={'overview'}
                  tab={
                    <span>
                      <SearchItemIcon id="overview" />
                      Overview
                    </span>
                  }
                >
                  <p>Overview</p>
                </TabPanel>
                <TabPanel
                  id={'data-dictionary'}
                  tab={
                    <span>
                      <SearchItemIcon id="data-dictionary" />
                      Data Dictionary
                    </span>
                  }
                >
                  <p>Data Dictionary</p>
                </TabPanel>
                <TabPanel
                  id={'api'}
                  tab={
                    <span>
                      <SearchItemIcon id="api" />
                      API
                    </span>
                  }
                >
                  <p>API</p>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
};

export default Dataset;
