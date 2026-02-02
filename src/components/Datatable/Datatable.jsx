import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Spinner, Alert, Tooltip, Button } from "@cmsgov/design-system";
import TruncatedResizeableTHead from "./TruncatedResizeableTHead";
import FixedSizeTHead from "./FixedSizeTHead";
import "./datatable.scss";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import { DataTableActionsContext } from "../DatasetTableTab/DataTableActionsContext";
import DataTableToolbar from "../DataTableToolbar";

const DataTable = ({
  columns,
  sortTransform,
  tablePadding,
  canResize,
  loading = false,
  isModal,
  downloadURL,
  unfilteredDownloadURL,
  setPage,
  showCopyLinkButton,
  showDataTableToolbar,
  showDownloadFilteredDataButton,
  showDownloadFullDataButton,
  showStoredQueryDownloadButton,
}) => {
  const { id, resource, datasetTableControls, dataDictionaryBanner } = useContext(DataTableContext);
  const { columnOrder, setColumnOrder, columnVisibility, setColumnVisibility } = useContext(DataTableActionsContext);
  const { conditions } = resource;

  const data = resource.values;
  const [ sorting, setSorting ] = useState([])
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
      {showDataTableToolbar && (
        <>
          <div className="ds-u-margin-bottom--3">
          {showDownloadFullDataButton && (
            <Button
              className="ds-c-button ds-c-button--solid ds-l-col--12 ds-l-md-col--auto"
              href={unfilteredDownloadURL}
            >
              <span className="ds-u-font-weight--bold ds-u-font-size--md ds-u-margin-x--0 ds-u-padding--0">
                <i className="fas fa-file-csv"></i> Download full dataset (CSV)
              </span>
            </Button>
          )}
          </div>
          <DataTableToolbar
            id={id}
            columns={table.getAllLeafColumns()}
            defaultColumnOrder={defaultColumnOrder}
            isModal={isModal}
            resource={resource}
            datasetTableControls={datasetTableControls}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <div className="ds-u-display--flex ds-l-col--12 ds-l-md-col--11 ds-u-justify-content--between ds-u-padding--0 ds-u-margin-y--2 ds-u-md-margin-y--3 ds-u-flex-direction--column ds-u-md-flex-direction--row">
            <div className="dkan-data-table-info-container ds-u-padding-right--0 ds-u-md-padding-right--4">
              {dataDictionaryBanner && !isModal && (
                <div className="ds-u-margin-bottom--3">
                  <Alert>Click on the "Data Dictionary" tab above for full column definitions</Alert>
                </div>
              )}
              <p className="ds-u-margin--0">Activate the column resize button and use the right and left arrow keys to resize a column or use your mouse to drag/resize. Press escape to cancel the resizing.</p>
            </div>
            <div className="dkan-data-table-share-container ds-l-col--auto ds-u-padding--0 ds-u-margin-bottom--2 ds-u-md-margin-bottom--0">
              <Tooltip
                className="ds-c-button ds-c-button--solid dkan-data-table-share-button ds-u-display--flex ds-u-align-items--center ds-u-padding-x--3 ds-u-padding-y--1 ds-u-font-weight--bold ds-l-col--12 ds-l-md-col--auto ds-u-justify-content--center"
                activeClassName="dkan-data-table-share-tooltip-open"
                dialog
                offset={[
                  0,
                  5
                ]}
                aria-haspopup="dialog"
                placement="bottom-start"
                maxWidth="320px"
                title={
                  <div className="dc-c-resource-header--buttons ds-u-display--flex ds-u-flex-direction--column ds-l-col--12 ds-u-padding-x--0">
                    {showCopyLinkButton && (
                      <>
                        {conditions && conditions.length ? (
                          <Tooltip
                            onOpen={() => {
                              navigator.clipboard.writeText(window.location.href);
                            }}
                            className="ds-c-button ds-u-text-align--center ds-l-col--12 ds-u-padding-x--2 ds-u-margin-x--0 ds-u-margin-bottom--1"
                            placement="bottom"
                            dialog
                            ariaLabel="Copy link to filtered data"
                            title="Link copied to clipboard"
                            aria-disabled={!conditions || conditions.length === 0}
                          >
                            <span className="ds-u-font-weight--normal ds-u-font-size--md ds-u-margin-x--0 ds-u-padding--0">
                              <i className="fas fa-copy"></i> Copy link to filtered data
                            </span>
                          </Tooltip>
                        ) : (
                          <Button
                            aria-disabled={true}
                            aria-label="Copy link to filtered data"
                            className="ds-c-button ds-u-text-align--center ds-l-col--12 ds-u-padding-x--2 ds-u-margin-x--0 ds-u-margin-bottom--1"
                          >
                            <span className="ds-u-font-weight--normal ds-u-font-size--md ds-u-padding--0">
                              <i className="fas fa-copy"></i> Copy link to filtered data
                            </span>
                          </Button>
                        )}
                      </>
                    )}
                    {(showDownloadFilteredDataButton || showStoredQueryDownloadButton) && (
                      <div className="ds-l-col--12 ds-u-padding-x--0 ds-u-margin-x--0">
                        <Button
                          className="ds-u-text-align--center ds-u-display--inline-block ds-l-col--12 ds-u-padding-x--2 ds-u-margin-x--0 ds-u-margin-bottom--1"
                          href={(conditions && conditions.length) ? downloadURL : null}
                          aria-disabled={!conditions || conditions.length === 0}
                        >
                          <span className="ds-u-font-weight--normal ds-u-font-size--md ds-u-padding--0">
                            <i className="fas fa-file-csv"></i> {showDownloadFilteredDataButton ? `Download filtered data (CSV)` : `Download stored query data (CSV)`}
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                }
              >
                <i className="far fa-share-alt"></i>
                <span className="ds-u-margin-x--05">Share</span>
                <i className="fa fa-chevron-down"></i>
                <i className="fa fa-chevron-up"></i>
              </Tooltip>
            </div>
          </div>
        </>
      )}
      <div className="dc-c-datatable-wrapper ds-u-border-x--1 ds-u-border-bottom--1" tabIndex={0} ref={dataTableWrapperElement}>
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
            ? <TruncatedResizeableTHead table={table} sortElement={sortElement} />
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
