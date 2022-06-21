import React from 'react';
import { DataTable } from '@civicactions/data-catalog-components';
import {
  transformTableFilterToQueryCondition,
  transformTableSortToQuerySort,
} from '@civicactions/data-catalog-services';
import { TextField, Spinner } from '@cmsgov/design-system';

function calculateMaxWidth(previewSize) {
  return Math.floor(previewSize * 0.84);
}

export function prepareColumns(columns, schema) {
  return columns.map((column) => ({
    Header:
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
}) => {
  const previewContainer = React.useRef(null);
  const columnDefaults = {
    width: 200,
    maxWidth: previewContainer.current
      ? calculateMaxWidth(previewContainer.current.offsetWidth)
      : 300,
    minWidth: 100,
    ...columnWidths,
  };
  const tableClasses = {
    tableContainerClassName: 'dc-c-table-container',
    headerCellClassName:
      'ds-u-border--dark ds-u-padding--2 ds-u-border-y--2 ds-u-font-weight--bold dc-c-table-header-cell',
    headerGroupClassName: 'dc-c-table-header-group',
    headerCellTextClassName: `${
      truncateCellHeader ? 'dc-truncate' : ''
    } ds-u-display--inline-block`,
    cellEvenRowClassName: 'ds-u-fill--gray-lightest',
    cellClassName: `${tablePadding} dc-truncate ds-u-padding-x--1`,
    filterTitleClassName:
      'ds-u-font-weight--bold ds-u-padding-left--2  ds-u-fill--gray-lightest ds-u-display--block',
    headerFilterClassName: 'ds-u-padding-top--1 ds-u-fill--gray-lightest',
    headerFilterCellClassName:
      'ds-u-padding-x--1 ds-u-padding-bottom--0 ds-u-border-bottom--0 ds-u-fill--gray-lightest',
    columnIsSortedClassName: 'dc-c-sort dc-c-sort--default',
    columnIsSortedAscClassName: 'dc-c-sort dc-c-sort--asc',
    columnIsSortedDecClassName: 'dc-c-sort dc-c-sort--desc',
    tableColumnResizer: 'dc-c-resize-handle',
    tableColumnIsResizing: 'isResizing',
    ...customClasses,
  };
  return (
    <div
      ref={previewContainer}
      id="resource-preview"
      className="ds-u-overflow--auto ds-u-border-x--1 ds-u-border-bottom--1"
    >
      {previewContainer.current && (
        <DataTable
          filterTitle="Filter columns"
          data={resource.values}
          sortDefaults={defaultSort}
          columns={
            customColumns ? customColumns : prepareColumns(resource.columns, resource.schema[id])
          }
          schema={resource.schema}
          totalRows={parseInt(resource.totalRows)}
          limit={resource.limit}
          offset={resource.offset}
          loading={resource.loading}
          setSort={resource.setSort}
          setConditions={resource.setConditions}
          conditionsTransform={transformTableFilterToQueryCondition}
          sortTransform={transformTableSortToQuerySort}
          tableClasses={tableClasses}
          className="dc-c-datatable"
          columnDefaults={columnDefaults}
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
      )}
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
};

export default ResourcePreview;
