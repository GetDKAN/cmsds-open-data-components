import React from 'react';
import { Link } from 'react-router-dom';
import { DataTablePageResults } from '@civicactions/data-catalog-components';
import DataTableDensity from '../../components/DataTableDensity';
import ManageColumns from '../../components/ManageColumns';
import DataTableRowChanger from '../../components/DataTableRowChanger';

const ResourceHeader = ({
  setTablePadding,
  id,
  distribution,
  includeFiltered,
  includeDensity,
  resource,
  tablePadding,
}) => {
  const { limit, offset, count, setLimit, setOffset } = resource;
  const intCount = count ? parseInt(count) : 0;
  return (
    <div>
      <div className="ds-l-row">
        <div className="ds-l-col--12">
          {includeFiltered && (
            <Link className="ds-c-button ds-c-button--primary" to={`/dataset/${id}/data`}>
              View and filter data
            </Link>
          )}
        </div>
        {includeDensity && (
          <div className="ds-u-text-align--right ds-u-margin-left--auto ds-l-col--6">
            <DataTableDensity setTablePadding={setTablePadding} tablePadding={tablePadding} />
          </div>
        )}
      </div>
      <div className="ds-l-row ds-u-align-items--center">
        <div className="ds-l-col--6">
          <DataTablePageResults totalRows={intCount} limit={limit} offset={offset} />
        </div>
        <div className="ds-l-col--6">
          <DataTableRowChanger limit={limit} setLimit={setLimit} setOffset={setOffset} />
        </div>
      </div>
    </div>
  );
};

export default ResourceHeader;
