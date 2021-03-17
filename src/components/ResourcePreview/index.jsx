import React from 'react';
import { DataTable } from '@civicactions/data-catalog-components';
import { ResourceDispatch, transformTableFilterToQueryCondition, transformTableSortToQuerySort } from '@civicactions/data-catalog-services';
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

const ResourceContent = ({tablePadding, id, options}) => {
  const value = React.useContext(ResourceDispatch);
  const tableClasses = {
    tableContainerClassName: '',
    headerCellClassName: 'ds-u-border--dark ds-u-padding--2 ds-u-border-y--2 ds-u-border-right--1 ds-u-text-align--right ds-u-font-weight--bold ds-u-display--flex ds-u-justify-content--end',
    headerGroupClassName: '',
    headerCellTextClassName: 'ds-u-truncate ds-u-display--inline-block',
    cellEvenRowClassName: 'ds-u-fill--gray-lightest',
    cellClassName: `${tablePadding} ds-u-text-align--right`,
    filterTitleClassName: 'ds-u-font-weight--bold ds-u-padding-left--2  ds-u-fill--gray-lightest ds-u-display--block',
    headerFilterClassName: 'ds-u-padding-top--1 ds-u-fill--gray-lightest',
    headerFilterCellClassName: 'ds-u-padding-x--1 ds-u-padding-bottom--0 ds-u-border-bottom--0 ds-u-fill--gray-lightest',
    columnIsSortedClassName: 'dc-c-sort dc-c-sort--default',
    columnIsSortedAscClassName: 'dc-c-sort dc-c-sort--asc',
    columnIsSortedDecClassName: 'dc-c-sort dc-c-sort--desc',
  }
  return(
    <div>
      <DataTable
        filterTitle="Filter columns"
        data={value.items}
        columns={prepareColumns(value.columns, value.schema[id])}
        schema={value.schema}
        totalRows={value.totalRows}
        limit={value.limit}
        offset={value.offset}
        loading={value.loading}
        setSort={value.actions.setSort}
        setConditions={value.actions.setConditions}
        conditionsTransform={transformTableFilterToQueryCondition}
        sortTransform={transformTableSortToQuerySort}
        tableClasses={tableClasses}
        className="dc-c-datatable ds-u-border--dark ds-u-border-x--1"
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
