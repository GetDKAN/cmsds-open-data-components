import React from 'react';
import { Button } from '@cmsgov/design-system';

const DataTableRowChanger = ({ setLimit }) => {
  const rowOptions = [10, 25, 50, 100];
  return (
    <div>
      <span>Rows per page:</span>
      {rowOptions.map((r) => (
        <Button
          key={`buttonFor${r}`}
          onClick={() => setLimit(r)}
          size="small"
          variation="transparent"
        >
          {r}
          {' '}
          <span className="ds-u-visibility--screen-reader">rows per page</span>
        </Button>
      ))}
    </div>
  )
}

export default DataTableRowChanger;
