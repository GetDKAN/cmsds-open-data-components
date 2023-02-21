import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useMetastoreDataset from '../../services/useMetastoreDataset';
import DatasetBody from './DatasetBody';
import PageNotFound from '../PageNotFound';
import { defaultMetadataMapping } from '../../assets/metadataMapping';

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
        <DatasetBody
          rootUrl={rootUrl}
          id={id}
          dataset={dataset}
          additionalParams={additionalParams}
          customColumns={customColumns ? customColumns : []}
          columnSettings={columnSettings}
          columnWidths={columnWidths}
          metadataMapping={metadataMapping}
        />
      )}
    </>
  );
};

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
};

export default Dataset;
