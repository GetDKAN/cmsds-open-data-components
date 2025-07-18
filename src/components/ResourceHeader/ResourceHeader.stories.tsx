import type { Meta, StoryObj } from '@storybook/react';
import ResourceHeader from './index';

const meta: Meta<typeof ResourceHeader> = {
  title: 'Components/ResourceHeader',
  component: ResourceHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ResourceHeader component displays controls and information for a resource table, including download, copy link, display settings, and pagination controls.
        `,
      },
    },
  },
  argTypes: {
    resource: {
      control: 'object',
      description: 'Resource object containing table metadata and controls.',
    },
    setTablePadding: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceHeader>;

export const Default: Story = {
  args: {
    setTablePadding: () => {},
    includeDensity: true,
    includeDownload: true,
    resource: {
      limit: 10,
      offset: 0,
      count: 100,
      setLimit: () => {},
      setOffset: () => {},
      loading: false,
    },
    tablePadding: 'normal',
    downloadUrl: 'https://example.com/data.csv',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the resource header with all controls enabled and sample data.'
      }
    }
  }
};
