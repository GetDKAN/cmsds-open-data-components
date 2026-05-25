import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTablePageResults from './DataTablePageResults';

const meta: Meta<typeof DataTablePageResults> = {
  title: 'Components/DataTablePageResults',
  component: DataTablePageResults,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DataTablePageResults component displays the current range of visible rows and the total number of results in a data table.
        `,
      },
    },
  },
  argTypes: {
    totalRows: { control: 'number', description: 'Total number of rows.' },
    limit: { control: 'number', description: 'Rows per page.' },
    offset: { control: 'number', description: 'Offset for current page.' },
    className: { control: 'text', description: 'Custom class name.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTablePageResults>;

export const Default: Story = {
  args: { totalRows: 100, limit: 25, offset: 0, className: 'data-table-results' },
};

export const MiddlePage: Story = {
  args: { totalRows: 100, limit: 25, offset: 25, className: 'data-table-results' },
};

export const LastPage: Story = {
  args: { totalRows: 100, limit: 25, offset: 75, className: 'data-table-results' },
};

export const NoResults: Story = {
  args: { totalRows: 0, limit: 25, offset: 0, className: 'data-table-results' },
};
