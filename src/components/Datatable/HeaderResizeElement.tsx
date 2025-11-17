import React, {useState} from 'react'
import { flexRender } from "@tanstack/react-table";

const HeaderResizeElement = ({table, header, sortElement, setAriaLiveFeedback, id} :
  {table: any, header: any, sortElement?: Function, setAriaLiveFeedback: Function, id?: string }) => {
  const [columnResizing, setColumnResizing] = useState('');

  // Fix for JSX in Data Dictionary Title header cell
  const ariaLabel = header.id === "titleResizable" ? "Title" : header.column.columnDef.header;

  return(
    <th {
      ...{
        key: header.id,
        style: {
          width: header.getSize(),
        }
      }
    }
    id={id}
    title={typeof(header.column.columnDef.header) === "string" ? header.column.columnDef.header : ''}
    className="ds-u-border-y--2 ds-u-padding--2 ds-u-border--dark  ds-u-font-weight--bold"
    aria-sort={
      header.column.getIsSorted() === 'asc'
        ? 'ascending'
        : header.column.getIsSorted() === 'desc'
        ? 'descending'
        : 'none'
    }
    >
      <div className="ds-u-display--flex">
        <div>
          <span>
            {header.isPlaceholder
              ? null
              : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
              ) as React.ReactNode}
          </span>
        </div>
        {sortElement && (
        <button
          onClick={header.column.getToggleSortingHandler()}
          {...{
            className: header.column.getCanSort()
              ? `cursor-pointer select-none ds-u-focus-visible ${sortElement(header.column.getIsSorted())}`
              : '',
          }}
          aria-label={`${ariaLabel} sort order`}
        />
        )}
      </div>
      <button
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `dc-c-resize-handle ds-u-focus-visible ${
            header.column.getIsResizing() || header.column.id == columnResizing ? 'isResizing' : ''
          }`,
        }}
        aria-label={`Resize ${ariaLabel} column`}
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
}

export default HeaderResizeElement
