import React, { useEffect, useRef } from 'react';
import qs from 'qs';
import { Link, useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import { useDatastore } from '@civicactions/data-catalog-services';
import {
  HelpDrawerToggle,
  Button,
  Tooltip,
  Spinner,
  Accordion,
  AccordionItem,
} from '@cmsgov/design-system';
import ResourceFilter from '../../components/ResourceFilter';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceFooter from '../../components/ResourceFooter';
import { buildCustomColHeaders } from './functions';
import QueryBuilder from './QueryBuilder';

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
    process.env.REACT_APP_ROOT_URL,
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
    process.env.REACT_APP_ROOT_URL
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
            className="ds-u-margin-top--0"
            dangerouslySetInnerHTML={{ __html: distribution.data.description }}
          />
          {resource.columns && Object.keys(resource.schema).length && (
            <QueryBuilder
              resource={resource}
              id={distribution.identifier}
              customColumns={customColumns}
            />
          )}

          {/* <div className="ds-l-row ds-u-align-items--stretch">
            <div className="ds-l-md-col--4 ds-l-sm-col--12 ds-u-margin-bottom--3">
              <div className="dc-c-resource-action ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column ds-u-text-align--center">
                <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-bottom--2 ds-u-padding-bottom--0 ds-u-padding-left--3 ds-u-padding-left--3  ds-u-text-align--left">
                  Create a filter
                </h2>
                <div className="dc-filtered-resource-toggle">
                  <HelpDrawerToggle
                    helpDrawerOpen={filtersOpen}
                    showDrawer={() => setFiltersOpen(!filtersOpen)}
                    className="ds-u-text-decoration--none ds-u-font-weight--bold ds-c-button ds-c-button--primary ds-u-padding-y--1 ds-u-padding-x--3"
                  >
                    Filter data
                  </HelpDrawerToggle>
                </div>
              </div>
            </div>
            <div className="ds-l-md-col--4 ds-l-sm-col--12 ds-u-margin-bottom--3">
              <div className="ds-u-border--1 ds-u-radius">
                <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-bottom--0 ds-u-padding-bottom--0 ds-u-padding-left--3">
                  Access
                </h2>
                <Button
                  variation="transparent"
                  className="ds-u-text-align--left ds-u-font-weight--normal"
                  href={downloadUrl}
                >
                  Download filtered view (CSV)
                </Button>
                <Tooltip
                  onOpen={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="ds-c-button ds-c-button--transparent ds-u-text-align--left"
                  placement="bottom"
                  dialog
                  title="Link copied to clipboard"
                >
                  Copy link to filtered view
                </Tooltip>
              </div>
            </div>
            <div className="ds-l-md-col--4 ds-l-sm-col--12 ds-u-margin-bottom--3">
              <div className=" ds-u-border--1 ds-u-radius">
                <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-bottom--0 ds-u-padding-bottom--0 ds-u-padding-left--3 ds-u-padding-left--3">
                  Try API
                </h2>
                <Button
                  variation="transparent"
                  className="ds-u-text-align--left ds-u-font-weight--normal"
                  onClick={() =>
                    window.scrollTo({
                      behavior: 'smooth',
                      top: apiDocs.current.offsetTop,
                    })
                  }
                >
                  Scroll to filtered view API
                </Button>
                <Button
                  variation="transparent"
                  className="ds-u-text-align--left ds-u-font-weight--normal"
                  onClick={() => navigate(apiDocPage)}
                >
                  View API documentation
                </Button>
              </div>
            </div>
          </div> */}
          {resource.columns && Object.keys(resource.schema).length ? (
            <div>
              <ResourceHeader
                includeDensity={true}
                setTablePadding={setTablePadding}
                distribution={distribution}
                resource={resource}
                downloadUrl={downloadUrl}
                tablePadding={tablePadding}
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
              {/* {filtersOpen && (
                <ResourceFilter
                  id={distribution.identifier}
                  resource={resource}
                  filterOpen={filtersOpen}
                  setFilterOpen={setFiltersOpen}
                  helpDrawerButton={buttonRef}
                />
              )} */}
            </div>
          ) : (
            <Spinner role="status" aria-valuetext="Resource loading" />
          )}
          {dataset.identifier && (
            <div ref={apiDocs}>
              <h2>Try the API</h2>
              <SwaggerUI
                url={`${process.env.REACT_APP_ROOT_URL}/metastore/schemas/dataset/items/${
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
