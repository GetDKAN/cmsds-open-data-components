import React from 'react';
import { ResourceDispatch } from '@civicactions/data-catalog-services';
import { DataTablePageResults } from '@civicactions/data-catalog-components';
import DataTableDensity from '../../components/DataTableDensity';
import ManageColumns from '../../components/ManageColumns';
import DataTableRowChanger from '../../components/DataTableRowChanger';

const ResourceHeader = ({ setTablePadding }) => {
  const {
    limit,
    offset, 
    totalRows,
    actions } = React.useContext(ResourceDispatch);
  const { setLimit, setOffset } = actions;
  return(
    <div>
      <div className="ds-l-row">
        <div className="ds-l-col--6">
          <ManageColumns />
        </div>
        <div className="ds-l-col--6">
          <DataTableDensity setTablePadding={setTablePadding} />
        </div>
      </div>
      <div className="ds-l-row">
        <div className="ds-l-col--6">
          <DataTablePageResults
            totalRows={totalRows}
            limit={limit}
            offset={offset}
          />
        </div>
        <div className="ds-l-col--6">
          <DataTableRowChanger setLimit={setLimit} setOffset={setOffset} />
        </div>
      </div>
    </div>
  );
}

export default ResourceHeader;