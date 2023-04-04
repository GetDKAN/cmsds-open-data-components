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

const TruncatedResizeableTHead = ({table, sortElement}) => {
  return(
    <thead className="dc-thead--truncated dc-thead--resizeable">
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
              className="ds-u-border-y--2 ds-u-padding--2 ds-u-border--dark  ds-u-font-weight--bold dc-c-table-header-cell"
              >
                <div onClick={header.column.getToggleSortingHandler()}>
                  <span style={{maxWidth: header.getSize() - 16}} >
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
                <span
                  {...{
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `dc-c-resize-handle ${
                      header.column.getIsResizing() ? 'isResizing' : ''
                    }`,
                  }}
                />
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  );
}

export default TruncatedResizeableTHead;
