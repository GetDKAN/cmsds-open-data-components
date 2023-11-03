import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownValue, DropdownOption } from '@cmsgov/design-system';

const DataTableRowChanger = ({ setLimit, rowOptions, limit } : {limit: DropdownValue, rowOptions: Array<Number>, setLimit: Function}) => {
  const rowOptionsFormatted = rowOptions.map((row: Number) => ({ label: row.toString(), value: row.toString() as DropdownValue } )) as Array<DropdownOption>;
  return (
    <div className="ds-u-display--flex">
      <Dropdown
        options={rowOptionsFormatted}
        label="Display density:"
        labelClassName="ds-u-margin-top--0"
        name="datatable_display_density"
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
  limit: PropTypes.number,
};

export default DataTableRowChanger;
