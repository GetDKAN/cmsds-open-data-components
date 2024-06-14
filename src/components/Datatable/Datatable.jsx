import React, { useState } from "react";
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

      sorting,
    },
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

   React.useEffect(() => {
    const normalizedSort = sortTransform ? sortTransform(sorting) : filters;
    setSort(normalizedSort);
  }, [sorting]);

  return(
    <div>
      <table
        tabIndex={0}
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
          <tbody>
            <tr>
              <td colSpan={columns.length}>
                <Spinner aria-valuetext="Dataset loading" role="status" className="ds-u-margin--3" />
              </td>
            </tr>
          </tbody>
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
        {table.getRowModel().rows.length === 0 && (
          <Alert variation="warn">No results found for the current filters</Alert>
        )}
    </div>
  )
}

export default DataTable;
