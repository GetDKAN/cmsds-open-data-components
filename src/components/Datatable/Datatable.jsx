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
import "./datatable.scss";

const DataTable = ({
  data,
  // filterTitle,
  columns,
  // totalRows,
  // limit,
  // loading,
  // options,
  // columnDefaults,
  sortDefaults,
  setSort,
  // setConditions,
  // conditionsTransform,
  sortTransform,
  className,
  tablePadding,
  // customColumnFilter,
  // cellTextClassName,
  // CustomLoadingComponent,
  // CustomNoResults,
}) => {
  const [ sorting, setSorting ] = React.useState([])
  const columnHelper = createColumnHelper()
  const table_columns = columns.map((col) => (
      columnHelper.accessor(col.accessor, {
        header: <span>{col.Header}</span>,
        // cell: <MyCell>{info => info.getValue()}</MyCell>
      })
    ))

  const sortElement = (isSorted, onClickFn) => {
    if(isSorted === 'asc') {
      return <span><ArrowIcon direction="up" /></span>
    }
    if(isSorted === 'desc') {
      return <span><ArrowIcon direction="down" /></span>
    }
    return <span><ArrowsStackedIcon /></span>
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
    debugTable: true,
  });

   React.useEffect(() => {
    const normalizedSort = sortTransform ? sortTransform(sorting) : filters;
    setSort(normalizedSort);
  }, [sorting]);
  return(
    <div>
      <table
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
        className="dc-c-datatable"
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="">
              {headerGroup.headers.map(header => (
                <th {
                  ...{
                    key: header.id,
                    style: {
                      width: header.getSize(),
                    },
                  }
                }
                className="ds-u-padding--2 ds-u-border-y--2 ds-u-border--dark  ds-u-font-weight--bold dc-c-table-header-cell"
                >
                  {header.isPlaceholder
                    ? null
                    : (
                       <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sortElement(header.column.getIsSorted())}
                          <span
                            {...{
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className: `dc-c-resize-handle ${
                                header.column.getIsResizing() ? 'isResizing' : ''
                              }`,
                            }}
                          />
                        </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            const even = (index + 1) % 2 === 0;
            return(
              <tr key={row.id} className={`${even ? "dc-c-datatable--even-row" : ""}`}>
                {row.getVisibleCells().map((cell) => {
                  let classList = "dc-truncate ds-u-padding-x--1"
                  return (
                    <td
                      key={cell.id}
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










  // const tableClasses = {
  //   tableContainerClassName: 'dc-c-table-container',
  //   headerCellClassName:
  //     'ds-u-border--dark ds-u-padding--2 ds-u-border-y--2 ds-u-font-weight--bold dc-c-table-header-cell',
  //   headerGroupClassName: 'dc-c-table-header-group',
  //   headerCellTextClassName: `${
  //     truncateCellHeader ? 'dc-truncate' : ''
  //   } ds-u-display--inline-block`,
  //   cellEvenRowClassName: 'ds-u-fill--gray-lightest',
  //   cellClassName: `${tablePadding} dc-truncate ds-u-padding-x--1`,
  //   filterTitleClassName:
  //     'ds-u-font-weight--bold ds-u-padding-left--2  ds-u-fill--gray-lightest ds-u-display--block',
  //   headerFilterClassName: 'ds-u-padding-top--1 ds-u-fill--gray-lightest',
  //   headerFilterCellClassName:
  //     'ds-u-padding-x--1 ds-u-padding-bottom--0 ds-u-border-bottom--0 ds-u-fill--gray-lightest',
  //   columnIsSortedClassName: 'dc-c-sort dc-c-sort--default',
  //   columnIsSortedAscClassName: 'dc-c-sort dc-c-sort--asc',
  //   columnIsSortedDecClassName: 'dc-c-sort dc-c-sort--desc',
  //   tableColumnResizer: 'dc-c-resize-handle',
  //   tableColumnIsResizing: 'isResizing',
  //   ...customClasses,
  // };







  // const { layout, columnFilter, columnSort, columnResize } = options;
  // const { minWidth, maxWidth, width } = columnDefaults;
  // const {
  //   tableContainerClassName,
  //   headerCellClassName,
  //   headerGroupClassName,
  //   defaultColumnFilterClassName,
  //   cellClassName,
  //   cellFirstRowClassName,
  //   cellEvenRowClassName,
  //   cellOddRowClassName,
  //   tableColumnResizer,
  //   tableColumnIsResizing,
  //   headerCellTextClassName,
  //   filterTitleClassName,
  //   headerFilterClassName,
  //   headerFilterCellClassName,
  //   columnIsSortedClassName,
  //   columnIsSortedAscClassName,
  //   columnIsSortedDecClassName,
  // } = tableClasses;
  // if (columns.length === 0) {
  //   return <p>Loading</p>;
  // }

  // const filterTypes = React.useMemo(
  //   () => ({
  //     // Add a new fuzzyTextFilterFn filter type.
  //     // fuzzyText: fuzzyTextFilterFn,
  //     // Or, override the default text filter to use
  //     // "startWith"
  //     text: (rows, id, filterValue) =>
  //       rows.filter((row) => {
  //         const rowValue = row.values[id];
  //         return rowValue !== undefined
  //           ? String(rowValue)
  //               .toLowerCase()
  //               .startsWith(String(filterValue).toLowerCase())
  //           : true;
  //       }),
  //   }),
  //   []
  // );

  // function DefaultColumnFilter({
  //   column: { Header, accessor, setFilter, filterValue },
  // }) {
  //   return (
  //     <div>
  //       <label
  //         className={defaultColumnFilterClassName}
  //         htmlFor={`filter_${accessor}`}
  //       >
  //         {`Filter ${Header}`}
  //       </label>
  //       <input
  //         className="usa-input margin-bottom-1"
  //         onChange={(e) => {
  //           setFilter(e.target.value) || undefined;
  //         }}
  //         id={`filter_${accessor}`}
  //         name={`filter_${accessor}`}
  //         type="text"
  //         value={filterValue || ""}
  //       />
  //     </div>
  //   );
  // }

  // const defaultColumn = React.useMemo(
  //   () => ({
  //     // Let's set up our default Filter UI
  //     Filter: customColumnFilter ? customColumnFilter : DefaultColumnFilter,
  //     // When using the useFlexLayout:
  //     minWidth: minWidth, // minWidth is only used as a limit for resizing
  //     width: width, // width is used for both the flex-basis and flex-grow
  //     maxWidth: maxWidth, // maxWidth is only used as a limit for resizing
  //   }),
  //   []
  // );

  // const {
  //   getTableProps,
  //   prepareRow,
  //   rows,
  //   headerGroups,
  //   state: { filters, sortBy },
  // } = useReactTable(
  //   {
  //     columns,
  //     data,
  //     filterTypes,
  //     initialState: {
  //       sortBy: sortDefaults
  //     },
  //     manualPagination: true,
  //     manualFilters: true,
  //     manualSortBy: true,
  //     pageCount: Math.ceil(totalRows / limit),
  //     filterTypes,
  //     defaultColumn,
  //   },
  //   // useResizeColumns,
  //   // useFilters,
  //   // useSortBy,
  //   // usePagination,
  //   // layout === "block" ? useBlockLayout : useFlexLayout
  // );


  // useEffect(() => {
  //   let timerFunc = setTimeout(() => {
  //     if (columnFilter) {
  //       const normalizedFilters = conditionsTransform
  //         ? conditionsTransform(filters)
  //         : filters;
  //       setConditions(normalizedFilters);
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timerFunc);
  // }, [filters]);
  // return (
  //   <div className={className} tabIndex="0">
  //     TABLE
  //   </div>
    // <div {...getTableProps()} className={className} tabIndex="0">
    //   <div className={tableContainerClassName}>
    //     {headerGroups.map((headerGroup) => {
    //       return(
    //         <div
    //           {...headerGroup.getHeaderGroupProps()}
    //           className={headerGroupClassName}
    //         >
    //           {headerGroup.headers.map((column) => {
    //             return(
    //               <div key={column.id}>
    //                 <div
    //                   className={headerCellClassName}
    //                   {...column.getHeaderProps(
    //                     columnSort ? column.getSortByToggleProps((props) => ({...props, title: `Sort by ${column.Header}`})) : undefined
    //                   )}
    //                 >
    //                   <span className={headerCellTextClassName}>
    //                     {column.render("Header")}
    //                   </span>
    //                   {columnSort && (
    //                     <span
    //                       className={
    //                         column.isSorted
    //                           ? column.isSortedDesc
    //                             ? columnIsSortedDecClassName
    //                             : columnIsSortedAscClassName
    //                           : columnIsSortedClassName
    //                       }
    //                     />
    //                   )}
    //                 </div>
    //                 {columnResize && (
    //                   <div
    //                     {...column.getResizerProps()}
    //                     className={`${tableColumnResizer} ${
    //                       column.isResizing ? tableColumnIsResizing : ""
    //                     }`}
    //                   />
    //                 )}
    //               </div>
    //             )
    //           })}
    //         </div>
    //       )
    //     })}
    //     {columnFilter && (
    //       <div className={headerFilterClassName}>
    //         {filterTitle && (
    //           <span className={filterTitleClassName}>{filterTitle}</span>
    //         )}
    //         {headerGroups.map((headerGroup) => (
    //           <div {...headerGroup.getHeaderGroupProps()}>
    //             {headerGroup.headers.map((column) => (
    //               <div
    //                 {...column.getHeaderProps()}
    //                 className={headerFilterCellClassName}
    //               >
    //                 <div className="th">
    //                   <div>
    //                     {column.canFilter ? column.render("Filter") : null}
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    //   <div className="tbody">
    //     {loading ? (
    //       CustomLoadingComponent ? (
    //         CustomLoadingComponent
    //       ) : (
    //         <p>Loading...</p>
    //       )
    //     ) : rows.length ? (
    //       rows.map((row, index) => {
    //         const even = (index + 1) % 2 === 0;
    //         prepareRow(row);
    //         let classList = cellClassName;
    //         if (index === 0 && cellFirstRowClassName) {
    //           classList = cellFirstRowClassName;
    //         }
    //         if (even) {
    //           classList += ` ${cellEvenRowClassName}`;
    //         }
    //         if (!even) {
    //           classList += ` ${cellOddRowClassName}`;
    //         }
    //         return (
    //           <div {...row.getRowProps()} className="tr">
    //             {row.cells.map((cell) => {
    //               return (
    //                 <div {...cell.getCellProps()} className={classList}>
    //                   <span className={cellTextClassName}>
    //                     {cell.render("Cell")}
    //                   </span>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         );
    //       })
    //     ) : CustomNoResults ? (
    //       CustomNoResults
    //     ) : (
    //       <p>No results found.</p>
    //     )}
    //   </div>
    // </div>
  // );
};

// DataTable.defaultProps = {
//   filterTitle: "",
//   className: "",
//   tableClasses: {
//     tableContainerClassName: "",
//     tableColumnResizer:
//       "width-1 bg-primary margin-right-neg-05 position-absolute top-0 bottom-0 right-0 z-100",
//     tableColumnIsResizing: "",
//     headerCellClassName:
//       "bg-base-lighter border-top-1px text-right text-bold padding-x-1 overflow-hidden",
//     headerGroupClassName: "",
//     headerCellTextClassName:
//       "overflow-hidden text-no-wrap display-inline-block",
//     defaultColumnFilterClassName: "usa-label usa-sr-only",
//     cellTextClassName: "overflow-hidden text-no-wrap display-inline-block",
//     cellFirstRowClassName: "",
//     cellClassName:
//       "border-right-1px font-mono-sm text-tabular text-right padding-x-105 padding-y-05",
//     cellEvenRowClassName: "bg-base-lightest",
//     cellOddRowClassName: "",
//     filterTitleClassName: "",
//     headerFilterCellClassName:
//       "bg-base-lighter border-bottom-1px border-right-1px padding-x-1",
//     headerFilterClassName: "",
//     columnIsSortedClassName: "",
//     columnIsSortedAscClassName: "",
//     columnIsSortedDecClassName: "",
//   },
//   options: {
//     layout: "flex",
//     columnFilter: true,
//     columnSort: true,
//     columnResize: true,
//   },
//   columnDefaults: {
//     minWidth: 30,
//     maxWidth: 300,
//     width: 150,
//   },
//   customColumnFilter: undefined,
//   sortDefaults: []
// };

// DataTable.propTypes = {
//   options: PropTypes.shape({
//     layout: PropTypes.oneOf(["flex", "block"]),
//     columnFilter: PropTypes.bool,
//     columnSort: PropTypes.bool,
//     columnResize: PropTypes.bool,
//   }),
//   sortDefaults: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       desc: PropTypes.bool,
//     })
//   ),
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       Header: PropTypes.string.isRequired,
//       accessor: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   setSort: PropTypes.func.isRequired,
//   setConditions: PropTypes.func.isRequired,
//   conditionsTransform: PropTypes.func,
//   sortTransform: PropTypes.func,
//   data: PropTypes.arrayOf(PropTypes.object),
//   className: PropTypes.string,
//   filterTitle: PropTypes.string,
//   totalRows: PropTypes.number.isRequired,
//   limit: PropTypes.number.isRequired,
//   loading: PropTypes.bool,
//   columnDefaults: PropTypes.shape({
//     minWidth: PropTypes.number,
//     maxWidth: PropTypes.number,
//     width: PropTypes.number,
//   }),
//   customColumnFilter: PropTypes.func,
//   // tableClasses,
//   // cellTextClassName
// };

export default DataTable;
