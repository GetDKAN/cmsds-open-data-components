import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableDensity from './index';

const meta: Meta<typeof DataTableDensity> = {
  title: 'Components/DataTableDensity',
  component: DataTableDensity,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DataTableDensity component provides a dropdown to select display density for a data table.
        `,
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
type Story = StoryObj<typeof DataTableDensity>;

export const Default: Story = {
  render: (args) => {
    const [tablePadding, setTablePadding] = useState(args.tablePadding ?? 'ds-u-padding-y--1');
    return <DataTableDensity setTablePadding={setTablePadding} tablePadding={tablePadding} />;
  },
  args: {
    tablePadding: 'ds-u-padding-y--1',
  },
};
