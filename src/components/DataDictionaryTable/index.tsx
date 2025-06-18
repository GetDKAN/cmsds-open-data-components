import React, { useState } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useMediaQuery } from 'react-responsive';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Dropdown,
  DropdownChangeObject,
  Alert,
} from '@cmsgov/design-system';
import HeaderResizeElement from '../Datatable/HeaderResizeElement';
import './dataDictionaryTable.scss';

const DataDictionaryTable = ({
  tableColumns,
  tableData,
  pageSize,
  columnFilters,
}: {
  tableColumns: Array<any>;
  tableData: Array<any>;
  pageSize: number;
  columnFilters?: ColumnFiltersState;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('');

  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 544 });

  const sortElement = (isSorted: string) => {
    if (isSorted === 'asc') {
      return 'dc-c-sort--asc';
    }
    if (isSorted === 'desc') {
      return 'dc-c-sort--desc';
    }
    return 'dc-c-sort--default';
  };

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: pageSize,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  const sortOptions = [
    { value: 'default', label: 'No Sort' },
    { value: 'titleasc', label: 'Title A-Z' },
    { value: 'titledesc', label: 'Title Z-A' },
    { value: 'typeasc', label: 'Type A-Z' },
    { value: 'typedesc', label: 'Type Z-A' },
  ];

  const sortStatesLookup: { [key: string]: Array<any> } = {
    default: [],
    titleasc: [{ id: 'titleResizable', desc: false }],
    titledesc: [{ id: 'titleResizable', desc: true }],
    typeasc: [{ id: 'type', desc: false }],
    typedesc: [{ id: 'type', desc: true }],
  };
  return (
    <div>
      {mobile && (
        <div className="ds-u-margin-bottom--3 ds-l-col--12 ds-l-sm-col--6">
          <Dropdown
            labelClassName="ds-u-margin-top--1 ds-u-sm-margin-top--0"
            options={sortOptions}
            label="Sort"
            value={Object.keys(sortStatesLookup).find((key) => {
              return JSON.stringify(sortStatesLookup[key]) == JSON.stringify(sorting);
            })}
            name="dc-data-dictionary-type"
            onChange={(e: DropdownChangeObject) => {
              setSorting(sortStatesLookup[e.target.value]);
            }}
          />
        </div>
      )}
      <div className="dc-c-datadictionary-table">
        <Table className="dc-c-datatable" {...{ style: { width: '100%' } }} stackable>
          <TableHead className="dc-thead--truncated dc-thead--resizeable">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={'header' + headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return header.id === 'titleResizable' ? (
                    <HeaderResizeElement
                      key={header.id + '_resize'}
                      table={table}
                      header={header}
                      setAriaLiveFeedback={setAriaLiveFeedback}
                      sortElement={sortElement}
                    />
                  ) : (
                    // <TableCell
                    //   {...{
                    //     key: header.id,
                    //   }}
                    //   className={`ds-u-border-y--2 ds-u-border--dark ds-u-border-x--0`}
                    //   id={'dataDictionary_' + header.id}
                    // >
                    //   {
                    //     flexRender(
                    //       header.column.columnDef.header,
                    //       header.getContext()
                    //     ) as React.ReactNode
                    //   }
                    //   {header.id === 'type' && (
                    //     <button
                    //       onClick={header.column.getToggleSortingHandler()}
                    //       {...{
                    //         className: header.column.getCanSort()
                    //           ? `cursor-pointer select-none ds-u-focus-visible ${sortElement(
                    //               header.column.getIsSorted() as string
                    //             )}`
                    //           : '',
                    //       }}
                    //       aria-label={`${header.column.columnDef.header} sort order`}
                    //     />
                    //   )}
                    // </TableCell>

                    <TableCell
                      key={header.id}
                      className="ds-u-border-y--2 ds-u-border--dark ds-u-border-x--0"
                      id={'dataDictionary_' + header.id}
                    >
                      {
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) as React.ReactNode
                      }
                      {header.id === 'type' && (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={
                            header.column.getCanSort()
                              ? `cursor-pointer select-none ds-u-focus-visible ${sortElement(
                                  header.column.getIsSorted() as string
                                )}`
                              : ''
                          }
                          aria-label={`${header.column.columnDef.header} sort order`}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <TableRow key={index + JSON.stringify(row)}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      // <TableCell
                      // {...{
                      //   key: cell.id,
                      //   style: {
                      //     maxWidth: mobile ? '100%' : cell.column.getSize(),
                      //     whiteSpace: cell.column.id === "description" ? 'pre-wrap' : 'normal'
                      //   },
                      // }}
                      // className={`${cell.column.id === 'titleResizable' ? 'ds-u-word-break' : ''}`}
                      // headers={'dataDictionary_' + cell.column.id}
                      // stackedTitle={cell.column.id === 'titleResizable' ? 'Title' : cell.column.columnDef.header as string}
                      // >

                      <TableCell
                        key={cell.id}
                        style={{
                          maxWidth: mobile ? '100%' : cell.column.getSize(),
                          whiteSpace: cell.column.id === 'description' ? 'pre-wrap' : 'normal',
                        }}
                        className={`${
                          cell.column.id === 'titleResizable' ? 'ds-u-word-break' : ''
                        }`}
                        headers={'dataDictionary_' + cell.column.id}
                        stackedTitle={
                          cell.column.id === 'titleResizable'
                            ? 'Title'
                            : (cell.column.columnDef.header as string)
                        }
                      >
                        {
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ) as React.ReactNode
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          {ariaLiveFeedback}
        </div>
        {table.getRowModel().rows.length === 0 && (
          <Alert variation="warn">No results found for the current filters</Alert>
        )}
      </div>
      {table.getRowCount() > pageSize ? (
        <Pagination
          totalPages={table.getPageCount()}
          currentPage={table.getState().pagination.pageIndex + 1}
          onPageChange={(evt, page) => {
            evt.preventDefault();
            table.setPageIndex(page - 1);
          }}
          renderHref={(page) => `/page=${page}`}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default DataDictionaryTable;
