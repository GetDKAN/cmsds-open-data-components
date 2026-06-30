import type { Decorator } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DataTableContext, {
  DataTableContextType,
} from '../src/templates/Dataset/DataTableContext';
import {
  DataTableActionsContext,
  DataTableActionsContextProps,
} from '../src/components/DatasetTableTab/DataTableActionsContext';
import { mockResource } from '../__mocks__/mockResource';
import { mockDistribution } from '../__mocks__/mockDistribution';

export const defaultDataTableContext: DataTableContextType = {
  id: 'wb6u-x2ny',
  resource: mockResource,
  distribution: mockDistribution,
  rootUrl: '/api/1',
  customColumns: [],
  dataDictionaryBanner: false,
  datasetTableControls: false,
  enableEmptyFilters: false,
  relativeHomeUrlPrepend: '',
};

export const defaultDataTableActionsContext: DataTableActionsContextProps = {
  columnOrder: mockResource.columns ?? [],
  setColumnOrder: () => {},
  columnVisibility: {},
  setColumnVisibility: () => {},
  page: 1,
  setPage: () => {},
  tableDensity: 'normal',
  setTableDensity: () => {},
};

/**
 * Wraps a story in MemoryRouter + DataTableContext + DataTableActionsContext.
 * Overrides are shallow-merged on top of the defaults.
 */
export const withDataTableContexts =
  (
    contextOverrides: Partial<DataTableContextType> = {},
    actionsOverrides: Partial<DataTableActionsContextProps> = {}
  ): Decorator =>
  (Story) => (
    <MemoryRouter>
      <DataTableContext.Provider value={{ ...defaultDataTableContext, ...contextOverrides }}>
        <DataTableActionsContext.Provider
          value={{ ...defaultDataTableActionsContext, ...actionsOverrides }}
        >
          <Story />
        </DataTableActionsContext.Provider>
      </DataTableContext.Provider>
    </MemoryRouter>
  );

/**
 * Same as `withDataTableContexts` but pulls per-story overrides from `args.contextOverride`
 * and `args.actionsOverride`. Use this when a story needs to vary the contexts per-instance
 * (e.g. Loading / Empty / Error variants). Define the args as `control: false` so they
 * don't pollute the docs table.
 */
export const withDataTableContextsFromArgs: Decorator = (Story, context) => {
  const args = context.args as {
    contextOverride?: Partial<DataTableContextType>;
    actionsOverride?: Partial<DataTableActionsContextProps>;
  };
  return (
    <MemoryRouter>
      <DataTableContext.Provider value={{ ...defaultDataTableContext, ...args.contextOverride }}>
        <DataTableActionsContext.Provider
          value={{ ...defaultDataTableActionsContext, ...args.actionsOverride }}
        >
          <Story />
        </DataTableActionsContext.Provider>
      </DataTableContext.Provider>
    </MemoryRouter>
  );
};
