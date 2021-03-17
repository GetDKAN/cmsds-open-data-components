import React from 'react';
import { Link } from '@reach/router';
import { Resource, useMetastoreDataset, transformURLtoDatastoreQuery } from '@civicactions/data-catalog-services';
import { HelpDrawerToggle, Button } from '@cmsgov/design-system';
import ResourceFilter from '../../components/ResourceFilter';
import ResourceHeader from '../../components/ResourceHeader';
import ResourcePreview from '../../components/ResourcePreview';

const FilteredResource = ({id, dist_id, location}) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const {dataset} = useMetastoreDataset(id, process.env.REACT_APP_ROOT_URL);
  let distribution = dataset.distribution ? dataset.distribution : [];
  let resource = {};
  if(distribution.length) {
    resource = distribution.find((dist) => dist.identifier === dist_id);
  }
  const options = location.search ? {...transformURLtoDatastoreQuery(location.search)} : {conditions: []}
  return (
    <section className="ds-l-container ds-u-padding-bottom--3">
      {Object.keys(resource).length
        && (
          <div>
            <Link to={`/dataset/${id}`}>Back to {dataset.title}</Link>
            <h1 className="ds-title">{resource.data.title}</h1>
            <p>{resource.data.description}</p>
            <div className="ds-u-display--flex ds-u-justify-content--between">
              <div className="ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column">
                <h2>Create</h2>
                <HelpDrawerToggle
                  helpDrawerOpen={filtersOpen}
                  showDrawer={() => setFiltersOpen(!filtersOpen)}
                >
                  Filter data
                </HelpDrawerToggle>
              </div>
              <div className="ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column">
                <h2 className="ds-u-padding-left--3">Access</h2>
                <Button variation="transparent" className="ds-u-text-align--left">
                  Download filtered view (CSV)
                </Button>
                <Button variation="transparent" className="ds-u-text-align--left">
                  Copy link to filtered view
                </Button>
              </div>
              <div className="ds-u-border--1 ds-u-radius ds-u-display--flex ds-u-flex-direction--column">
              <h2 className="ds-u-padding-left--3">Try API</h2>
                <Button variation="transparent">
                  Scroll to filtered view API
                </Button>
                <Button variation="transparent">
                  View API documentation
                </Button>
              </div>
            </div>
            <Resource
              distribution={resource}
              rootUrl={process.env.REACT_APP_ROOT_URL}
              options={options}
            >
              <ResourceHeader />
              <ResourcePreview id={dist_id}/>
              {filtersOpen
                && ( <ResourceFilter id={dist_id} filterOpen={filtersOpen} setFilterOpen={setFiltersOpen}/> )
              }
            </Resource>
          </div>
        )
      }
    </section>
  )
}

export default FilteredResource;
