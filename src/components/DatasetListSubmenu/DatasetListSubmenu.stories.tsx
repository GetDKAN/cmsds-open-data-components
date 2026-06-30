import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DatasetListSubmenu from './index';
import { createDatasetListHandlers } from '../../../.storybook/mswHandlers';
import {
  mockApiResponse,
  mockEmptyResults,
} from '../../../__mocks__/mockDatasetSearchResults';

const meta: Meta<typeof DatasetListSubmenu> = {
  title: 'Components/DatasetListSubmenu',
  component: DatasetListSubmenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact dataset listing for header submenus. Fetches recent datasets from `${rootUrl}/search/`, displays up to `defaultPageSize` items, and links to the full listing.',
      },
    },
    msw: { handlers: createDatasetListHandlers(mockApiResponse) },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 480, background: '#fff', padding: '1rem' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    rootUrl: { control: 'text', description: 'Base URL for the search API endpoint.' },
    enablePagination: { control: 'boolean', description: 'Show the "Viewing X of Y" pager.' },
    defaultPageSize: { control: 'number', description: 'Max number of items to show.' },
    subLinkClasses: { control: 'text', description: 'Classes applied to each item link.' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetListSubmenu>;

export const Default: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enablePagination: true,
    defaultPageSize: 4,
  },
};

// Excluded from autodocs: the shared module-scope QueryClient in `withQueryProvider`
// causes this story's empty-results MSW handler to bleed into the Default render on
// the docs page (identical queryKey → React Query dedupes; either handler can win).
// View this story standalone to see the empty state correctly.
export const NoResults: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enablePagination: true,
    defaultPageSize: 4,
  },
  tags: ['!autodocs'],
  parameters: {
    msw: { handlers: createDatasetListHandlers(mockEmptyResults) },
    docs: {
      description: {
        story: 'Empty API response — renders the "No results found" alert.',
      },
    },
  },
};
