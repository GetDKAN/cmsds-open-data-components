import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResourceDispatch, transformTableFilterToQueryCondition, transformTableFilterToSQLCondition, transformTableSortToQuerySort } from '@civicactions/data-catalog-services';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import { TextField } from '@cmsgov/design-system';
import DataTablePagination from '../DataTablePagination';
import Pagination from '../Pagination';

const DataTable = ({ canFilter, tablePadding }) => {
  const {
    loading,
    items: data,
    actions,
    columns,
    totalRows,
    limit,
    currentPage,
  } = useContext(ResourceDispatch);
  const { setOffset, setCurrentPage, setConditions, setSort } = actions;

  if(columns.length === 0) {
    return null;
  }
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => (
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        })
      ),
    }),
    [],
  );

   // Define a default UI for filtering
   function DefaultColumnFilter({
      column: { filterValue, preFilteredRows, setFilter },
    }) {
    const count = preFilteredRows ? preFilteredRows.length : 0;

    return (
      <TextField
        // label={`Filter by ${column.Header}`}
        onChange={(e) => { setFilter(e.target.value) || undefined }}
        labelClassName="ds-u-visibility--screen-reader"
        // name={column.accessor}
        value={filterValue || ''}
      />
    );
  }

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    rows,
    headerGroups,
    state: { pageIndex, filters, sortBy },
    setPageSize
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: currentPage },
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      pageCount: Math.ceil(totalRows / limit),
      filterTypes,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setSort(transformTableSortToQuerySort(sortBy));
  }, [sortBy])

  useEffect(() => {
    setPageSize(Number(limit))
  }, [limit]);

  useEffect(() => {
    setCurrentPage(pageIndex);
    setOffset((Number(pageIndex)) * limit)
  }, [pageIndex])

  useEffect(() => {
    let timerFunc = setTimeout(() => {
      setConditions(transformTableFilterToQueryCondition(filters))
    }, 1000);
    return () => clearTimeout(timerFunc);
  }, [filters])

  return(
    <div>
      <div className="dc-c-datatable ds-u-border--dark ds-u-border-x--1">
        <table
          {...getTableProps()}
          className="ds-c-table ds-c-table--striped ds-c-table--borderless"
        >
          <thead className="ds-u-border--dark ds-u-border-y--2">
            {headerGroups.map((headerGroup) => (
              <>
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className=""
                >
                  {headerGroup.headers.map((column, index) => (
                    <th 
                      className={`ds-u-border--dark ds-u-fill--white ${index + 1 === columns.length ? '' : 'ds-u-border-right--1'}`}
                      scope="col" 
                      {...column.getHeaderProps(column.getSortByToggleProps({
                        title: column.canSort ? `Sort by ${column.Header}` : undefined,
                      }))}
                    >
                      {column.render('Header')}
                      <span className={`dc-c-sort ${column.isSorted ? column.isSortedDesc ? 'dc-c-sort--desc' : 'dc-c-sort--asc' : 'dc-c-sort--default'}`} />
                    </th>
                  ))}
                </tr>
                {canFilter &&
                  (
                    <>
                      <tr>
                        <th
                          colSpan={columns.length}
                          className={`ds-u-padding-top--1 ds-u-padding-bottom--0 ds-u-border-bottom--0`}
                        >
                          Filter Columns
                        </th>
                      </tr>
                      <tr>
                        {headerGroup.headers.map((column) => {
                          return (
                            <th {...column.getHeaderProps()}>
                              {column.canFilter ? column.render('Filter') : null}
                              
                            </th>
                          )
                        })}
                      </tr>
                    </>
                  )
                }
              </>
            ))}
          </thead>
          {(data && !loading)
            ? (
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td {...cell.getCellProps()} className={`${tablePadding}`}>{cell.render('Cell')}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            )
            : (
              <tbody {...getTableBodyProps()}>
                <tr>
                  <td className={`${tablePadding}`} colSpan={columns.length}>
                    {loading ? 'loading' : 'No data found.'}
                  </td>
                </tr>
              </tbody>
            )
          }
        </table>
      </div>
      <Pagination
        gotoPage={gotoPage}
        currentPage={currentPage}
        totalItems={totalRows}
        itemsPerPage={limit}
      />
    </div>
  )
};

DataTable.defaultProps = {
  canFilter: true,
  tablePadding: 'ds-u-padding-y--1'
}

DataTable.propTypes = {
  canFilter: PropTypes.bool,
  tablePadding: PropTypes.string,
}

export default DataTable;
