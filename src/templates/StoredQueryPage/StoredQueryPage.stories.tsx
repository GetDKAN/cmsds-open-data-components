import type { Meta, StoryObj } from '@storybook/react';
import StoredQueryPage from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createStorybookQueryClient } from '../../../.storybook/queryClient';
import { ACAContext } from '../../utilities/ACAContext';
import { createStoredQueryPageHandlers } from '../../../.storybook/mswHandlers';
import {
  mockDatasetMetadata,
  mockDatastoreRecords,
  mockFilteredDatastoreRecords,
  mockLargeDatastoreRecords,
} from '../../../__mocks__/mockStoredQueryData';

const queryClient = createStorybookQueryClient();

const meta: Meta<typeof StoredQueryPage> = {
  title: 'Templates/StoredQueryPage',
  component: StoredQueryPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The StoredQueryPage template displays filtered query results from a dataset in a data table.
It is designed for saved/stored queries where filter conditions are predefined and passed via the query prop.

**Note:** These stories use MSW (Mock Service Worker) to intercept API calls and return mock data from \`__mocks__/mockStoredQueryData.js\`.

Key features:
- Displays data table from a specific dataset distribution (CSV resource)
- Supports predefined query filters passed as JSON string
- Configurable pagination with page size control
- Optional custom column definitions
- Optional table controls (can be disabled for read-only views)
- Shows StoredQueryDownloadButton for downloading filtered results

The component fetches dataset metadata from the metastore API and table data from the datastore API.
Query filters are parsed and transformed before being sent to the datastore endpoint.
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
    id: {
      control: 'text',
      description: 'Dataset identifier for fetching metadata from metastore API.',
    },
    rootUrl: {
      control: 'text',
      description: 'The root URL for the API endpoints. Used for both metastore and datastore calls.',
    },
    customColumns: {
      control: 'object',
      description: 'Custom column definitions to override default table headers. Array of objects with Header and accessor properties.',
    },
    query: {
      control: 'text',
      description: 'JSON-stringified array of query filter conditions. Each condition has column, operator, and value properties. Operators: "is" (=), "is not" (<>), "or" (in).',
    },
    distributionIndex: {
      control: 'number',
      description: 'Index of the distribution to display from the dataset.distribution array. Defaults to 0.',
    },
    defaultPageSize: {
      control: 'number',
      description: 'Number of rows per page. Defaults to 25.',
    },
    disableTableControls: {
      control: 'boolean',
      description: 'Hide table toolbar controls. Defaults to false.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StoredQueryPage>;

export const Default: Story = {
  args: {
    id: 'provider-utilization-2023',
    rootUrl: 'https://data.cms.gov',
    distributionIndex: 0,
    defaultPageSize: 25,
    disableTableControls: false,
  },
  parameters: {
    msw: {
      handlers: createStoredQueryPageHandlers(mockDatasetMetadata, mockDatastoreRecords),
    },
    docs: {
      description: {
        story: 'Basic StoredQueryPage showing Medicare provider data with 4 sample records. All table controls are enabled and the default page size is 25 rows.',
      },
    },
  },
};

export const WithCustomColumns: Story = {
  args: {
    id: 'provider-utilization-2023',
    rootUrl: 'https://data.cms.gov',
    customColumns: [
      { Header: 'NPI Number', accessor: 'npi' },
      { Header: 'Provider', accessor: 'provider_name' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Total Payment', accessor: 'total_payment' },
    ],
    distributionIndex: 0,
    defaultPageSize: 25,
    disableTableControls: false,
  },
  parameters: {
    msw: {
      handlers: createStoredQueryPageHandlers(mockDatasetMetadata, mockDatastoreRecords),
    },
    docs: {
      description: {
        story: 'StoredQueryPage with custom column definitions. Only shows 4 selected columns (NPI, Provider, State, Total Payment) instead of all available fields.',
      },
    },
  },
};

export const WithQueryFilter: Story = {
  args: {
    id: 'provider-utilization-2023',
    rootUrl: 'https://data.cms.gov',
    query: JSON.stringify([
      { column: 'state', operator: 'is', value: 'CA' },
    ]),
    distributionIndex: 0,
    defaultPageSize: 25,
    disableTableControls: false,
  },
  parameters: {
    msw: {
      handlers: createStoredQueryPageHandlers(mockDatasetMetadata, mockFilteredDatastoreRecords),
    },
    docs: {
      description: {
        story: 'StoredQueryPage with a predefined query filter (state = "CA"). Shows only 2 California providers. The query prop contains a JSON-stringified array of filter conditions that are parsed and applied to the datastore query.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    id: 'provider-utilization-2023',
    rootUrl: 'https://data.cms.gov',
    distributionIndex: 0,
    defaultPageSize: 10,
    disableTableControls: false,
  },
  parameters: {
    msw: {
      handlers: createStoredQueryPageHandlers(mockDatasetMetadata, mockLargeDatastoreRecords),
    },
    docs: {
      description: {
        story: 'StoredQueryPage with 50 records and a page size of 10 to demonstrate pagination controls. Users can navigate between pages using the pagination toolbar.',
      },
    },
  },
};

export const DisabledControls: Story = {
  args: {
    id: 'provider-utilization-2023',
    rootUrl: 'https://data.cms.gov',
    distributionIndex: 0,
    defaultPageSize: 25,
    disableTableControls: true,
  },
  parameters: {
    msw: {
      handlers: createStoredQueryPageHandlers(mockDatasetMetadata, mockDatastoreRecords),
    },
    docs: {
      description: {
        story: 'StoredQueryPage with table controls disabled (disableTableControls=true). The table toolbar is hidden, providing a simpler read-only view of the data. Useful for embedded or display-only scenarios.',
      },
    },
  },
};
