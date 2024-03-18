import React, {useState} from 'react';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getPaginationRowModel } from '@tanstack/react-table';

import { Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@cmsgov/design-system';
import { DatasetDictionaryItemType } from '../../types/dataset';

const DataDictionary = (
  { datasetDictionary, title, pageSize = 20 } : 
  { datasetDictionary: DatasetDictionaryItemType[], title: string, pageSize: number}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: pageSize,
  });

  const columnHelper = createColumnHelper<DatasetDictionaryItemType>()
  const tableColumns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('title', {
      header: 'Title',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
    }),
    columnHelper.accessor('format', {
      header: 'Format',
    }),
  ];

  const table = useReactTable({
    data: datasetDictionary,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination: pagination
    }
  });

  return (
    <>
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      <div className="ds-u-overflow--auto ds-u-border-x--1">
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
      {datasetDictionary.length > pageSize ? (
        <Pagination
          totalPages={Math.ceil(datasetDictionary.length / pagination.pageSize)}
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
    </>
  )
}

export default withQueryProvider(DataDictionary);