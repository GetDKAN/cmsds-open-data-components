import type { Meta, StoryObj } from '@storybook/react';
import DatasetSearch from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStorybookQueryClient } from '../../../.storybook/queryClient';
import { ACAContext } from '../../utilities/ACAContext';
import { createDatasetListHandlers } from '../../../.storybook/mswHandlers';
import { mockApiResponseWithFacets } from '../../../__mocks__/mockDatasetSearchResults';

const queryClient = createStorybookQueryClient();

const meta: Meta<typeof DatasetSearch> = {
  title: 'Templates/DatasetSearch',
  component: DatasetSearch,
  args: {
    rootUrl: 'https://data.cms.gov',
    enableSort: true,
    enablePagination: true,
    defaultPageSize: 10,
    defaultSort: {
      defaultSort: 'modified',
      defaultOrder: 'desc',
    },
    pageTitle: 'Dataset Explorer',
    showLargeFileWarning: false,
    introText: '',
    dataDictionaryLinks: false,
    showDateDetails: false,
    showTopics: false,
  },
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: createDatasetListHandlers(mockApiResponseWithFacets),
    },
    docs: {
      description: {
        component: `
The DatasetSearch template provides a full-featured search page with text search, faceted sidebar filtering (theme/keyword), sorting, and pagination.

**Note:** These stories use MSW (Mock Service Worker) to intercept API calls and return mock data from \`__mocks__/mockDatasetSearchResults.js\`.

Key features:
- Text search with validation (alphanumeric only)
- Faceted sidebar with theme and keyword filters
- Sortable results (newest, oldest, title A-Z/Z-A)
- Configurable pagination
- Optional large file warnings, date details, topic pills, and data dictionary links
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ACAContext.Provider value={{ ACA: undefined }}>
            <Story />
          </ACAContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    rootUrl: {
      control: 'text',
      description: 'Root URL for the API endpoint. The component fetches from ${rootUrl}/search/.',
    },
    enableSort: {
      control: 'boolean',
      description: 'Enable/disable the sort dropdown.',
    },
    enablePagination: {
      control: 'boolean',
      description: 'Enable/disable pagination controls.',
    },
    defaultPageSize: {
      control: 'number',
      description: 'Number of results per page.',
    },
    defaultSort: {
      control: 'object',
      description: 'Default sort configuration with defaultSort and defaultOrder fields.',
    },
    pageTitle: {
      control: 'text',
      description: 'Page heading text.',
    },
    categoriesTitle: {
      control: 'text',
      description: 'Title for the theme facets section in the sidebar.',
    },
    filterTitle: {
      control: 'text',
      description: 'Title for the keyword facets section in the sidebar.',
    },
    showLargeFileWarning: {
      control: 'boolean',
      description: 'Show/hide the large file download warning accordion.',
    },
    largeFileThemes: {
      control: 'object',
      description: 'Array of theme names whose datasets should display a large file warning icon.',
    },
    introText: {
      control: 'text',
      description: 'Introductory text displayed above the search results.',
    },
    dataDictionaryLinks: {
      control: 'boolean',
      description: 'Enable data dictionary links in dataset items.',
    },
    showDateDetails: {
      control: 'boolean',
      description: 'Show released and refresh dates on dataset items.',
    },
    showTopics: {
      control: 'boolean',
      description: 'Show topic pills on dataset items.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatasetSearch>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Standard search page with facets sidebar, search input, sort dropdown, and paginated results.',
      },
    },
  },
};

export const WithLargeFileWarning: Story = {
  args: {
    showLargeFileWarning: true,
    largeFileThemes: ['Medicare'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the large file download warning accordion and marks datasets with Medicare theme as large files.',
      },
    },
  },
};

export const WithDateDetails: Story = {
  args: {
    showDateDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays released and next refresh dates on each dataset item.',
      },
    },
  },
};

export const WithTopics: Story = {
  args: {
    showTopics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows topic pills derived from the theme field on each dataset item.',
      },
    },
  },
};

export const WithDataDictionaryLinks: Story = {
  args: {
    dataDictionaryLinks: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Enables data dictionary links in each dataset item.',
      },
    },
  },
};

export const WithIntroText: Story = {
  args: {
    introText: 'Browse our collection of healthcare datasets. These datasets are updated regularly and include Medicare, Medicaid, and other CMS program data.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays custom introductory text above the search area.',
      },
    },
  },
};
