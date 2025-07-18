import React, { useState } from 'react';
import DataTableDensity from './index';

const meta = {
  title: 'Components/DataTableDensity',
  component: DataTableDensity,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DataTableDensity component provides a dropdown to select display density for a data table.\n        `,
      },
    },
  },
  argTypes: {
    setTablePadding: { control: false, description: 'Callback to set table padding.' },
    tablePadding: { control: 'text', description: 'Current table padding value.' },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: (args) => {
    const [tablePadding, setTablePadding] = useState('ds-u-padding-y--1');
    return <DataTableDensity setTablePadding={setTablePadding} tablePadding={tablePadding} />;
  },
  args: {
    tablePadding: 'ds-u-padding-y--1',
  },
};
