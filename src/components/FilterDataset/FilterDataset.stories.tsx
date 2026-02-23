import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import FilterDataset from './index';
import DataTableContext, { DataTableContextType } from '../../templates/Dataset/DataTableContext';
import { DataTableActionsContext, DataTableActionsContextProps } from '../DatasetTableTab/DataTableActionsContext';
import { ResourceType, DistributionType } from '../../types/dataset';

const DISTRIBUTION_ID = 'story-distribution-id';

const mockDistribution: DistributionType = {
  identifier: DISTRIBUTION_ID,
  data: {
    downloadURL: 'https://example.gov/data.csv',
    format: 'csv',
    title: 'Example Dataset',
    description: 'An example dataset for Storybook',
    describedBy: '',
    describedByType: '',
    mediaType: 'text/csv',
    mimeType: 'text/csv',
    '%Ref:downloadURL': [],
  },
};

const mockResource: ResourceType = {
  columns: ['name', 'state', 'category', 'effective_date', 'amount'],
  count: 150,
  totalRows: 150,
  totalColumns: 5,
  limit: 25,
  offset: 0,
  loading: false,
  conditions: [],
  schema: {
    [DISTRIBUTION_ID]: {
      fields: {
        name: { mysql_type: 'text', description: 'Name', type: 'text' },
        state: { mysql_type: 'text', description: 'State', type: 'text' },
        category: { mysql_type: 'varchar', description: 'Category', type: 'string' },
        effective_date: { mysql_type: 'date', description: 'Effective Date', type: 'date' },
        amount: { mysql_type: 'text', description: 'Amount', type: 'text' },
      },
    },
  },
  values: [],
  setLimit: () => {},
  setOffset: () => {},
  setSort: () => {},
  setConditions: () => {},
  setResource: () => {},
};

const mockActionsContext: DataTableActionsContextProps = {
  columnOrder: [],
  setColumnOrder: () => {},
  columnVisibility: {},
  setColumnVisibility: () => {},
  page: 1,
  setPage: () => {},
  tableDensity: 'normal',
  setTableDensity: () => {},
};

const createDecorator = (contextOverrides: Partial<DataTableContextType> = {}) => {
  const context: DataTableContextType = {
    id: DISTRIBUTION_ID,
    resource: mockResource,
    distribution: mockDistribution,
    rootUrl: 'https://example.gov/api/',
    customColumns: [],
    dataDictionaryBanner: false,
    datasetTableControls: true,
    ...contextOverrides,
  };

  return (Story: React.ComponentType) => (
    <DataTableContext.Provider value={context}>
      <DataTableActionsContext.Provider value={mockActionsContext}>
        <Story />
      </DataTableActionsContext.Provider>
    </DataTableContext.Provider>
  );
};

const meta: Meta<typeof FilterDataset> = {
  title: 'Components/FilterDataset',
  component: FilterDataset,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The FilterDataset component provides a modal dialog for adding, editing, and applying filter conditions to a dataset table. It supports multiple filter types including text, date, and operator-based filtering.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterDataset>;

export const Default: Story = {
  decorators: [createDecorator()],
  parameters: {
    docs: {
      description: {
        story: 'Default filter dialog without empty filter operators. Only standard operators (Is, Starts With, Contains, etc.) are available.',
      },
    },
  },
};

export const WithEmptyFilters: Story = {
  decorators: [createDecorator({ enableEmptyFilters: true })],
  parameters: {
    docs: {
      description: {
        story: 'Filter dialog with `enableEmptyFilters` set to true. Adds "Is Empty" and "Not Empty" operators to all column types.',
      },
    },
  },
};

export const WithExistingConditions: Story = {
  decorators: [
    createDecorator({
      resource: {
        ...mockResource,
        conditions: [
          { property: 'state', operator: '=', value: 'CA' },
          { property: 'amount', operator: '>', value: '1000' },
        ],
      },
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Filter dialog pre-populated with existing filter conditions, showing the "Edit Filters" state.',
      },
    },
  },
};
