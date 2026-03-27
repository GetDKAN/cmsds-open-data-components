import React from 'react';
import DatasetDictionaryJSON from './index';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStorybookQueryClient } from '../../../../.storybook/queryClient';

const queryClient = createStorybookQueryClient();

const meta = {
  title: 'Components/DatasetDictionaryJSON',
  component: DatasetDictionaryJSON,
  decorators: [
      (Story: React.ComponentType) => (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      ),
    ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe DatasetDictionaryJSON component displays a filterable and paginated table for dataset dictionary entries.\n        `,
      },
    },
  },
  argTypes: {
    datasetDictionaryEndpoint: { control: 'string', description: 'Endpoint for data dictionary information' },
    pageSize: { control: 'number', description: 'Number of rows per page.' },
    showDownloadButton: { control: 'boolean', description: 'Whether to display the download button at the top of the page'}
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    datasetDictionaryEndpoint: "https://data.medicaid.gov/api/1/metastore/schemas/data-dictionary/items/5b71cde4-43f2-4877-9059-5830079223e9",
    pageSize: 10,
    showDownloadButton: true
  },
};
