import React, { useState } from 'react';
import { flexRender } from "@tanstack/react-table";

const TruncatedResizeableTHead = ({table, sortElement, setAriaLiveFeedback}) => {
  const [columnResizing, setColumnResizing] = useState('');
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
                <div>
                  <span style={{maxWidth: header.getSize() - 16}} >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                      )}
                  </span>
                  <button
                    onClick={header.column.getToggleSortingHandler()}
                    {...{
                      className: header.column.getCanSort()
                        ? `cursor-pointer select-none ds-u-focus-visible ${sortElement(header.column.getIsSorted())}`
                        : '',
                    }}
                    aria-label={`${header.column.columnDef.header} sort order`}
                  />
                </div>
                <button
                  {...{
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `dc-c-resize-handle ds-u-focus-visible ${
                      header.column.getIsResizing() || header.column.id == columnResizing ? 'isResizing' : ''
                    }`,
                  }}
                  aria-label={`Resize ${header.column.columnDef.header} column`}
                  onKeyDown={(e) => {
                    const columnSizingObject = table.getState().columnSizing;
                    switch (e.key) {
                      case 'Enter':
                      case ' ':
                        e.preventDefault();
                        e.stopPropagation();
                        if (columnResizing) {
                          // end resizing
                          setColumnResizing('')
                          setAriaLiveFeedback(`${header.column.columnDef.header} dropped.`)
                        } else {
                          // start resizing
                          setColumnResizing(header.column.id)
                          setAriaLiveFeedback(`${header.column.columnDef.header} grabbed.`)
                        }
                        break;

                      case 'Escape':
                        if (columnResizing) {
                          setColumnResizing('')
                          setAriaLiveFeedback(`${header.column.columnDef.header} dropped.`)
                        }
                        break;
                        case 'ArrowRight':
                          e.preventDefault();
                          e.stopPropagation();
                          if (columnResizing) {
                            columnSizingObject[header.column.id] = header.getSize() + 10;
                            table.setColumnSizing(columnSizingObject);
                            setAriaLiveFeedback(`${header.column.columnDef.header} has been resized. The new width is ${header.getSize()} pixels.`);
                          }
                          break;
                        case 'ArrowLeft':
                          e.preventDefault();
                          e.stopPropagation();
                          if (columnResizing) {
                            columnSizingObject[header.column.id] = header.getSize() - 10;
                            table.setColumnSizing(columnSizingObject);
                            setAriaLiveFeedback(`${header.column.columnDef.header} has been resized. The new width is ${header.getSize()} pixels.`)
                          }
                          break;
                    }
                  }}
                  onBlur={() => {
                    setColumnResizing('')
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
