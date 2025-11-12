import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResourceInformation from './index';
import { ACAContext } from '../../utilities/ACAContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const meta: Meta<typeof ResourceInformation> = {
  title: 'Components/ResourceInformation',
  component: ResourceInformation,
  decorators: [
    (Story: React.ComponentType) => (
      <QueryClientProvider client={queryClient}>
        <ACAContext.Provider value={{ ACA: undefined }}>
          <Story />
        </ACAContext.Provider>
      </QueryClientProvider>
    ),
  ],
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
    distribution: {
      control: 'object',
      description: 'Distribution object containing resource identifier and metadata.',
    },
    rootUrl: {
      control: 'text',
      description: 'Root URL for the datastore API.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceInformation>;

export const Default: Story = {
  args: {
    distribution: {
      identifier: 'sample-resource-123',
      data: {
        title: 'Sample CSV Resource',
        format: 'csv',
        downloadURL: 'https://example.com/sample.csv',
        description: 'A sample CSV resource for demonstration.',
        describedBy: '',
        describedByType: '',
        mediaType: 'text/csv',
        mimeType: 'text/csv',
        '%Ref:downloadURL': [],
      },
    },
    rootUrl: '/api/1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays resource information with sample data. Note: In Storybook, the API call may fail, but the component structure will be visible.'
      }
    }
  }
};
