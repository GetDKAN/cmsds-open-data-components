import type { Meta, StoryObj } from '@storybook/react';
import QueryBuilder from './index';

const meta: Meta<typeof QueryBuilder> = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The QueryBuilder component displays a UI for building and applying query filters, supporting multiple conditions, custom columns, and filter management.
        `,
      },
    },
  },
  argTypes: {
    resource: {
      control: 'object',
      description: 'Resource object containing conditions, schema, and setConditions function.',
    },
    id: { control: 'text', description: 'Unique identifier for the resource.' },
    customColumns: { control: 'object', description: 'Custom columns for the query builder.' },
    isModal: { control: 'boolean', description: 'Whether the builder is used in a modal.' },
    setPage: { table: { disable: true } },
    setOffset: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  args: {
    resource: {
      conditions: [
        { operator: '=', property: 'date', value: '2025-07-18', key: 'filter-1' },
        { operator: '>', property: 'value', value: '100', key: 'filter-2' },
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
      setConditions: () => {},
    },
    id: 'resource-1',
    customColumns: [],
    isModal: false,
    setPage: () => {},
    setOffset: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the query builder with sample conditions and schema.'
      }
    }
  }
};
