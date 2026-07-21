import React from 'react';
import { Dropdown } from '@cmsgov/design-system';

const DataTableDensity = ({ setTablePadding, tablePadding } : {setTablePadding: Function, tablePadding?: string}) => {
  return (
    <div className="ds-u-display--flex">
      <Dropdown
        options={[
          { label: 'Tight', value: 'ds-u-padding-y--0' },
          { label: 'Normal', value: 'ds-u-padding-y--1' },
          { label: 'Expanded', value: 'ds-u-padding-y--2' },
        ]}
        label="Display density:"
        labelClassName="ds-u-margin-top--0"
        name="datatable_display_density"
        onChange={(e) => setTablePadding(e.target.value)}
        defaultValue={tablePadding}
      />
    </div>
  );
};

export default DataTableDensity;
