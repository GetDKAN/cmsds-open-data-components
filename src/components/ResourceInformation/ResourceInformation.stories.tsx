import type { Meta, StoryObj } from '@storybook/react';
import ResourceInformation from './index';

const meta: Meta<typeof ResourceInformation> = {
  title: 'Components/ResourceInformation',
  component: ResourceInformation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ResourceInformation component displays summary information about a resource, including the total number of rows and columns.
        `,
      },
    },
  },
  argTypes: {
    resource: {
      control: 'object',
      table: {
        type: { summary: 'ResourceType' },
        subcategory: 'Resource',
      },
      description: 'Resource object containing table metadata.',
      // Hide function fields from controls
      properties: {
        setLimit: { table: { disable: true } },
        setOffset: { table: { disable: true } },
        setSort: { table: { disable: true } },
        setConditions: { table: { disable: true } },
        setResource: { table: { disable: true } },
      }
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceInformation>;

export const Default: Story = {
  args: {
    resource: {
      columns: ['id', 'name', 'value'],
      count: 3,
      totalRows: 12345,
      totalColumns: 3,
      limit: 100,
      offset: 0,
      loading: false,
      conditions: [],
      schema: {},
      values: [],
      setLimit: () => {},
      setOffset: () => {},
      setSort: () => {},
      setConditions: () => {},
      setResource: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays resource information with sample data.'
      }
    }
  }
};
