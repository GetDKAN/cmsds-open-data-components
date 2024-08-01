import React, { useState, useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Spinner, Alert } from "@cmsgov/design-system";
import TruncatedResizeableTHead from "./TruncatedResizeableTHead";
import FixedSizeTHead from "./FixedSizeTHead";
import "./datatable.scss";
import ManageColumns from "../ManageColumns/ManageColumns";

const DataTable = ({
  data,
  columns,
  setSort,
  sortTransform,
  tablePadding,
  canResize,
  loading = false,
}) => {
  const [ sorting, setSorting ] = React.useState([])
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('')
  const columnHelper = createColumnHelper()
  const table_columns = columns.map((col) => {
    if (col.cell) {
      return (
        columnHelper.accessor(col.accessor, {
          header: col.header,
          cell: col.cell,
        })
      )
    }
    return (
      columnHelper.accessor(col.accessor, {
        header: col.header,
      })
    )
  })
  const [columnOrder, setColumnOrder] = useState(() => {
    const storedColumnOrder = JSON.parse(localStorage.getItem('tableColumnOrder'));
    if (storedColumnOrder)
      return storedColumnOrder;
    else
      return table_columns.map(c => c.accessorKey);
  })
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const storedColumnVisibility = JSON.parse(localStorage.getItem('tableColumnVisibility'));
    if (storedColumnVisibility)
      return storedColumnVisibility;
    else
      return {};
  })

  const sortElement = (isSorted, onClickFn) => {
    if(isSorted === 'asc') {
      return 'dc-c-sort--asc'
    }
    if(isSorted === 'desc') {
      return 'dc-c-sort--desc'
    }
    return 'dc-c-sort--default'
  }
  const filters = []
  const table = useReactTable({
    data: data,
    columns: table_columns,
    manualSorting: true,
    state: {
      columnOrder,
      columnVisibility,
      sorting,
    },
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

   React.useEffect(() => {
    const normalizedSort = sortTransform ? sortTransform(sorting) : filters;
    setSort(normalizedSort);
  }, [sorting]);

  const defaultColumnOrder = useMemo(() => table_columns.map(column => {
    return column.accessorKey
  }));

  return(
    <>
      <div>
        <ManageColumns
          columns={table.getAllLeafColumns()}
          defaultColumnOrder={defaultColumnOrder} 
          setColumnOrder={setColumnOrder}
          setColumnVisibility={setColumnVisibility}
        />
      </div>
      <div className="dc-c-datatable-wrapper" tabIndex={0}>
        <table
          {...{
            style: {
              width: canResize ? table.getCenterTotalSize() : "100%",
            },
          }}
          className="dc-c-datatable"
        >
          {canResize
            ? <TruncatedResizeableTHead table={table} sortElement={sortElement} setAriaLiveFeedback={setAriaLiveFeedback} />
            : <FixedSizeTHead table={table} sortElement={sortElement} />
          }
          {loading ? (
            <tbody></tbody>
          ) : (
            <tbody>
            {table.getRowModel().rows.map((row, index) => {
              const even = (index + 1) % 2 === 0;
              return(
                <tr key={row.id} className={`${even ? "dc-c-datatable--even-row" : ""}`}>
                  {row.getVisibleCells().map((cell) => {
                    let classList = "dc-truncate ds-u-padding-x--1"
                    return (
                      <td
                        {...{
                          key: cell.id,
                          style: {
                            maxWidth: cell.column.getSize(),
                          },
                        }}
                        className={`${classList} ${tablePadding}`}
                        title={cell.getValue()}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              )
              })
            }
            </tbody>
          )}
        </table>
        <div className='sr-only' aria-live='assertive' aria-atomic='true'>{ariaLiveFeedback}</div>
      </div>
      {loading && (
        <Spinner aria-valuetext="Dataset loading" role="status" className="ds-u-margin--3" />
      )}
      {!loading && table.getRowModel().rows.length === 0 && (
        <Alert variation="warn">No results found for the current filters</Alert>
      )}
    </>
  )
}

export default DataTable;
