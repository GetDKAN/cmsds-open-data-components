import type { Meta, StoryObj } from '@storybook/react';
import ResourceFooter from './index';

const meta: Meta<typeof ResourceFooter> = {
  title: 'Components/ResourceFooter',
  component: ResourceFooter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ResourceFooter component displays pagination controls for a resource table using the design system's Pagination component.
        `,
      },
    },
  },
  argTypes: {
    resource: {
      control: 'object',
      description: 'Resource object containing pagination metadata and controls.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceFooter>;

export const Default: Story = {
  args: {
    resource: {
      limit: 10,
      offset: 0,
      count: 100,
      values: Array(10).fill({}),
      setOffset: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the resource footer with pagination controls and sample data.'
      }
    }
  }
};
