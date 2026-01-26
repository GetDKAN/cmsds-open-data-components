import React from 'react';
import HeaderResizeElement from './HeaderResizeElement';

const TruncatedResizeableTHead = ({table, sortElement = null}) => {
  return(
    <thead className="dc-thead--truncated dc-thead--resizeable">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id} className="dc-c-sticky-header">
          {headerGroup.headers.map(header => <HeaderResizeElement key={header.id + "_dataTableResize"} table={table} header={header} sortElement={sortElement} />)}
        </tr>
      ))}
    </thead>
  );
}

export default TruncatedResizeableTHead;
