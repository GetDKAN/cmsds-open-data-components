import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DatasetListItem from './index';

const meta: Meta<typeof DatasetListItem> = {
  title: 'Components/DatasetListItem',
  component: DatasetListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single dataset list entry used in submenu/recent-update lists. Renders the title, last-modified date, and a link to the dataset detail page.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Story />
        </ul>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: { control: 'text', description: 'Dataset title.' },
    modified: { control: 'text', description: 'Last-modified date string.' },
    identifier: { control: 'text', description: 'Dataset identifier used in the detail link.' },
    paginationEnabled: { control: 'boolean', description: 'Render the item with top border (pagination-list style).' },
    dataDictionaryLinks: { control: 'boolean', description: 'Adjust column widths to make room for data-dictionary links.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetListItem>;

export const Default: Story = {
  args: {
    title: 'Medicare Provider Utilization and Payment Data',
    modified: '2025-04-15T14:30:00Z',
    identifier: 'medicare-provider-utilization',
    paginationEnabled: true,
    dataDictionaryLinks: false,
  },
};

export const FirstItem: Story = {
  args: {
    title: 'Hospital Compare National Data',
    modified: '2025-03-10T09:15:00Z',
    identifier: 'hospital-compare',
    paginationEnabled: false,
    dataDictionaryLinks: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'First item in an unpaginated list — renders with a bottom border instead of a top border.',
      },
    },
  },
};
