import React, { useEffect, useRef } from 'react';
import qs from 'qs';
import { Link } from '@reach/router';
import { ApiDocs } from '@civicactions/data-catalog-components';
import { useMetastoreDataset, useDatastore } from '@civicactions/data-catalog-services';
import { HelpDrawerToggle, Button, Tooltip, Spinner } from '@cmsgov/design-system';
import ResourceFilter from '../../components/ResourceFilter';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';
import ResourceFooter from '../../components/ResourceFooter';

const FilteredResource = ({id, dist_id, location}) => {
  const [tablePadding, setTablePadding] = React.useState('ds-u-padding-y--1')
  let apiDocs = useRef();
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const {dataset} = useMetastoreDataset(id, process.env.REACT_APP_ROOT_URL);
  let distribution = {};
  let distribution_array = dataset.distribution ? dataset.distribution : [];
  if(distribution_array.length) {
    distribution = distribution_array.find((dist) => dist.identifier === dist_id);
  }
  let buttonRef = null;
  const options = location.search ? {...qs.parse(location.search)} : {conditions: []};
  const resource = useDatastore('', process.env.REACT_APP_ROOT_URL, {
    ...options,
    limit: 25,
    manual: true,
  })
  useEffect(() => {
    if(distribution.identifier) {
      resource.setResource(distribution.identifier);
      resource.setManual(false)
    }
  }, [distribution])
  const downloadUrl = `${process.env.REACT_APP_ROOT_URL}/datastore/query/${distribution.identifier}/download?${qs.stringify({conditions: resource.conditions}, { encode: false })}&format=csv`;

  return (
    <section className="ds-l-container ds-u-padding-bottom--3 ds-u-margin-bottom--2">
      {Object.keys(distribution).length
        && (
          <>
            <Link
              to={`/dataset/${id}`}
              className="ds-u-padding-y--3 ds-u-display--block"
            >
              Back to {dataset.title}
            </Link>
            <h1 className="ds-title">{distribution.data.title}</h1>
            <p className="ds-u-margin-top--0" dangerouslySetInnerHTML={{__html: distribution.data.description}} />
            <div className="ds-l-row ds-u-align-items--stretch">
              <div className="ds-l-md-col--4 ds-l-sm-col--12 ds-u-margin-bottom--3">
                <div className="dc-c-resource-action ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column ds-u-text-align--center">
                  <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-bottom--2 ds-u-padding-bottom--0 ds-u-padding-left--3 ds-u-padding-left--3  ds-u-text-align--left">Create</h2>
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
                  <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-bottom--0 ds-u-padding-bottom--0 ds-u-padding-left--3">Access</h2>
                  <Button
                    variation="transparent"
                    className="ds-u-text-align--left ds-u-font-weight--normal"
                    href={downloadUrl}
                  >
                    Download filtered view (CSV)
                  </Button>
                  <Tooltip
                    onOpen={() => {navigator.clipboard.writeText(window.location.href);}}
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
                  <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-y--0 ds-u-padding-bottom--0 ds-u-padding-left--3 ds-u-padding-left--3">Try API</h2>
                  <Button
                    variation="transparent"
                    className="ds-u-text-align--left ds-u-font-weight--normal" 
                    onClick={() => window.scrollTo({ behavior: 'smooth', top: apiDocs.current.offsetTop })}
                  >
                    Scroll to filtered view API
                  </Button>
                  <Button
                    variation="transparent"
                    className="ds-u-text-align--left ds-u-font-weight--normal"
                  >
                    View API documentation
                  </Button>
                </div>
              </div>
            </div>
            {resource.columns
              ? (
                <div>
                  <ResourceHeader includeDensity={true} setTablePadding={setTablePadding} distribution={distribution} resource={resource} />
                  <ResourcePreview id={dist_id} tablePadding={tablePadding} resource={resource} />
                  <ResourceFooter resource={resource} />
                  {filtersOpen
                    && (<ResourceFilter
                          id={dist_id}
                          resource={resource}
                          filterOpen={filtersOpen}
                          setFilterOpen={setFiltersOpen}
                          helpDrawerButton={buttonRef}
                        />)
                  }
                </div>
                
              )
              : (
                <Spinner />
              )
            }
            {dataset.identifier &&
              <div ref={apiDocs}>
                <h2>Try out the API</h2>
                <ApiDocs 
                  endpoint={`${process.env.REACT_APP_ROOT_URL}`}
                  datasetID={dataset.identifier}
                />
              </div>
            }
          </>
        )
      }
    </section>
  )
}

export default FilteredResource;
