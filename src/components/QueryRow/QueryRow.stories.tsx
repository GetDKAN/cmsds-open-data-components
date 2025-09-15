import type { Meta, StoryObj } from '@storybook/react';
import QueryRow from './index';

const meta: Meta<typeof QueryRow> = {
  title: 'Components/QueryRow',
  component: QueryRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The QueryRow component displays a filter row for building queries, supporting column selection, operator selection, and value input (including date pickers for date columns).
        `,
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: 'Unique identifier for the query row.' },
    index: { control: 'number', description: 'Index of the query row.' },
    condition: { control: 'object', description: 'Condition object for the query row.' },
    propertyOptions: { control: 'object', description: 'Options for the property dropdown.' },
    schema: { control: 'object', description: 'Schema object for the dataset.' },
    update: { table: { disable: true } },
    remove: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QueryRow>;

export const Default: Story = {
  args: {
    id: 'resource-1',
    index: 0,
    condition: {
      operator: '=',
      property: 'date',
      value: '2025-07-18',
      key: 'filter-1',
    },
    propertyOptions: [
      { label: 'Date', value: 'date' },
      { label: 'Name', value: 'name' },
      { label: 'Value', value: 'value' },
    ],
    schema: {
      'resource-1': {
        fields: {
          date: { mysql_type: 'date', description: 'Date', type: 'string' },
          name: { mysql_type: 'varchar', description: 'Name', type: 'string' },
          value: { mysql_type: 'float', description: 'Value', type: 'number' },
        },
      },
    },
    update: () => {},
    remove: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a query row for filtering by date.'
      }
    }
  }
};
