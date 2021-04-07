import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@cmsgov/design-system';

const DataTableRowChanger = ({ setLimit, rowOptions }) => {
  return (
    <div className="ds-u-text-align--right">
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

DataTableRowChanger.defaultProps = {
  rowOptions: [10, 25, 50, 100],
}

DataTableRowChanger.propTypes = {
  rowOptions: PropTypes.arrayOf(PropTypes.number),
  setLimit: PropTypes.func.isRequired,
}

export default DataTableRowChanger;
