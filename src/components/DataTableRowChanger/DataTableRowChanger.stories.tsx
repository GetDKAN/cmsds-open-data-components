import { useState, type FC } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableRowChanger from './index';

type Props = {
  limit: number;
  rowOptions: number[];
  setLimit: (value: string | number) => void;
};

// Wrap to sidestep a TypeScript conflict between the component's PropTypes (declares
// `limit: number | null | undefined`) and its TS prop type (`DropdownValue`).
const DataTableRowChangerWrapped: FC<Props> = (props) => <DataTableRowChanger {...props} />;

const meta: Meta<Props> = {
  title: 'Components/DataTableRowChanger',
  component: DataTableRowChangerWrapped,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dropdown that lets the user pick the number of rows per page in a data table.',
      },
    },
  },
  argTypes: {
    limit: { control: 'number', description: 'Current page size.' },
    rowOptions: { control: 'object', description: 'Allowed page sizes.' },
    setLimit: { control: false, description: 'Setter invoked when the user picks a new size.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {
  render: (args) => {
    const [limit, setLimit] = useState<number>(args.limit ?? 25);
    return (
      <DataTableRowChangerWrapped
        limit={limit}
        rowOptions={args.rowOptions ?? [10, 25, 50, 100]}
        setLimit={(value) => setLimit(Number(value))}
      />
    );
  },
  args: { limit: 25, rowOptions: [10, 25, 50, 100] },
};
