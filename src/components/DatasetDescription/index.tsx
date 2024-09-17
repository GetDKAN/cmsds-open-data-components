import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { DatasetDescriptionType } from '../../types/dataset';

const DatasetDescription = (
  {distribution, dataset, resource, customDescription, updateAriaLive} : DatasetDescriptionType
) => {
  const [description, setDescription] = useState("");

  if(!distribution && !dataset?.identifier) {
    return null;
  }
  useEffect(() => {
    let newDescription = '';
    if (customDescription) {
      newDescription = customDescription(dataset, distribution, resource);
    } else {
      if(distribution.data && distribution.data.description) {
        newDescription = distribution.data.description;
      } else if(dataset.description) {
        newDescription = dataset.description;
      }
    }
    if (description !== newDescription && updateAriaLive) {
      updateAriaLive(newDescription);
    }
    setDescription(newDescription);
  }, [resource, distribution, dataset, customDescription]);
  
  return (
    <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
      <div 
        className="ds-u-margin-top--0 dc-c-metadata-description"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
      />
    </div>
  );
}

export default DatasetDescription;
