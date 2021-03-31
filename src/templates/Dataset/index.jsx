import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { useMetastoreDataset, Resource, prepareColumns } from '@civicactions/data-catalog-services';
import { Badge } from '@cmsgov/design-system';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceHeader from '../../components/ResourceHeader';
import DatasetTags from '../../components/DatasetTags';
import DatasetDownloads from '../../components/DatasetDownloads';

const Dataset = ({ id, rootUrl }) => {
  const resourceOptions = {
    limit: 25,
    // prepareColumns: prepareColumns
  }
  const [tablePadding, setTablePadding] = useState('ds-u-padding-y--1')
  const { dataset, } = useMetastoreDataset(id, rootUrl);
  const rawDate = new Date(dataset.modified);
  let modifiedDate = '';
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  if(rawDate) {
    modifiedDate = rawDate.toLocaleDateString('en-US', options);
  }
  return (
    <section className="ds-l-container">
      <div className="ds-l-row ds-u-padding-top--3">
        <div className="ds-l-col--8">
          <h1 className="ds-title">{dataset.title}</h1>
          <div className="ds-l-row">
            <p className="ds-l-col--8">
              {dataset.theme ? <Badge>{dataset.theme[0].data}</Badge> : null}
            </p>
            <p className="ds-l-col--4">Updated {modifiedDate}</p>
          </div>
          <p>{dataset.description}</p>
          <h2>Dataset Explorer</h2>
          {dataset.distribution
            && (
              <Resource
                distribution={dataset.distribution[0]}
                rootUrl={rootUrl}
                options={resourceOptions}
              >
                <ResourceHeader
                  setTablePadding={setTablePadding}
                  id={id}
                  distribution={dataset.distribution[0]}
                  includeFiltered
                />
                <ResourcePreview tablePadding={tablePadding} id={dataset.distribution[0].identifier}/>
                {/* <ResourceFooter /> */}
              </Resource>
            )
          }
        </div>
        <div className="ds-l-col--4">
        {dataset.distribution
          && (
            <DatasetDownloads downloadURL={dataset.distribution[0].data.downloadURL} />
          )}
          <DatasetTags keywords={dataset.keyword} />
          {/* <h2>API</h2> */}
        </div>
      </div>
    </section>
  );
}

Dataset.propTypes = {
  id: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
}

export default Dataset;
