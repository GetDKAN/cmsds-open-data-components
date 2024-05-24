import React, { useState } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, getFilteredRowModel, ColumnFiltersState } from '@tanstack/react-table';
import { useMediaQuery } from 'react-responsive';
import { Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@cmsgov/design-system';
import HeaderResizeElement from '../Datatable/HeaderResizeElement';
import './dataDictionaryTable.scss';

const DataDictionaryTable = ({tableColumns, tableData, count, pageSize, columnFilters} :
  {tableColumns: Array<any>, tableData: Array<any>, count: number, pageSize: number, columnFilters?: ColumnFiltersState}
  ) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([])
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('');

  const mobile = useMediaQuery({ minWidth: 0, maxWidth: 544 });

  const sortElement = (isSorted : string) => {
    if(isSorted === 'asc') {
      return 'dc-c-sort--asc'
    }
    if(isSorted === 'desc') {
      return 'dc-c-sort--desc'
    }
    return 'dc-c-sort--default'
  }

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
      columnFilters
    }
  });

  return (
    <div>
      <div className="dc-c-datadictionary-table">
        <Table className="dc-c-datatable" {...{style:{width: '100%'}}} stackable>
          <TableHead className="dc-thead--truncated dc-thead--resizeable">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={"header" + headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (header.id === "titleResizable") ? (
                    <HeaderResizeElement key={header.id + "_resize"} table={table} header={header} setAriaLiveFeedback={setAriaLiveFeedback} sortElement={sortElement} />
                  ) : (
                    <TableCell
                      {...{
                        key: header.id
                      }}
                      className= {`ds-u-border-y--2 ds-u-border--dark ds-u-border-x--0`}
                      id={'dataDictionary_' + header.id}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                      {header.id === 'type' && (
                        <button
                        onClick={header.column.getToggleSortingHandler()}
                        {...{
                          className: header.column.getCanSort()
                            ? `cursor-pointer select-none ds-u-focus-visible ${sortElement(header.column.getIsSorted() as string)}`
                            : '',
                        }}
                        aria-label={`${header.column.columnDef.header} sort order`}
                      />
                      )}
                    </TableCell>
                  )
                }) }
              </TableRow>
            )
            )}
          </TableHead>
          <TableBody>
            {table.getFilteredRowModel().rows.map((row, index) => {    
              return (
                <TableRow key={index + JSON.stringify(row)}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                      {...{
                        key: cell.id,
                        style: {
                          maxWidth: mobile ? '100%' : cell.column.getSize(),
                          whiteSpace: cell.column.id === "description" ? 'pre-wrap' : 'normal'
                        },
                      }}
                      className={`${cell.column.id === 'titleResizable' ? 'ds-u-word-break' : ''}`}
                      headers={'dataDictionary_' + cell.column.id}
                      stackedTitle={cell.column.id === 'titleResizable' ? 'Title' : cell.column.columnDef.header as string}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className='sr-only' aria-live='assertive' aria-atomic='true'>{ariaLiveFeedback}</div>
      </div>
      {table.getRowCount() > pageSize ? (
        <Pagination
          totalPages={table.getPageCount()}
          currentPage={pagination.pageIndex + 1}
          onPageChange={(evt, page) => {
            evt.preventDefault();
            setPagination({
              pageIndex: page - 1,
              pageSize: pageSize
            })
          }}
          renderHref={(page) => {
            return '';
          }}
        />
      ): ''}
    </div>
  )
};

export default DataDictionaryTable;