import DOMPurify from 'dompurify';

const FilteredResourceDescription = ({distribution, dataset}) => {
  if(!distribution && !dataset) {
    return null;
  }
  
  let description = "";
  if(distribution.data && distribution.data.description) {
    description = distribution.data.description;
  } else if(dataset.description) {
    description = dataset.description
  }

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
