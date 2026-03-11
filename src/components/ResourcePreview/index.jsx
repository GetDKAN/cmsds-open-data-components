import React, { useContext } from 'react';

import { Spinner, TextField } from '@cmsgov/design-system';
import { transformTableSortToQuerySort} from '../../services/useDatastore/transformSorts';
import { buildCustomColHeaders } from '../../templates/FilteredResource/functions';
import DataTable from '../Datatable';
import DataTableContext from "../../templates/Dataset/DataTableContext";
import { DataTableActionsContext } from '../DatasetTableTab/DataTableActionsContext';

export function prepareColumns(columns, schema) {
  return columns.map((column) => ({
    header:
      schema && schema.fields[column].description ? schema.fields[column].description : column,
    accessor: column,
  }));
}

function DefaultColumnFilter({ column: { Header, accessor, setFilter, filterValue } }) {
  return (
    <TextField
      label={`Filter by ${Header}`}
      onChange={(e) => {
        setFilter(e.target.value) || undefined;
      }}
      labelClassName="ds-u-visibility--screen-reader"
      name={accessor}
      value={filterValue || ''}
    />
  );
}

const ResourcePreview = ({
  tablePadding,
  id,
  canResize = true,
  showDataTableToolbar = false,
  showInfoShareContainer = true,
  showTableResults = true,
  showFilterDatasetButton = true,
  showManageColumnsButton = true,
  showDisplaySettingsButton = true,
  showFullScreenButton = true,
}) => {
  const {resource, customColumns} = useContext(DataTableContext);
  const { tableDensity } = useContext(DataTableActionsContext);

  const customColumnHeaders = customColumns
    ? buildCustomColHeaders(customColumns, resource.columns, resource.schema[id])
    : null;

  const columns = customColumnHeaders
    ? customColumnHeaders
    : prepareColumns(resource.columns, resource.schema[id]);

  if (
    Object.keys(resource).length &&
    columns.length &&
    resource.schema
  ) {
    return (
    <div
      id="resource-preview"
      className="ds-u-overflow--auto"
    >
      <DataTable
        canResize={canResize}
        columns={
          customColumns ? customColumns : prepareColumns(resource.columns, resource.schema[id])
        }
        sortTransform={transformTableSortToQuerySort}
        tablePadding={
          typeof tablePadding === 'function' ? tablePadding(tableDensity) : tablePadding
        }
        loading={resource.loading}
        className="dc-c-datatable"
        customColumnFilter={DefaultColumnFilter}
        showDataTableToolbar={showDataTableToolbar}
        showInfoShareContainer={showInfoShareContainer}
        showTableResults={showTableResults}
        showFilterDatasetButton={showFilterDatasetButton}
        showManageColumnsButton={showManageColumnsButton}
        showDisplaySettingsButton={showDisplaySettingsButton}
        showFullScreenButton={showFullScreenButton}
        isModal={false}
      />
    </div>
  )
} else {
  return (
    <Spinner />
  )
}
};

export default ResourcePreview;
