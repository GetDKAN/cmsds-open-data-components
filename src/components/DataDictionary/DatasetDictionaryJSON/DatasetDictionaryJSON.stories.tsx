import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import DatasetDictionaryJSON from './index';
import { createStorybookQueryClient } from '../../../../.storybook/queryClient';

const queryClient = createStorybookQueryClient();

const meta: Meta<typeof DatasetDictionaryJSON> = {
  title: 'Components/DatasetDictionaryJSON',
  component: DatasetDictionaryJSON,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetDictionaryJSON component displays a filterable and paginated table for dataset dictionary entries.
        `,
      },
    },
  },
  argTypes: {
    datasetDictionaryEndpoint: { control: 'text', description: 'Endpoint for data dictionary information' },
    pageSize: { control: 'number', description: 'Number of rows per page.' },
    showDownloadButton: { control: 'boolean', description: 'Whether to display the download button at the top of the page' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetDictionaryJSON>;

export const Default: Story = {
  args: {
    datasetDictionaryEndpoint:
      'https://data.medicaid.gov/api/1/metastore/schemas/data-dictionary/items/5b71cde4-43f2-4877-9059-5830079223e9',
    pageSize: 10,
    showDownloadButton: true,
  },
};
