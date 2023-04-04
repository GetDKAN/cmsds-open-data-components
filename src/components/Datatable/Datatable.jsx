import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  ColumnResizeMode,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { ArrowsStackedIcon, ArrowIcon } from "@cmsgov/design-system";
import TruncatedResizeableTHead from "./TruncatedResizeableTHead";
import FixedSizeTHead from "./FixedSizeTHead";
import "./datatable.scss";

const DataTable = ({
  data,
  columns,
  sortDefaults,
  setSort,
  sortTransform,
  className,
  tablePadding,
  canResize,
}) => {
  const [ sorting, setSorting ] = React.useState([])
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
          ? <TruncatedResizeableTHead table={table} sortElement={sortElement} />
          : <FixedSizeTHead table={table} sortElement={sortElement} />
        }
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
            })}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable;
