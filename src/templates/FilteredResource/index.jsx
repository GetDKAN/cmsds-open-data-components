import React, { useRef } from 'react';
import { Link } from '@reach/router';
import { ApiDocs } from '@civicactions/data-catalog-components';
import { Resource, useMetastoreDataset, transformURLtoDatastoreQuery } from '@civicactions/data-catalog-services';
import { HelpDrawerToggle, Button } from '@cmsgov/design-system';
import ResourceFilter from '../../components/ResourceFilter';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';

const FilteredResource = ({id, dist_id, location}) => {
  const [tablePadding, setTablePadding] = React.useState('ds-u-padding-y--1')
  let apiDocs = useRef();
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const {dataset} = useMetastoreDataset(id, process.env.REACT_APP_ROOT_URL);
  let distribution = dataset.distribution ? dataset.distribution : [];
  let resource = {};
  if(distribution.length) {
    resource = distribution.find((dist) => dist.identifier === dist_id);
  }
  let buttonRef = null;
  const options = location.search ? {...transformURLtoDatastoreQuery(location.search)} : {conditions: []}
  return (
    <section className="ds-l-container ds-u-padding-bottom--3">
      {Object.keys(resource).length
        && (
          <>
            <Link
              to={`/dataset/${id}`}
              className="ds-u-padding-y--3 ds-u-display--block"
            >
              Back to {dataset.title}
            </Link>
            <h1 className="ds-title">{resource.data.title}</h1>
            <p>{resource.data.description}</p>
            <div className="ds-l-row ds-u-align-items--stretch ds-u-margin-bottom--3">
              <div className="ds-l-col--4">
                <div class="dc-c-resource-action ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column ds-u-text-align--center">
                  <h2 className="ds-u-padding-left--3  ds-u-text-align--left">Create</h2>
                  <HelpDrawerToggle
                    helpDrawerOpen={filtersOpen}
                    showDrawer={() => setFiltersOpen(!filtersOpen)}
                    className="ds-c-button ds-c-button--primary"
                  >
                    Filter data
                  </HelpDrawerToggle>
                </div>
              </div>
              <div className="ds-l-col--4">
                <div class="ds-u-border--1 ds-u-radius">
                  <h2 className="ds-u-padding-left--3">Access</h2>
                  <Button variation="transparent" className="ds-u-text-align--left">
                    Download filtered view (CSV)
                  </Button>
                  <Button variation="transparent" className="ds-u-text-align--left">
                    Copy link to filtered view
                  </Button>
                </div>
              </div>
              <div className="ds-l-col--4">
                <div class=" ds-u-border--1 ds-u-radius">
                  <h2 className="ds-u-padding-left--3">Try API</h2>
                  <Button variation="transparent" onClick={() => window.scrollTo({ behavior: 'smooth', top: apiDocs.current.offsetTop })}>
                    Scroll to filtered view API
                  </Button>
                  <Button variation="transparent">
                    View API documentation
                  </Button>
                </div>
              </div>
            </div>
            <Resource
              distribution={resource}
              rootUrl={process.env.REACT_APP_ROOT_URL}
              options={options}
            >
              <ResourceHeader />
              <ResourcePreview id={dist_id} tablePadding={tablePadding} />
              {filtersOpen
                && ( <ResourceFilter id={dist_id} filterOpen={filtersOpen} setFilterOpen={setFiltersOpen} helpDrawerButton={buttonRef} /> )
              }
            </Resource>
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
