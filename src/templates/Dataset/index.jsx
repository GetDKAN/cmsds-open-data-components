import React from 'react';
import PropTypes from 'prop-types';
import { useMetastoreDataset } from '@civicactions/data-catalog-services';
import DatasetBody from './DatasetBody';
import PageNotFound from '../PageNotFound';

const Dataset = ({ id, rootUrl }) => {
  const metastore = useMetastoreDataset(id, rootUrl);
  const { dataset } = metastore;
  const notFoundContent = (
    <>
      <h1>Error: Dataset not found</h1>
      <p>We're sorry, but there is no dataset ID that matches your entry. You may have been directed here because:</p>
      <ol>
        <li>The address you typed contains a typo;</li>
        <li>The requested dataset no longer exists.</li>
      </ol>
      <p><span className="ds-u-font-weight--bold">Note:</span> If you were using a bookmark, please reset it once you find the correct dataset.</p>
    </>
  );
  return (
    <>
    { dataset.error ? (
      <PageNotFound content={notFoundContent} />
      ) : (
      <DatasetBody id={id} dataset={dataset} />
      )
    }
    </>
  );
}

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
}

export default Dataset;
