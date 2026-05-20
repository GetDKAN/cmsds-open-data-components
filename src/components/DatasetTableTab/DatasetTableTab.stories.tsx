import type { Meta, StoryObj } from '@storybook/react';
import DatasetTable from './index';
import DataTableContext from '../../templates/Dataset/DataTableContext';
import { DataTableContextType } from '../../templates/Dataset/DataTableContext';
import { DataTableActionsContext, DataTableActionsContextProps } from './DataTableActionsContext';
import { MemoryRouter } from 'react-router-dom';
import { mockResource } from '../../../__mocks__/mockResource';
import { mockDistribution } from '../../../__mocks__/mockDistribution';
import { ResourceType, DistributionType, ColumnType } from '../../types/dataset';

// Created a "mocked" version of this type instead of importing it because most of the
// properties are optional in the type defined in src/templates/Dataset/DataTableContext.tsx
// and it causes a lot of TypeScript headaches when trying to manipulate the dataTableContextProviderValue
// in the stories
export type MockDataTableContextType = {
  id: string | null,
  resource: ResourceType,
  distribution: DistributionType,
  rootUrl: string,
  customColumns: Array<ColumnType>,
  dataDictionaryBanner: boolean,
  datasetTableControls: boolean,
  enableEmptyFilters: boolean
}

// Mock DataTableContext.Provider value
const defaultDataTableContextProviderValue: MockDataTableContextType = {
  id: 'wb6u-x2ny',
  resource: mockResource,
  distribution: mockDistribution,
  rootUrl: '/api/1',
  customColumns: [
    { accessor: 'licensing_authority' },
    { accessor: 'resident_state' },
    { accessor: 'approved_license_level_loa' },
    { accessor: 'appointment_level_loa' },
    { accessor: 'approved_class_type' },
  ],
  dataDictionaryBanner: false,
  datasetTableControls: true,
  enableEmptyFilters: false,
};

// Mock DataTableActionsContext.Provider value
const defaultDataTableActionsContextProviderValue: DataTableActionsContextProps = {
  columnOrder: [
    'npn',
    'applicable_plan_year',
    'individual_registration_completion_date',
    'individual_marketplace_end_date',
    'shop_registration_completion_date',
    'shop_end_date',
    'npn_valid_current_plan_year_only',
  ],
  columnVisibility: {},
  page: 1,
  setColumnOrder: () => {},
  setColumnVisibility: () => {},
  setPage: () => {},
  setTableDensity: () => {},
  tableDensity: 'normal',
};

// We are mixing actual component props with the context values so that we
// can change said values for each story
type StoryArgs = React.ComponentProps<typeof DatasetTable> & {
  dataTableContextProviderValue: DataTableContextType;
  dataTableActionsContextProviderValue: DataTableActionsContextProps;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/DatasetTableTab',
  component: DatasetTable,
  args: {
    isModal: false,
    showCopyLinkButton: true,
    showDataTableToolbar: true,
    showDownloadFilteredDataButton: true,
    showDownloadFullDataButton: true,
    showStoredQueryDownloadButton: false,
    showTableResults: true,
    showFilterDatasetButton: true,
    showManageColumnsButton: true,
    showDisplaySettingsButton: true,
    showFullScreenButton: true,
    showInfoShareContainer: true,
    errorHomeButtonHref: '/',
    dataTableContextProviderValue: defaultDataTableContextProviderValue,
    dataTableActionsContextProviderValue: defaultDataTableActionsContextProviderValue
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The DatasetTableTab component renders everything under the "Data Table" tab on a dataset detail page. The rendered
content includes dataset download buttons, data table toolbar component, sharing options, and data table with pagination controls.
        `,
      },
      source: {
        code: `
<DatasetTable
  isModal={false}
  showCopyLinkButton
  showDataTableToolbar
  showDisplaySettingsButton
  showDownloadFilteredDataButton
  showDownloadFullDataButton
  showStoredQueryDownloadButton={false}
  showFilterDatasetButton
  showFullScreenButton
  showInfoShareContainer
  showManageColumnsButton
  showTableResults
  errorHomeButtonHref="/"
/>
        `,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <MemoryRouter>
        <DataTableContext.Provider value={context.args.dataTableContextProviderValue}>
          <DataTableActionsContext.Provider value={context.args.dataTableActionsContextProviderValue}>
            <Story />
          </DataTableActionsContext.Provider>
        </DataTableContext.Provider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    isModal: {
      control: 'boolean',
      description: 'Whether or not the dataset table is rendered within a modal.',
    },
    showCopyLinkButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Copy link to filtered data" button in the "Share" dropdown menu.',
    },
    showDataTableToolbar: {
      control: 'boolean',
      description: 'Whether or not to show the data table toolbar component, which includes everything above the data table.',
    },
    showDownloadFilteredDataButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Download filtered data (CSV)" button in the "Share" dropdown menu.',
    },
    showDownloadFullDataButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Download full dataset (CSV)" button.',
    },
    showStoredQueryDownloadButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Download stored query data (CSV)" button in the "Share" dropdown menu.',
    },
    showTableResults: {
      control: 'boolean',
      description: 'Whether or not to show the record display count in the data table toolbar component.',
    },
    showFilterDatasetButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Filter Dataset" button in the data table toolbar component.',
    },
    showManageColumnsButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Manage Columns" button in the data table toolbar component.',
    },
    showDisplaySettingsButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Display Settings" button in the data table toolbar component.',
    },
    showFullScreenButton: {
      control: 'boolean',
      description: 'Whether or not to show the "Full Screen" button in the data table toolbar component.',
    },
    showInfoShareContainer: {
      control: 'boolean',
      description: 'Whether or not to show the text information and "Share" button below data table toolbar.',
    },
    errorHomeButtonHref: {
      control: 'text',
      description: 'Href value for the "Back to home" button that displays when there is a 400 or 500 API error.',
    },
    dataTableContextProviderValue: {
      table: { disable: true }, // Don't show this in the Docs table
    },
    dataTableActionsContextProviderValue: {
      table: { disable: true }, // Don't show this in the Docs table
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    ...meta.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard "Data Table" tab displayed on a dataset detail page.',
      },
    },
  },
};

export const Error400: Story = {
  args: {
    ...meta.args,
    dataTableContextProviderValue: {
      ...defaultDataTableContextProviderValue,
      resource: {
        ...defaultDataTableContextProviderValue?.resource,
        error: {
          status: 400,
          message: 'No datastore storage found for abc123',
          stack: ''
        }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Error message displayed for useDatastore API 400 error.',
      },
    },
  },
}

export const Error500: Story = {
  args: {
    ...meta.args,
    dataTableContextProviderValue: {
      ...defaultDataTableContextProviderValue,
      resource: {
        ...defaultDataTableContextProviderValue?.resource,
        error: {
          status: 500,
          message: 'Internal server error.',
          stack: ''
        }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Error message displayed for useDatastore API 500 error.',
      },
    },
  },
}
