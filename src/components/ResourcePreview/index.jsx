import React, { useContext } from 'react';

import { Spinner, TextField } from '@cmsgov/design-system';
import { transformTableSortToQuerySort} from '../../services/useDatastore/transformSorts';
import { buildCustomColHeaders } from '../../templates/FilteredResource/functions';
import DataTable from '../Datatable';
import DataTableContext from "../../templates/Dataset/DataTableContext";

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
}) => {
  const {resource, customColumns} = useContext(DataTableContext);

  const customColumnHeaders = buildCustomColHeaders(
    customColumns,
    resource.columns,
    resource.schema[id]
  );

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
      className="ds-u-overflow--auto ds-u-border-x--1 ds-u-border-bottom--1"
    >
      <DataTable
        canResize={canResize}
        columns={
          customColumns ? customColumns : prepareColumns(resource.columns, resource.schema[id])
        }
        sortTransform={transformTableSortToQuerySort}
        tablePadding={tablePadding}
        loading={resource.loading}
        className="dc-c-datatable"
        customColumnFilter={DefaultColumnFilter}
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
