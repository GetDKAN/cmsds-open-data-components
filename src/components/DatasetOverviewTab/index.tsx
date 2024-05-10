import React from 'react';
import DatasetAdditionalInformation from '../DatasetAdditionalInformation';
import Resource from '../Resource';
import { DatasetOverviewPropsType } from '../../types/dataset';

const DatasetOverview = ({ dataset, resource, distributions, metadataMapping } : DatasetOverviewPropsType) => {
  return (
    <>
      <Resource
        distributions={distributions}
        resource={resource}
        title={dataset.title}
      />
      <DatasetAdditionalInformation metadata={dataset} metadataMapping={metadataMapping} />
    </>
  );
};

export default DatasetOverview;