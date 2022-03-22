import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@cmsgov/design-system';

const DataTableDensity = ({ setTablePadding, tablePadding }) => {
  return (
    <div className="ds-u-display--flex">
      <Dropdown
        options={[
          { label: 'Tight', value: 'ds-u-padding-y--0' },
          { label: 'Normal', value: 'ds-u-padding-y--1' },
          { label: 'Expanded', value: 'ds-u-padding-y--2' },
        ]}
        size="small"
        label="Display density:"
        labelClassName="ds-u-margin-top--0"
        name="datatable_display_density"
        onChange={(e) => setLimit(e.target.value)}
        defaultValue={'ds-u-padding-y--1'}
      />
    </div>
  );
};

DataTableDensity.propTypes = {
  setTablePadding: PropTypes.func.isRequired,
};

export default DataTableDensity;
