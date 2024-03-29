import React, { useEffect, useRef } from 'react';
import qs from 'qs';
import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import useDatastore from '../../services/useDatastore';
import {
  HelpDrawerToggle,
  Button,
  Tooltip,
  Spinner,
  Accordion,
  AccordionItem,
} from '@cmsgov/design-system';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceFooter from '../../components/ResourceFooter';
import { buildCustomColHeaders } from './functions';
import QueryBuilder from './QueryBuilder';
import 'swagger-ui-react/swagger-ui.css';

const FilteredResourceBody = ({
  id,
  dataset,
  distIndex,
  location,
  apiDocPage,
  additionalParams,
  customColumns,
  columnSettings,
  columnWidths,
  customTitle,
  rootUrl
}) => {
  const navigate = useNavigate();
  const [tablePadding, setTablePadding] = React.useState('ds-u-padding-y--1');
  let apiDocs = useRef();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  let distribution = {};
  let distribution_array = dataset.distribution ? dataset.distribution : [];
  if (distribution_array.length) {
    distribution = distribution_array.find(
      (dist) => dist.identifier === distribution_array[distIndex].identifier
    );
  }
  let buttonRef = null;
  const options = location.search
    ? { ...qs.parse(location.search, { ignoreQueryPrefix: true }) }
    : { conditions: [] };
  let conditions = options.conditions.length ? options.conditions : [];
  const resource = useDatastore(
    '',
    rootUrl,
    {
      ...options,
      limit: 25,
      manual: true,
    },
    additionalParams
  );

  useEffect(() => {
    if (distribution.identifier) {
      resource.setResource(distribution.identifier);
      resource.setManual(false);
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

  return (
    <section className="ds-l-container ds-u-padding-bottom--3 ds-u-margin-bottom--2">
      {Object.keys(distribution).length && (
        <>
          <Link to={`/dataset/${id}`} className="ds-u-padding-y--3 ds-u-display--block">
            Back to {dataset.title}
          </Link>
          <h1 className="ds-title">{customTitle ? customTitle : pageTitle}</h1>
          <p
            className="ds-u-margin-top--0 dc-c-metadata-description"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(distribution.data.description) }}
          />
          {resource.columns && Object.keys(resource.schema).length && (
            <QueryBuilder
              resource={resource}
              id={distribution.identifier}
              customColumns={customColumns}
            />
          )}
          {resource.columns && Object.keys(resource.schema).length ? (
            <div>
              <ResourceHeader
                includeDensity={true}
                setTablePadding={setTablePadding}
                distribution={distribution}
                resource={resource}
                downloadUrl={downloadUrl}
                tablePadding={tablePadding}
                includeDownload
              />
              <ResourcePreview
                id={distribution.identifier}
                tablePadding={tablePadding}
                resource={resource}
                customColumns={buildCustomColHeaders(
                  customColumns,
                  resource.columns,
                  resource.schema[distribution_array[distIndex].identifier]
                )}
                columnSettings={columnSettings}
                options={{
                  layout: 'flex',
                  columnFilter: false,
                  columnSort: true,
                  columnResize: true,
                }}
                columnWidths={columnWidths}
              />
              <ResourceFooter resource={resource} />
            </div>
          ) : (
            <Spinner role="status" aria-valuetext="Resource loading" />
          )}
          {dataset.identifier && (
            <div ref={apiDocs}>
              <h2 className="ds-text-heading--2xl ds-u-margin-y--2">Try the API</h2>
              <SwaggerUI
                url={`${rootUrl}/metastore/schemas/dataset/items/${
                  dataset.identifier
                }/docs${
                  additionalParams && additionalParams.ACA
                    ? '?ACA=' + additionalParams.ACA + '&redirect=false'
                    : ''
                }`}
                docExpansion={'list'}
                defaultModelsExpandDepth={-1}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

FilteredResourceBody.defaultProps = {
  apiDocPage: '/api',
};

export default FilteredResourceBody;
