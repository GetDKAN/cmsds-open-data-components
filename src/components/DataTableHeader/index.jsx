import React from 'react';
import { ResourceDispatch } from '@civicactions/data-catalog-services';
import ManageColumns from '../ManageColumns';
import DataTableDensity from '../DataTableDensity';
import DataTableRowDetails from '../DataTableRowDetails';
import DataTableRowChanger from '../DataTableRowChanger';

const DataTableHeader = ({ setTablePadding }) => {
  const {
    limit,
    offset, 
    totalRows,
    currentPage,
    actions } = React.useContext(ResourceDispatch);
  const { setLimit } = actions;
  return (
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
          <DataTableRowDetails
            currentPage={currentPage}
            limit={limit}
            offset={offset}
            totalRows={totalRows}
          />
        </div>
        <div className="ds-l-col--6">
          <DataTableRowChanger setLimit={setLimit} />
        </div>
      </div>
    </div>
  )
}

export default DataTableHeader;
