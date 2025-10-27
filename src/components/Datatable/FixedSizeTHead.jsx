import React from 'react';
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

const FixedSizeTHead = ({table, sortElement}) => {
  return(
    <thead className="dc-thead--fixed-size">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            return(
              <th {
                ...{
                  key: header.id,
                  style: {
                    width: header.getSize(),
                  },
                  title: header.column.columnDef.header
                }
              }
              className="ds-u-border-y--2 ds-u-padding--2 ds-u-border--dark  ds-u-font-weight--bold"
              aria-sort={
                header.column.getIsSorted() === 'asc'
                  ? 'ascending'
                  : header.column.getIsSorted() === 'desc'
                  ? 'descending'
                  : 'none'
              }
              >
                <div onClick={header.column.getToggleSortingHandler()} className="ds-u-display--flex">
                  <span>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                      )}
                  </span>
                  <span
                    {...{
                      className: header.column.getCanSort()
                        ? `cursor-pointer select-none ${sortElement(header.column.getIsSorted())}`
                        : '',
                    }}
                  />
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

export default FixedSizeTHead;
