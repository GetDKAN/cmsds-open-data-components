import React from 'react';
import { DataTable } from '@civicactions/data-catalog-components';
import { transformTableFilterToQueryCondition, transformTableSortToQuerySort } from '@civicactions/data-catalog-services';
import { TextField } from '@cmsgov/design-system';

export function prepareColumns(columns, schema) {
  return columns.map((column) => ({
    Header: schema && schema.fields[column].description ? schema.fields[column].description : column,
    accessor: column,
  }));
}

function DefaultColumnFilter({
  column: { Header, accessor, setFilter, filterValue },
}) {
  return (
    <TextField
      label={`Filter by ${Header}`}
      onChange={(e) => { setFilter(e.target.value) || undefined }}
      labelClassName="ds-u-visibility--screen-reader"
      name={accessor}
      value={filterValue || ''}
    />
  );
}

const ResourceContent = ({tablePadding, id, options, resource, customColumns}) => {
  const tableClasses = {
    tableContainerClassName: '',
    headerCellClassName: 'ds-u-border--dark ds-u-padding--2 ds-u-border-y--2 ds-u-border-right--1 ds-u-font-weight--bold',
    headerGroupClassName: '',
    headerCellTextClassName: 'dc-truncate ds-u-display--inline-block',
    cellEvenRowClassName: 'ds-u-fill--gray-lightest',
    cellClassName: `${tablePadding} dc-truncate ds-u-padding-x--1`,
    filterTitleClassName: 'ds-u-font-weight--bold ds-u-padding-left--2  ds-u-fill--gray-lightest ds-u-display--block',
    headerFilterClassName: 'ds-u-padding-top--1 ds-u-fill--gray-lightest',
    headerFilterCellClassName: 'ds-u-padding-x--1 ds-u-padding-bottom--0 ds-u-border-bottom--0 ds-u-fill--gray-lightest',
    columnIsSortedClassName: 'dc-c-sort dc-c-sort--default',
    columnIsSortedAscClassName: 'dc-c-sort dc-c-sort--asc',
    columnIsSortedDecClassName: 'dc-c-sort dc-c-sort--desc',
    tableColumnResizer: 'dc-c-resize-handle'
  }
  return(
    <div className="ds-u-overflow--scroll ds-u-border-x--1 ds-u-border-bottom--1">
      <DataTable
        filterTitle="Filter columns"
        data={resource.values}
        columns={customColumns ? customColumns : prepareColumns(resource.columns, resource.schema[id])}
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
        columnDefaults={{
          width: 200,
          maxWidth: 300,
          minWidth: 50,
        }}
        customColumnFilter={DefaultColumnFilter}
        options= {options}
      />
      
    </div>
  )
}

ResourceContent.defaultProps = {
  options: {
    layout: 'flex',
    columnFilter: false,
    columnSort: true,
    columnResize: true,
  },
}

export default ResourceContent;
