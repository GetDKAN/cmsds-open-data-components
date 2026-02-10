import type { Meta, StoryObj } from '@storybook/react';
import Dataset from './index';
import { MemoryRouter } from 'react-router-dom';
import { createDatasetPageHandlers } from '../../../.storybook/mswHandlers';

const meta: Meta<typeof Dataset> = {
  title: 'Templates/Dataset',
  component: Dataset,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Dataset template renders a full dataset detail page with tabs for Data Table, Overview, Data Dictionary, and API.
It loads metadata from the metastore and data from the datastore. The Data Table tab appears only for CSV distributions.
The default tab is Data Table when the distribution is CSV, otherwise Overview.
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
  argTypes: {
    id: {
      control: 'text',
      description: 'Dataset identifier used to fetch metastore and datastore data.',
    },
    rootUrl: {
      control: 'text',
      description: 'Base URL for API requests (metastore, datastore, and data dictionary).',
    },
    customColumns: {
      control: 'object',
      description: 'Array of column configs with header and accessor for the data table.',
    },
    setDatasetTitle: {
      control: false,
      description: 'Callback invoked with the dataset title; used to sync page/document title.',
    },
    customMetadataMapping: {
      control: 'object',
      description: 'Overrides or extends default metadata field labels/values for the overview tab.',
    },
    apiPageUrl: {
      control: 'text',
      description: 'Path to the API documentation page. Defaults to "/api".',
    },
    dataDictionaryUrl: {
      control: 'text',
      description: 'URL path (relative to rootUrl) for the data dictionary JSON.',
    },
    borderlessTabs: {
      control: 'boolean',
      description: 'When true, tabs render without a border.',
    },
    defaultPageSize: {
      control: 'number',
      description: 'Initial number of rows per page in the data table. Defaults to 25.',
    },
    dataDictionaryCSV: {
      control: 'boolean',
      description: 'When true, enables a CSV download option for the data dictionary.',
    },
    dataDictionaryBanner: {
      control: 'boolean',
      description: 'When true, shows an information banner for the data dictionary link.',
    },
    disableTableControls: {
      control: 'boolean',
      description: 'When true, the table toolbar is hidden, providing a simpler read-only view of the data. Useful for embedded or display-only scenarios.',
    },
    hideDataDictionary: {
      control: 'boolean',
      description: 'When true, hides the Data Dictionary tab.',
    },
    customDescription: {
      control: false,
      description: 'Optional custom renderer for the dataset description section.',
    },
    updateAriaLive: {
      control: false,
      description: 'Optional callback to announce updates to screen readers (aria-live region).',
    },
    showRowLimitNotice: {
      control: 'boolean',
      description: 'When true, shows a notice when row count is limited. Defaults to false.',
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dataset>;

const defaultArgs = {
  id: "wb6u-x2ny",
  rootUrl: '/api/1',
  customColumns: [
    { header: 'NPN', accessor: 'npn' },
    { header: 'Applicable Plan Year', accessor: 'applicable_plan_year' },
    { header: 'Individual Registration Completion Date', accessor: 'individual_registration_completion_date' },
    { header: 'Individual Marketplace End Date', accessor: 'individual_marketplace_end_date' },
    { header: 'Shop Registration Completion Date', accessor: 'shop_registration_completion_date' },
    { header: 'Shop End Date', accessor: 'shop_end_date' },
    { header: 'NPN Valid (Current Plan Year Only)', accessor: 'npn_valid_current_plan_year_only' },
  ],
  apiPageUrl: '/api',
  borderlessTabs: false,
  defaultPageSize: 25,
  dataDictionaryCSV: false,
  dataDictionaryBanner: false,
  disableTableControls: false,
  hideDataDictionary: false,
  showRowLimitNotice: false,
  dataDictionaryUrl: ''
};

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Standard Dataset detail page with Data Table, Overview, Data Dictionary, and API tabs.',
      },
    },
  },
};

export const withoutToolbar: Story = {
  args: { ...defaultArgs, disableTableControls: true },
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Dataset with the Data Table toolbar disabled. Shows a read-only table with no filter, column management, display settings, or fullscreen toggle controls. Useful for embedded or display-only views.',
      },
    },
  },
};

export const withDataDictionaryBanner: Story = {
  args: { ...defaultArgs, dataDictionaryBanner: true },
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Dataset with the data dictionary banner enabled. An information banner appears above the data table to direct users to the Data Dictionary tab.',
      },
    },
  },
};

export const withoutDataDictionaryTab: Story = {
  args: { ...defaultArgs, hideDataDictionary: true },
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Dataset with the Data Dictionary tab hidden.',
      },
    },
  },
};

export const withCustomDescription: Story = {
  args: {
    ...defaultArgs,
    customDescription: () => (
      <div className="ds-u-measure--wide">
        <h2 className="ds-text-heading--2xl ds-u-margin-top--0">About this dataset</h2>
        <p>
          This is example custom description content. Use the <code>customDescription</code> render prop to add
          project-specific context, links to documentation, or other content above the tabs.
        </p>
      </div>
    ),
  },
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Dataset with a custom description rendered above the tabs.',
      },
    },
  },
};

export const withRowLimitNotice: Story = {
  args: { ...defaultArgs, showRowLimitNotice: true },
  parameters: {
    msw: {
      handlers: createDatasetPageHandlers(),
    },
    docs: {
      description: {
        story: 'Dataset with the row limit notice enabled. A notice appears under the API tab above the "API Documentation" heading.',
      },
    },
  },
};
