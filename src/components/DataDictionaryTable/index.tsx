import React, { useState } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@cmsgov/design-system';
import HeaderResizeElement from '../Datatable/HeaderResizeElement';

const DataDictionaryTable = ({tableColumns, tableData, count, pageSize} :
  {tableColumns: Array<any>, tableData: Array<any>, count: number, pageSize: number}
  ) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: pageSize,
  });
  const [ariaLiveFeedback, setAriaLiveFeedback] = useState('')

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination: pagination
    }
  });

  return (
    <div>
      <div className="ds-u-border-x--1">
        <Table className="dc-c-datatable" {...{style:{width: '100%'}}} >
          <TableHead className="dc-thead--truncated dc-thead--resizeable">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow>
                {headerGroup.headers.map(header => {
                  console.log(header)
                  return (header.id === "nameAndTitle") ? (
                    <HeaderResizeElement table={table} header={header} setAriaLiveFeedback={setAriaLiveFeedback} />
                  ) : (
                    <TableCell>{flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}</TableCell>
                  )
                }) }
              </TableRow>
            )
            )}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => { 
              const even = (index + 1) % 2 === 0;     
              return (
                <TableRow className={`${even ? "dc-c-datatable--even-row" : ""}`}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                      {...{
                        key: cell.id,
                        style: {
                          maxWidth: cell.column.getSize(),
                        },
                      }}
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
      {count > pageSize ? (
        <Pagination
          totalPages={Math.ceil(count / pagination.pageSize)}
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