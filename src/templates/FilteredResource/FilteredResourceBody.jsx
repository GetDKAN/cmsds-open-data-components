import React, { useContext, useEffect, useRef } from 'react';
import qs from 'qs';
import { Link } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import useDatastore from '../../services/useDatastore';
import {Spinner } from '@cmsgov/design-system';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceFooter from '../../components/ResourceFooter';
import { buildCustomColHeaders } from './functions';
import QueryBuilder from './QueryBuilder';
import TransformedDate from '../../components/TransformedDate';
import DatasetDescription from '../../components/DatasetDescription';
import 'swagger-ui-react/swagger-ui.css';
import DataTableContext from '../Dataset/DataTableContext';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const FilteredResourceBody = ({
  id,
  dataset,
  distIndex,
  location,
  customColumns,
  columnSettings,
  columnWidths,
  customTitle,
  customDescription,
  rootUrl,
  updateAriaLive
}) => {
  const [tablePadding, setTablePadding] = React.useState('ds-u-padding-y--1');
  let apiDocs = useRef();
  let distribution = {};
  let distribution_array = dataset.distribution ? dataset.distribution : [];
  if (distribution_array.length) {
    distribution = distribution_array.find(
      (dist) => dist.identifier === distribution_array[distIndex].identifier
    );
  }
  const options = location.search
    ? { ...qs.parse(location.search, { ignoreQueryPrefix: true }) }
    : { conditions: [] };
  const resource = useDatastore(
    '',
    rootUrl,
    {
      ...options,
      limit: 25,
    },
  );

  useEffect(() => {
    if (distribution.identifier) {
      resource.setResource(distribution.identifier);
    }
  }, [distribution]);
  const downloadUrl = `${
    rootUrl
  }/datastore/query/${id}/${distIndex}/download?${qs.stringify(
    { conditions: resource.conditions },
    { encode: true }
  )}&format=csv`;
  const pageTitle =
    distribution.data.title && distribution.data.title.toLowerCase() !== 'csv'
      ? distribution.data.title
      : dataset.title;

  const {ACA} = useContext(ACAContext);

  return (
    <section className="ds-l-container ds-u-padding-bottom--3 ds-u-margin-bottom--2">
      <div className="ds-l-row">
      {Object.keys(distribution).length && (
        <>
          <div className={'ds-l-md-col--9'}>
          <Link to={`/dataset/${id}`} className="ds-u-padding-y--4 ds-u-display--block">
            Back to {dataset.title}
          </Link>
          </div>
          <div className={'ds-l-md-col--9'}>
            <h1 className="ds-text-heading--3xl">{customTitle ? customTitle : pageTitle}</h1>
          </div>
          <div className={'ds-l-md-col--12 ds-u-margin-y--1 ds-u-text-align--right'}>
            <p className="ds-u-margin--0">Updated <TransformedDate date={dataset.modified} /></p>
          </div>
          <div className={'ds-l-md-col--9'}>
            <DatasetDescription
              distribution={distribution}
              dataset={dataset}
              resource={resource}
              customDescription={customDescription}
              updateAriaLive={updateAriaLive}
            />
          </div>
          <div className={'ds-l-md-col--12'}>
            {Object.keys(resource).length && resource.columns && Object.keys(resource.schema).length ? (
              <QueryBuilder
                resource={resource}
                id={distribution.identifier}
                customColumns={customColumns}
                setOffset={resource.setOffset}
              />
            ) : ''}
          </div>
          {Object.keys(resource).length && resource.columns && Object.keys(resource.schema).length ? (
            <DataTableContext.Provider value={{
              id: id,
              resource: resource,
              distribution: distribution,
              rootUrl: rootUrl,
              customColumns: buildCustomColHeaders(
                customColumns,
                resource.columns,
                resource.schema[distribution_array[distIndex].identifier]
              ),
            }}>
              <div className={'ds-l-md-col--12'}>
                <ResourceHeader
                  includeDensity={true}
                  setTablePadding={setTablePadding}
                  resource={resource}
                  downloadUrl={downloadUrl}
                  tablePadding={tablePadding}
                  includeDownload
                />
                  <ResourcePreview
                    id={distribution.identifier}
                    tablePadding={tablePadding}
                    columnSettings={columnSettings}
                    columnWidths={columnWidths}
                  />
                  <ResourceFooter resource={resource} />
              </div>
            </DataTableContext.Provider>
          ) : (
            <div className={'ds-l-md-col--12'}>
              <Spinner role="status" aria-valuetext="Resource loading" />
            </div>
          )}
          {dataset.identifier && (
            <div className={'ds-l-md-col--12'} ref={apiDocs}>
              <h2 className="ds-text-heading--2xl ds-u-margin-y--2">Try the API</h2>
              <SwaggerUI
                url={`${rootUrl}/metastore/schemas/dataset/items/${
                  dataset.identifier
                }/docs?${qs.stringify(acaToParams({}, ACA))}`}
                docExpansion={'list'}
                defaultModelsExpandDepth={-1}
              />
            </div>
          )}
        </>
      )}
      </div>
    </section>
  );
};

export default FilteredResourceBody;
