import type { Meta, StoryObj } from '@storybook/react';
import DatasetList from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStorybookQueryClient } from '../../../.storybook/queryClient';
import { ACAContext } from '../../utilities/ACAContext';
import { createAxiosMock, setupDatasetListMock } from '../../../.storybook/axiosMockAdapter';
import { mockApiResponse, mockSmallDatasetList, mockEmptyResults } from '../../../__mocks__/mockDatasetSearchResults';

// Create mock instance once at module level (before any renders)
const mock = createAxiosMock();

const queryClient = createStorybookQueryClient();

const meta: Meta<typeof DatasetList> = {
  title: 'Templates/DatasetList',
  component: DatasetList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DatasetList template displays a paginated, sortable list of datasets fetched from a search API endpoint.
It includes features like sorting (newest, oldest, title A-Z/Z-A), pagination, result counts, and optional large file warnings.

**Note:** These stories use axios-mock-adapter to intercept API calls and return mock data from \`__mocks__/mockDatasetSearchResults.js\`.
This allows the component to function normally in Storybook with realistic dataset listings.

Key features:
- Sortable dataset list with 4 sorting options
- Configurable pagination with page size control
- URL parameter synchronization for sort/page state
- Optional large file download warning accordion
- Accessibility features with ARIA live regions
- Result count display
        `,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Get mock data from story parameters, default to mockApiResponse
      const mockData = context.parameters.mockData || mockApiResponse;

      // Reset and reconfigure mock for this story
      mock.reset();
      setupDatasetListMock(mock, mockData);

      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ACAContext.Provider value={{ ACA: undefined }}>
              <Story />
            </ACAContext.Provider>
          </QueryClientProvider>
        </MemoryRouter>
      );
    },
  ],
  argTypes: {
    rootUrl: {
      control: 'text',
      description: 'The root URL for the API endpoint. The component will fetch from ${rootUrl}/search/.',
    },
    enableSort: {
      control: 'boolean',
      description: 'Enable/disable the sort dropdown. Defaults to true.',
    },
    enablePagination: {
      control: 'boolean',
      description: 'Enable/disable pagination controls. Defaults to true.',
    },
    defaultPageSize: {
      control: 'number',
      description: 'Number of results per page. Defaults to 10.',
    },
    defaultSort: {
      control: 'object',
      description: 'Default sort configuration with defaultSort and defaultOrder fields. Defaults to { defaultSort: "modified", defaultOrder: "desc" }.',
    },
    pageTitle: {
      control: 'text',
      description: 'Page heading text. Defaults to "What\'s New".',
    },
    showLargeFileWarning: {
      control: 'boolean',
      description: 'Show/hide the large file download warning accordion. Defaults to false.',
    },
    introText: {
      control: 'text',
      description: 'Introductory text displayed above the dataset list. Defaults to empty string.',
    },
    dataDictionaryLinks: {
      control: 'boolean',
      description: 'Enable data dictionary links in dataset items. Defaults to false.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetList>;

export const Default: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: "What's New",
    showLargeFileWarning: false,
    introText: '',
    dataDictionaryLinks: false,
  },
  parameters: {
    mockData: mockApiResponse,
    docs: {
      description: {
        story: 'Standard dataset list configuration showing 25 Medicare/CMS datasets with pagination. Shows newest datasets first with 10 results per page.',
      },
    },
  },
};

export const WithLargeFileWarning: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: "What's New",
    showLargeFileWarning: true,
    introText: '',
    dataDictionaryLinks: false,
  },
  parameters: {
    mockData: mockApiResponse,
    docs: {
      description: {
        story: 'Dataset list with large file download warning accordion displayed. The accordion contains information about memory exhaustion issues and guidance on downloading large files in smaller chunks.',
      },
    },
  },
};

export const WithIntroText: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: 'Recently Updated Datasets',
    showLargeFileWarning: false,
    introText: 'Browse our collection of healthcare datasets. These datasets are updated regularly and include Medicare, Medicaid, and other CMS program data.',
    dataDictionaryLinks: false,
  },
  parameters: {
    mockData: mockApiResponse,
    docs: {
      description: {
        story: 'Dataset list with custom page title and introductory text. The intro text provides context for users before they browse the dataset list.',
      },
    },
  },
};

export const WithDataDictionaryLinks: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: "What's New",
    showLargeFileWarning: false,
    introText: '',
    dataDictionaryLinks: true,
  },
  parameters: {
    mockData: mockApiResponse,
    docs: {
      description: {
        story: 'Dataset list with data dictionary links enabled in each dataset item. When enabled, datasets can include links to their associated data dictionaries.',
      },
    },
  },
};

export const EmptyResults: Story = {
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: "What's New",
    showLargeFileWarning: false,
    introText: '',
    dataDictionaryLinks: false,
  },
  parameters: {
    mockData: mockEmptyResults,
    docs: {
      description: {
        story: 'Dataset list with no results (0 datasets returned). Shows how the component handles empty state.',
      },
    },
  },
};
