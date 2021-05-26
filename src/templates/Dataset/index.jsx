import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';
import { useMetastoreDataset, useDatastore } from '@civicactions/data-catalog-services';
import { Badge, Button } from '@cmsgov/design-system';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceHeader from '../../components/ResourceHeader';
import DatasetTags from '../../components/DatasetTags';
import DatasetDownloads from '../../components/DatasetDownloads';
import DatasetAdditionalInformation from '../../components/DatasetAdditionalInformation';
import TransformedDate from '../../components/TransformedDate';
import ResourceFooter from '../../components/ResourceFooter';

const Dataset = ({ id, rootUrl }) => {
  let apiDocs = useRef()
  const [tablePadding, setTablePadding] = useState('ds-u-padding-y--1')
  const metastore = useMetastoreDataset(id, rootUrl);
  const { dataset, } = metastore;
  let distribution = {};
  let distribution_array = dataset.distribution ? dataset.distribution : [];
  if(distribution_array.length) {
    distribution = distribution_array[0];
  }
  const resource = useDatastore('', process.env.REACT_APP_ROOT_URL, {
    limit: 10,
    manual: true,
  })
  useEffect(() => {
    if(distribution.identifier) {
      resource.setResource(distribution.identifier);
      resource.setManual(false)
    }
  }, [distribution])

  const rawDate = new Date(dataset.modified);
  let modifiedDate = '';
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  if(rawDate) {
    modifiedDate = rawDate.toLocaleDateString('en-US', options);
  }
  return (
    <section className="ds-l-container">
      <div className="ds-l-row ds-u-padding-top--3">
        <div className="ds-l-md-col--9 ds-l-sm-col--12">
          <h1 className="ds-title">{dataset.title}</h1>
          <div className="ds-l-row">
            <p className="ds-l-col--6">
              {dataset.theme ? <Badge variation="info">{dataset.theme[0].data}</Badge> : null}
            </p>
            <p className="ds-l-col--6 ds-u-color--gray ds-u-text-align--right">Updated <TransformedDate date={modifiedDate} /></p>
          </div>
          <p dangerouslySetInnerHTML={{__html: dataset.description}} />
          <h2 className="dc-resource-header">Resource Preview</h2>
          {resource.columns
              ? (
                <div>
                  <ResourceHeader id={id} includeFiltered includeDensity={true} setTablePadding={setTablePadding} distribution={distribution} resource={resource} />
                  <ResourcePreview id={distribution.identifier} tablePadding={tablePadding} resource={resource} />
                  <ResourceFooter resource={resource} />
                </div>
              )
              : (
                <Spinner />
              )
            }
          {dataset.identifier &&
            <DatasetAdditionalInformation datasetInfo={dataset} />
          }
          {dataset.identifier &&
            <div ref={apiDocs}>
              <h2>Try the API</h2>
              <SwaggerUI url={`${process.env.REACT_APP_ROOT_URL}/metastore/schemas/dataset/items/${dataset.identifier}/docs`} docExpansion={'list'} />
            </div>
          }
          
        </div>
        <div className="ds-l-md-col--3 ds-l-sm-col--12">
        {dataset.distribution
          && (
            <DatasetDownloads downloadURL={dataset.distribution[0].data.downloadURL} />
          )}
          <DatasetTags keywords={dataset.keyword} />
          <div className="dc-c-dataset-tags ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border ds-u-border--1">
            <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-top--0 ds-u-margin-bottom--2 ds-u-padding-bottom--2">API</h2>
            <Button
              variation="transparent"
              onClick={
                () => window.scrollTo({ behavior: 'smooth', top: apiDocs.current.offsetTop })
              }
              >
                Scroll to dataset API
              </Button>
          </div>
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
