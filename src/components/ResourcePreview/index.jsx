import React, { useContext } from 'react';

import { TextField } from '@cmsgov/design-system';
import { transformTableSortToQuerySort} from '../../services/useDatastore/transformSorts';
import DataTable from '../Datatable';
import { DataTableContext } from '../../templates/Dataset';

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
  canResize,
}) => {
  const {resource, customColumns} = useContext(DataTableContext);

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
        className="dc-c-datatable"
        customColumnFilter={DefaultColumnFilter}
      />
    </div>
  );
};

ResourcePreview.defaultProps = {
  options: {
    layout: 'flex',
    columnFilter: false,
    columnSort: true,
    columnResize: true,
  },
  truncateCellHeader: true,
  defaultSort: [],
  canResize: true,
};

export default ResourcePreview;
