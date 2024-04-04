import React, { useState } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@cmsgov/design-system';

const DataDictionaryTable = ({tableColumns, tableData, count, pageSize}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
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
        <Table className="dc-c-datatable">
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow>
                {headerGroup.headers.map(header => {
                  return (
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
                        key: cell.id
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