import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import Resource from './index';
import { createStorybookQueryClient } from '../../../.storybook/queryClient';

const queryClient = createStorybookQueryClient();

const meta: Meta<typeof Resource> = {
  title: 'Components/Resource',
  component: Resource,
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
        component: `
The Resource component displays a list of dataset resources, including download links, file format icons, and resource information for CSV files.
        `,
      },
    },
  },
  argTypes: {
    datasetID: {
      control: 'text',
      description: 'Dataset identifier used to query resource information per distribution index.',
    },
    distributions: {
      control: 'object',
      description: 'Array of resource distributions.',
    },
    title: {
      control: 'text',
      description: 'Title for the resource section.',
    },
    rootUrl: {
      control: 'text',
      description: 'Root URL for the datastore API.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Resource>;

export const Default: Story = {
  args: {
    datasetID: 'wb6u-x2ny',
    title: 'Sample Resource',
    rootUrl: '/api/1',
    distributions: [
      {
        '@type': 'dcat:Distribution',
        title: 'Sample CSV',
        format: 'csv',
        downloadURL: 'https://example.com/sample.csv',
        description: 'A sample CSV resource.',
        describedBy: '',
        describedByType: '',
        mediaType: 'text/csv',
      },
      {
        '@type': 'dcat:Distribution',
        title: 'Sample XLSX',
        format: 'xlsx',
        downloadURL: 'https://example.com/sample.xlsx',
        description: 'A sample XLSX resource.',
        describedBy: '',
        describedByType: '',
        mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a list of resources with download links and resource information.',
      },
    },
  },
};
