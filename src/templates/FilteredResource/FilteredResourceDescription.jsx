import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

const FilteredResourceDescription = ({distribution, dataset, resource, customDescription, dynamicDescription}) => {
  const [description, setDescription] = useState("");

  if(!distribution && !dataset) {
    return null;
  }
  useEffect(() => {
    if (!dynamicDescription && description !== "") {
      return;
    }
    if (customDescription) {
      setDescription(customDescription(dataset, distribution, resource));
    } else {
      if(distribution.data && distribution.data.description) {
        setDescription(distribution.data.description);
      } else if(dataset.description) {
        setDescription(dataset.description);
      }
    }
  }, [resource, distribution, dataset, customDescription, dynamicDescription]);
  
  return (
    <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
      <div 
        className="ds-u-margin-top--0 dc-c-metadata-description"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
      />
    </div>
  );
}

export default FilteredResourceDescription;
