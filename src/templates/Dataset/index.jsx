import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { useMetastoreDataset, Resource, prepareColumns } from '@civicactions/data-catalog-services';
import { Badge } from '@cmsgov/design-system';
import DataTable from '../../components/DataTable'
import DataTableHeader from '../../components/DataTableHeader';

const Dataset = ({ id, rootUrl }) => {
  const resourceOptions = {
    limit: 25,
    prepareColumns: prepareColumns
  }
  const [tablePadding, setTablePadding] = useState('ds-u-padding-y--1')
  const { dataset, } = useMetastoreDataset(id, rootUrl);
  return (
    <section className="ds-l-container">
      <div className="ds-l-row ds-u-padding-top--3">
        <div className="ds-l-col--8">
          <h1 className="ds-title">{dataset.title}</h1>
          <div className="ds-l-row">
            <p className="ds-l-col--8">
              {dataset.theme ? <Badge>{dataset.theme[0].data}</Badge> : null}
            </p>
            <p className="ds-l-col--4">Updated {dataset.modified}</p>
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
                <DataTableHeader setTablePadding={setTablePadding} />
                <DataTable tablePadding={tablePadding} currentPage={0} />
              </Resource>
            )
          }
        </div>
        <div className="ds-l-col--4">
        {dataset.distribution
          && (
            <div className="ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border--dark ds-u-border--1">
              <h2 className="ds-u-margin-y--0 ds-u-padding-bottom--2 ds-u-border--dark ds-u-border-bottom--1">Downloads</h2>
              <p>Dataset</p>
              <a href={dataset.distribution[0].data.downloadURL}>Download this dataset (CSV)</a>
            </div>
          )}
          <div className="ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border--dark ds-u-border--1">
            <h2 className="ds-u-margin-y--0 ds-u-padding-bottom--2 ds-u-border--dark ds-u-border-bottom--1">Tags</h2>
            {dataset.keyword
              && dataset.keyword.map((k) => <Link to={`/search?keyword=${k.data}`}>{k.data}</Link>)
            }
          </div>
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
