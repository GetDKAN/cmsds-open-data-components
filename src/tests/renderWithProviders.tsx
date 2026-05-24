import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataTableContext, { DataTableContextType } from '../templates/Dataset/DataTableContext';
import {
  DataTableActionsContextProps,
  MockDataTableActionsProvider,
} from '../components/DatasetTableTab/DataTableActionsContext';

type ProviderOptions = {
  route?: string;
  dataTableContextValue?: DataTableContextType;
  dataTableActionsValue?: DataTableActionsContextProps;
  queryClient?: QueryClient;
  renderOptions?: Omit<RenderOptions, 'wrapper'>;
};

const wrap = (
  ui: ReactNode,
  { dataTableContextValue, dataTableActionsValue, queryClient, route }: ProviderOptions,
) => {
  let tree: ReactNode = ui;
  if (dataTableActionsValue) {
    tree = (
      <MockDataTableActionsProvider value={dataTableActionsValue}>{tree}</MockDataTableActionsProvider>
    );
  }
  if (dataTableContextValue) {
    tree = <DataTableContext.Provider value={dataTableContextValue}>{tree}</DataTableContext.Provider>;
  }
  if (queryClient) {
    tree = <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>;
  }
  return (
    <MemoryRouter
      initialEntries={[route ?? '/']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {tree}
    </MemoryRouter>
  );
};

export const renderWithProviders = (ui: ReactElement, options: ProviderOptions = {}) =>
  render(wrap(ui, options), options.renderOptions);

export const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });

export { screen, userEvent };
