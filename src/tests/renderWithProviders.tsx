import React, { ContextType, ReactElement, ReactNode } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataTableContext, { DataTableContextType } from '../templates/Dataset/DataTableContext';
import HeaderContext from '../templates/Header/HeaderContext';
import {
  DataTableActionsContextProps,
  MockDataTableActionsProvider,
} from '../components/DatasetTableTab/DataTableActionsContext';

type HeaderContextValue = ContextType<typeof HeaderContext>;

type ProviderOptions = {
  route?: string;
  dataTableContextValue?: DataTableContextType;
  dataTableActionsValue?: DataTableActionsContextProps;
  headerContextValue?: HeaderContextValue;
  queryClient?: QueryClient;
  renderOptions?: Omit<RenderOptions, 'wrapper'>;
};

const wrap = (
  ui: ReactNode,
  {
    dataTableContextValue,
    dataTableActionsValue,
    headerContextValue,
    queryClient,
    route,
  }: ProviderOptions,
) => {
  let tree: ReactNode = ui;
  if (headerContextValue) {
    tree = <HeaderContext.Provider value={headerContextValue}>{tree}</HeaderContext.Provider>;
  }
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

export const renderWithProviders = (ui: ReactElement, options: ProviderOptions = {}) => {
  // Use RTL's `wrapper` option so providers stay applied across `rerender` calls.
  const Wrapper = ({ children }: { children: ReactNode }) => <>{wrap(children, options)}</>;
  return render(ui, { wrapper: Wrapper, ...options.renderOptions });
};

export const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });

export { screen, userEvent };
