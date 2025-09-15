import type { Meta, StoryObj } from '@storybook/react';
import DatasetListSubmenuItem from './index';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof DatasetListSubmenuItem> = {
  title: 'Components/DatasetListSubmenuItem',
  component: DatasetListSubmenuItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DatasetListSubmenuItem component displays a dataset item as a submenu entry, typically used in dataset navigation lists. It shows the dataset title as a link and supports responsive layout and optional features like pagination and data dictionary links.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetListSubmenuItem>;

export const Default: Story = {
  args: {
    title: 'Sample Dataset',
    identifier: 'sample-dataset',
    paginationEnabled: false,
    dataDictionaryLinks: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A default DatasetListSubmenuItem with a sample dataset title and no extra features enabled.',
      },
    },
  },
};

export const WithPagination: Story = {
  args: {
    title: 'Paginated Dataset',
    identifier: 'paginated-dataset',
    paginationEnabled: true,
    dataDictionaryLinks: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A DatasetListSubmenuItem with pagination enabled, showing the border and layout changes.',
      },
    },
  },
};

export const WithDataDictionaryLinks: Story = {
  args: {
    title: 'Dataset with Data Dictionary',
    identifier: 'dataset-with-dictionary',
    paginationEnabled: false,
    dataDictionaryLinks: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A DatasetListSubmenuItem with data dictionary links enabled, demonstrating the alternate layout.',
      },
    },
  },
};
