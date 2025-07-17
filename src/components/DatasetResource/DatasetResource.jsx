import React from 'react';
import PropTypes from 'prop-types';
import DataTableToolbar from '../DataTableToolbar/DataTableToolbar';
import DataTable from '../dataset/DataTable/DataTable';

const DatasetResource = ({
  resource,
  datasetTitle,
  datasetDescription,
  datasetModified,
  datasetReleased,
  datasetRefresh,
}) => {
  return (
    <div
      id={`resource_${resource.identifier}`}
      className="resource-table"
      data-testid="data-table"
      data-resource-identifier={resource.identifier}
    >
      {/* Filter logic here */}

      <DataTableToolbar
        datasetTitle={datasetTitle}
        datasetDescription={datasetDescription}
        datasetModified={datasetModified}
        datasetReleased={datasetReleased}
        datasetRefresh={datasetRefresh}
        instanceId={1}
      />
      <DataTable datasetTitle={datasetTitle} />
    </div>
  );
};

DatasetResource.propTypes = {
  /**
   * Dataset data object
   */
  resource: PropTypes.object,
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * Dataset description
   */
  datasetDescription: PropTypes.string,
  /**
   * Dataset modified date string
   */
  datasetModified: PropTypes.string,
  /**
   * Dataset released date string
   */
  datasetReleased: PropTypes.string,
  /**
   * Dataset anticipated refresh date string
   */
  datasetRefresh: PropTypes.string,
};

DatasetResource.displayName = 'DatasetResource';
export default DatasetResource;
