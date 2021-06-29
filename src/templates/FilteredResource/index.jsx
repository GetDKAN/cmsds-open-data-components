import React, {useState, useEffect} from 'react';
import { useMetastoreDataset } from '@civicactions/data-catalog-services';
import PageNotFound from '../PageNotFound';
import FilteredResourceBody from './FilteredResourceBody';

const FilteredResource = ({id, dist_id, location, apiDocPage, additionalParams}) => {
  let acaParamString = '';
  if(additionalParams.ACA) {
    acaParamString = `&ACA=${additionalParams.ACA}&redirect=false`;
  }
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const {dataset} = useMetastoreDataset(id, process.env.REACT_APP_ROOT_URL, acaParamString);
  const distIndex = dist_id === 'data' ? 0 : dist_id;
  useEffect(() => {
    if (dataset.error) {
      setError(true);
    }
    if (dataset.distribution && dataset.distribution.length) {
      setReady(true);
      if (!dataset.distribution[distIndex]) {
        setError(true);
      }
    }
  }, [dataset.distribution, dataset.error, distIndex]);
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
    { error ? (
      <PageNotFound content={notFoundContent} />
      ) : (
        <>
          { ready && (<FilteredResourceBody id={id} dataset={dataset} distIndex={distIndex} location={location} apiDocPage={apiDocPage} additionalParams={additionalParams} />)}
        </>
      )
    }
    </>
  )
}

export default FilteredResource;
