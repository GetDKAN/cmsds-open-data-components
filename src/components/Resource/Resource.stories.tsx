import type { Meta, StoryObj } from '@storybook/react';
import Resource from './index';

const meta: Meta<typeof Resource> = {
  title: 'Components/Resource',
  component: Resource,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Resource component displays a list of dataset resources, including download links, file format icons, and resource information for CSV files.
        `,
      },
    },
  },
  argTypes: {
    distributions: {
      control: 'object',
      description: 'Array of resource distributions.',
    },
    resource: {
      control: 'object',
      description: `Resource object containing metadata and controls.`,
    },
    title: {
      control: 'text',
      description: 'Title for the resource section.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Resource>;

export const Default: Story = {
  args: {
    title: 'Sample Resource',
    distributions: [
      {
        identifier: 'dist-1',
        data: {
          title: 'Sample CSV',
          format: 'csv',
          downloadURL: 'https://example.com/sample.csv',
          description: 'A sample CSV resource.',
          describedBy: '',
          describedByType: '',
          mediaType: 'text/csv',
          mimeType: 'text/csv',
          '%Ref:downloadURL': [],
        },
      },
      {
        identifier: 'dist-2',
        data: {
          title: 'Sample XLSX',
          format: 'xlsx',
          downloadURL: 'https://example.com/sample.xlsx',
          description: 'A sample XLSX resource.',
          describedBy: '',
          describedByType: '',
          mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          '%Ref:downloadURL': [],
        },
      },
    ],
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
        story: 'Displays a list of resources with download links and resource information.',
      },
    },
  },
};
