import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ResourceType, ColumnType } from '../../types/dataset';
import DataTablePageResults from '../DataTablePageResults';
import FilterChip from '../FilterChip';
import { getOperatorLabel } from '../../templates/FilteredResource/functions';
import './DataTableToolbar.scss';

/**
 * Simplified version of DataTableToolbar for Storybook
 * 
 * This is a standalone version created to avoid TanStack Query/Table dependencies
 * in the story. It replicates the core UI and functionality without requiring
 * complex context providers.
 */
type DataTableToolbarProps = {
  resource: ResourceType;
  id: string;
  columns: Array<any>;
  defaultColumnOrder: Array<string>;
  isModal: boolean;
  datasetTableControls: boolean;
  columnVisibility: {
    [key: string]: boolean
  };
  setColumnVisibility: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  resource,
  id,
  columns,
  defaultColumnOrder,
  isModal,
  datasetTableControls,
  columnVisibility,
  setColumnVisibility,
}) => {
  const { limit, offset, count, conditions, setConditions } = resource;
  const intCount = count ? count : 0;
  const hiddenColumns = Object.keys(columnVisibility).filter(key => columnVisibility[key] === false).length;

  const removeCondition = (index: number) => {
    let updatedConditions = JSON.parse(JSON.stringify(conditions));
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };

  const resetColumnVisibility = () => {
    const cols = { ...columnVisibility };
    for (let key in cols) {
      if (cols[key] === false) {
        cols[key] = true;
      }
    }
    setColumnVisibility(cols);
  };

  return (
    <div className="ds-u-margin-top--2">
      <div className="dkan-filter-dataset-toolbar ds-u-fill--white ds-u-border--1" role="region" aria-label="toolbar">
        <div className="ds-l-col--12 ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center ds-u-flex-wrap--wrap ds-u-padding-x--0 ds-u-padding-y--2">
          <div className="ds-u-padding-x--2">
            {!resource.loading && resource.count !== null && (
              <DataTablePageResults
                totalRows={intCount}
                limit={limit}
                offset={offset}
                className="data-table-results ds-u-margin--0 ds-u-font-size--sm ds-u-padding-y--0 ds-u-md-padding-y--1 ds-u-padding-bottom--2 ds-u-md-padding-bottom--0"
              />
            )}
          </div>
          {datasetTableControls && (
            <div className="dkan-data-table-toolbar-controls ds-u-display--flex ds-u-flex-wrap--wrap ds-u-align-items--center ds-l-md-col--auto ds-l-col--12 ds-u-padding-x--2 ds-u-padding-top--2 ds-u-md-padding-top--0">
              <button className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent">
                <i className="far fa-filter ds-u-margin-right--1"></i>
                <span className="dkan-dataset-toolbar-button-label">Filter Dataset</span>
              </button>
              <button className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent">
                <i className="far fa-columns ds-u-margin-right--1"></i>
                <span className="dkan-dataset-toolbar-button-label">Manage Columns</span>
              </button>
              <button className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent">
                <i className="far fa-cog ds-u-margin-right--1"></i>
                <span className="dkan-dataset-toolbar-button-label">Display Settings</span>
              </button>
              <button className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent">
                <i className="far fa-expand ds-u-margin-right--1"></i>
                <span className="dkan-dataset-toolbar-button-label">Full Screen</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {Array.isArray(conditions) && (conditions.length > 0 || hiddenColumns > 0) && (
        <div className="ds-u-fill--white ds-u-padding-x--0 ds-u-md-padding-x--2 ds-u-padding-top--2">
          <h2 className="ds-u-margin--0 ds-u-margin-bottom--2 ds-u-font-size--lg ds-u-font-weight--bold">Selected filters</h2>
          <div className="ds-u-display--flex ds-u-justify-content--between ds-u-md-align-items--end ds-u-flex-direction--column ds-u-md-flex-direction--row">
            <div className="ds-u-display--flex ds-u-padding-right--0 ds-u-md-padding-right--4 ds-u-flex-wrap--wrap">
              {conditions.length > 0
                ? conditions.map((condition, index) => (
                  <FilterChip
                    key={index}
                    iconClass="far fa-filter"
                    text={`"${condition.property}" ${getOperatorLabel(condition.operator).toLowerCase()} ${condition.value}`}
                    onClick={() => {
                      removeCondition(index);
                    }}
                  />
                ))
                : null}
              {hiddenColumns > 0
                ? <FilterChip
                    iconClass="fa fa-columns"
                    text={`${hiddenColumns} Column${hiddenColumns === 1 ? '' : 's'} Hidden`}
                    onClick={() => {
                      resetColumnVisibility();
                    }}
                  />
                : null
              }
            </div>
            <div className="ds-l-col--auto ds-u-padding--0 ds-u-display--flex ds-u-justify-content--end">
              <button
                className="dkan-clear-all-filters-button ds-u-color--primary ds-u-font-size--md ds-u-font-weight--bold ds-u-border--0 ds-u-padding--0 ds-u-margin--0 ds-u-fill--transparent ds-u-text-decoration--underline ds-u-margin-bottom--1"
                onClick={() => {
                  setConditions([]);
                  resetColumnVisibility();
                }}
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof DataTableToolbar> = {
  title: 'Components/DataTableToolbar',
  component: DataTableToolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DataTableToolbar component provides controls and information for a data table, including pagination results, filter controls, column management, display settings, and fullscreen toggle. It also displays active filters and hidden columns as removable chips.
        `,
      },
    },
  },
  argTypes: {
    resource: {
      control: 'object',
      description: 'Resource object containing data and controls.',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the dataset.',
    },
    columns: {
      control: 'object',
      description: 'Array of column definitions with header and accessor properties.',
    },
    defaultColumnOrder: {
      control: 'object',
      description: 'Array of column accessor names in default order.',
    },
    isModal: {
      control: 'boolean',
      description: 'Whether the toolbar is displayed in a modal context.',
    },
    datasetTableControls: {
      control: 'boolean',
      description: 'Whether to display dataset table controls (filters, columns, settings).',
    },
    columnVisibility: {
      control: 'object',
      description: 'Object mapping column accessors to visibility state.',
    },
    setColumnVisibility: {
      control: 'function',
      description: 'Callback to update column visibility.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableToolbar>;

const mockResource: ResourceType = {
  columns: ['id', 'name', 'state', 'population', 'area'],
  count: 250,
  totalRows: 250,
  totalColumns: 5,
  limit: 25,
  offset: 0,
  loading: false,
  conditions: [],
  schema: {},
  values: [],
  setLimit: () => {},
  setOffset: () => {},
  setSort: () => {},
  setConditions: () => {},
  setResource: () => {},
};

const mockColumns: ColumnType[] = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'State', accessor: 'state' },
  { header: 'Population', accessor: 'population' },
  { header: 'Area', accessor: 'area' },
];

export const Default: Story = {
  args: {
    resource: mockResource,
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default toolbar with all controls enabled and no active filters.',
      },
    },
  },
};

export const WithFilters: Story = {
  args: {
    resource: {
      ...mockResource,
      conditions: [
        { property: 'state', operator: '=', value: 'CA' },
        { property: 'population', operator: '>', value: '100000' },
      ],
      count: 42,
      totalRows: 42,
    },
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with active filters applied to the dataset.',
      },
    },
  },
};

export const WithHiddenColumns: Story = {
  args: {
    resource: mockResource,
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: false,
      population: true,
      area: false,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with some columns hidden, showing the hidden columns chip.',
      },
    },
  },
};

export const WithFiltersAndHiddenColumns: Story = {
  args: {
    resource: {
      ...mockResource,
      conditions: [
        { property: 'state', operator: '=', value: 'NY' },
      ],
      count: 25,
      totalRows: 25,
    },
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: false,
      area: false,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with both active filters and hidden columns.',
      },
    },
  },
};

export const NoControls: Story = {
  args: {
    resource: mockResource,
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: false,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with table controls disabled, showing only pagination results.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    resource: {
      ...mockResource,
      loading: true,
      count: null,
    },
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar in loading state without pagination results displayed.',
      },
    },
  },
};

export const ModalContext: Story = {
  args: {
    resource: mockResource,
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: true,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar displayed in a modal context.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    resource: {
      ...mockResource,
      count: 15750,
      totalRows: 15750,
      limit: 100,
      offset: 500,
    },
    id: 'dataset-123',
    columns: mockColumns,
    defaultColumnOrder: ['id', 'name', 'state', 'population', 'area'],
    isModal: false,
    datasetTableControls: true,
    columnVisibility: {
      id: true,
      name: true,
      state: true,
      population: true,
      area: true,
    },
    setColumnVisibility: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar displaying pagination for a large dataset with custom offset.',
      },
    },
  },
};
