import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
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
// import DataTableControls from "../DataTableControls";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import ManageColumnsContext from "../ManageColumns/ManageColumnsContext";

const DataTable = ({
  columns,
  sortTransform,
  tablePadding,
  canResize,
  loading = false,
  isModal,
  closeFullScreenModal,
}) => {
  const { id, resource, datasetTableControls } = useContext(DataTableContext);
  const { columnOrder, setColumnOrder, columnVisibility, setColumnVisibility} = useContext(ManageColumnsContext);

  const data = resource.values;
  const [ sorting, setSorting ] = useState([])
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('')
  const dataTableWrapperElement = useRef(null)
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

  const [ highlightRow, setHighlightRow ] = useState(null);

  useEffect(() => {
    if (columnOrder && !columnOrder.length)
      setColumnOrder(table_columns.map(c => c.accessorKey))
  }, [columnOrder])

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

  useEffect(() => {
    const normalizedSort = sortTransform ? sortTransform(sorting) : filters;
    resource.setSort(normalizedSort);
  }, [sorting]);

  const defaultColumnOrder = useMemo(() => table_columns.map(column => column.accessorKey), []);
  const tableWrapperWidth = () => {
    if (dataTableWrapperElement.current) {
      return dataTableWrapperElement.current.offsetWidth;
    }

    return 'auto';
  };

  useEffect(() => {
    setHighlightRow(null);
  }, [data])

  return(
    <>
      {/* { datasetTableControls && (
        <div>
          <DataTableControls
            id={id}
            columns={table.getAllLeafColumns()}
            defaultColumnOrder={defaultColumnOrder}
            isModal={isModal}
            closeFullScreenModal={closeFullScreenModal}
          />
        </div>
      )} */}
      <div className="dc-c-datatable-wrapper" tabIndex={0} ref={dataTableWrapperElement}>
        <table
          {...{
            style: {
              width: canResize ? table.getCenterTotalSize() : "100%",
              minWidth: tableWrapperWidth()
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
              const highlight = highlightRow === row.id;
              return(
                <tr key={row.id} className={`${highlight ? "dc-c-datatable--highlight-row" : (even && "dc-c-datatable--even-row")}`} onClick={() => setHighlightRow(row.id)}>
                  {row.getVisibleCells().map((cell) => {
                    let classList = "dc-truncate ds-u-padding-x--1"
                    return (
                      <td
                          key={cell.id}
                          style= {{
                            maxWidth: cell.column.getSize(),
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
