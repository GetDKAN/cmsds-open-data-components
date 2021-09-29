import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';
import { useDatastore } from '@civicactions/data-catalog-services';
import { Badge, Button } from '@cmsgov/design-system';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceHeader from '../../components/ResourceHeader';
import DatasetTags from '../../components/DatasetTags';
import DatasetDownloads from '../../components/DatasetDownloads';
import DatasetAdditionalInformation from '../../components/DatasetAdditionalInformation';
import TransformedDate from '../../components/TransformedDate';
import ResourceFooter from '../../components/ResourceFooter';
import ResourceInformation from '../../components/ResourceInformation';

const DatasetBody = ({ id, dataset, additionalParams }) => {
  let apiDocs = useRef()
  const [tablePadding, setTablePadding] = useState('ds-u-padding-y--1')
  const [fileFormat, setFileFormat] = useState('')

  let distribution = {};
  let distribution_array = dataset.distribution ? dataset.distribution : [];
  if(distribution_array.length) {
    distribution = distribution_array[0];
  }
  const resource = useDatastore(
    '',
    process.env.REACT_APP_ROOT_URL,
    {
      limit: 10,
      manual: true,
    },
    additionalParams
  )
  useEffect(() => {
    if(distribution.identifier) {
      let localFileFormat = '';
      if(distribution.data.format) {
        localFileFormat = distribution.data.format.toUpperCase()
        
      } else if(distribution.data.mediaType) {
        const mediaType = distribution.data.mediaType.split('/');
        if (mediaType.length && mediaType[1]) {
          localFileFormat = mediaType[1].toUpperCase();
        }
      }
      setFileFormat(localFileFormat);
      if (localFileFormat === "CSV") {
        resource.setResource(distribution.identifier);
        resource.setManual(false);
      }
    }
  }, [distribution])

  return (
    <section className="ds-l-container">
      <div className="ds-l-row ds-u-padding-top--3">
        <div className="ds-l-md-col--9 ds-l-sm-col--12">
          <h1 className="ds-title ds-u-word-break">{dataset.title}</h1>
          <div className="ds-l-row">
            <p className="ds-l-col--6">
              {dataset.theme ? <Badge variation="info">{dataset.theme[0].data}</Badge> : null}
            </p>
            {dataset.modified && (
              <p className="ds-l-col--6 ds-u-color--gray ds-u-text-align--right">Updated <TransformedDate date={dataset.modified} /></p>
            )}
          </div>
          <p dangerouslySetInnerHTML={{__html: dataset.description}} />
          {Object.keys(distribution).length && fileFormat === "CSV" ? (
            <>
              <h2 className="dc-resource-header">Resource Preview</h2>
              {resource.columns
                  ? (
                    <div>
                      <ResourceHeader id={id} includeFiltered includeDensity={true} tablePadding={tablePadding} setTablePadding={setTablePadding} distribution={distribution} resource={resource} />
                      <ResourcePreview id={distribution.identifier} tablePadding={tablePadding} resource={resource} />
                      <ResourceFooter resource={resource} />
                      <ResourceInformation resource={resource}/>
                    </div>
                  )
                  : (
                    <Spinner />
                  )
                }
            </>
          ):''}
          {dataset.identifier &&
            <DatasetAdditionalInformation datasetInfo={dataset} />
          }
          {Object.keys(distribution).length && fileFormat === "CSV" && dataset.identifier ? (
            <div ref={apiDocs}>
              <h2>Try the API</h2>
              <SwaggerUI
                url={`${process.env.REACT_APP_ROOT_URL}/metastore/schemas/dataset/items/${dataset.identifier}/docs${additionalParams && additionalParams.ACA ? '?ACA=' + additionalParams.ACA + '&redirect=false' : ''}`}
                docExpansion={'list'}
                defaultModelsExpandDepth={-1}
                />
            </div>
            ) : ''
          }
        </div>
        <div className="ds-l-md-col--3 ds-l-sm-col--12">
        {Object.keys(distribution).length
          ? (
            <DatasetDownloads downloadURL={distribution.data.downloadURL} type={fileFormat} />
          ) : ''}
          <DatasetTags keywords={dataset.keyword} />
          {Object.keys(distribution).length && fileFormat === "CSV" ? (
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
          ) : ''}
        </div>
      </div>
    </section>
  );
}

DatasetBody.propTypes = {
  id: PropTypes.string.isRequired,
  dataset: PropTypes.object.isRequired,
}

export default DatasetBody;
