import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@cmsgov/design-system';

const DataTableRowChanger = ({ setLimit, rowOptions, limit }) => {
  return (
    <div>
      <Dropdown
        options={rowOptions.map((row) => ({ label: row.toString(), value: row }))}
        size="small"
        label="Rows per page:"
        labelClassName="ds-u-margin-top--0"
        name="datatable_rows_per_page"
        onChange={(e) => setLimit(e.target.value)}
        defaultValue={limit.toString()}
      />
    </div>
  );
};

DataTableRowChanger.defaultProps = {
  rowOptions: [10, 25, 50, 100],
};

DataTableRowChanger.propTypes = {
  rowOptions: PropTypes.arrayOf(PropTypes.number),
  setLimit: PropTypes.func.isRequired,
};

export default DataTableRowChanger;
