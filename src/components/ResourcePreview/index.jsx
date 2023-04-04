import React from 'react';

import { TextField, Spinner } from '@cmsgov/design-system';
import { transformTableFilterToQueryCondition } from '../../services/useDatastore/transformConditions';
import { transformTableSortToQuerySort} from '../../services/useDatastore/transformSorts';
import DataTable from '../Datatable';


function calculateMaxWidth(previewSize) {
  return Math.floor(previewSize * 0.84);
}

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
  options,
  resource,
  defaultSort,
  customColumns,
  truncateCellHeader,
  columnSettings,
  columnWidths,
  customClasses,
  canResize,
}) => {

  return (
    <div
      id="resource-preview"
      className="ds-u-overflow--auto ds-u-border-x--1 ds-u-border-bottom--1"
    >
      <DataTable
        // filterTitle="Filter columns"
        data={resource.values}
        canResize={canResize}
        sortDefaults={defaultSort}
        columns={
          customColumns ? customColumns : prepareColumns(resource.columns, resource.schema[id])
        }
        // schema={resource.schema}
        // totalRows={parseInt(resource.totalRows)}
        // limit={resource.limit}
        // offset={resource.offset}
        // loading={resource.loading}
        setSort={resource.setSort}
        // setConditions={resource.setConditions}
        // conditionsTransform={transformTableFilterToQueryCondition}
        sortTransform={transformTableSortToQuerySort}
        tablePadding={tablePadding}
        className="dc-c-datatable"
        customColumnFilter={DefaultColumnFilter}
        options={options}
        CustomLoadingComponent={
          <div className="ds-u-display--flex ds-u-padding--3">
            <Spinner
              className="ds-u-valign--middle"
              role="status"
              aria-valuetext="Datatable loading"
            />
          </div>
        }
        CustomNoResults={
          <div className="ds-u-display--flex ds-u-padding--3">
            <p>No results returned.</p>
          </div>
        }
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
  truncateHeader: true,
  canResize: true,
};

export default ResourcePreview;
