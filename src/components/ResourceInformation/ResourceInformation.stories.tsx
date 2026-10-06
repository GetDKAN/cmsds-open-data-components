import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import ResourceInformation from './index';
import { ACAContext } from '../../utilities/ACAContext';
import { createStorybookQueryClient } from '../../../.storybook/queryClient';

const queryClient = createStorybookQueryClient();

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
    datasetID: {
      control: 'text',
      description: 'Dataset identifier.',
    },
    distribution: {
      control: 'number',
      description: 'Distribution index within the dataset.',
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
    datasetID: 'wb6u-x2ny',
    distribution: 0,
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
