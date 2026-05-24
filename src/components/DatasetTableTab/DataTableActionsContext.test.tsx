import React, { ReactNode, useContext } from 'react';
import { render, renderHook, act } from '@testing-library/react';
import DataTableContext, {
  DataTableContextType,
} from '../../templates/Dataset/DataTableContext';
import DataTableActionsProvider, {
  DataTableActionsContext,
  DataTableActionsContextProps,
  MockDataTableActionsProvider,
} from './DataTableActionsContext';

const buildWrapper = (dataTableValue: Partial<DataTableContextType> = {}) => {
  const value: DataTableContextType = { id: null, ...dataTableValue };
  return ({ children }: { children: ReactNode }) => (
    <DataTableContext.Provider value={value}>
      <DataTableActionsProvider>{children}</DataTableActionsProvider>
    </DataTableContext.Provider>
  );
};

describe('DataTableActionsProvider', () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('returns defaults when no id and no localStorage data are present', () => {
    const { result } = renderHook(() => useContext(DataTableActionsContext), {
      wrapper: buildWrapper(),
    });
    expect(result.current.page).toBe(1);
    expect(result.current.columnOrder).toEqual([]);
    expect(result.current.columnVisibility).toEqual({});
    expect(result.current.tableDensity).toBe('normal');
  });

  it('wires setters through to consumer state', () => {
    const { result } = renderHook(() => useContext(DataTableActionsContext), {
      wrapper: buildWrapper(),
    });
    act(() => {
      result.current.setPage(3);
      result.current.setColumnOrder(['region', 'quantity']);
      result.current.setColumnVisibility({ region: true, quantity: false });
      result.current.setTableDensity('compact');
    });
    expect(result.current.page).toBe(3);
    expect(result.current.columnOrder).toEqual(['region', 'quantity']);
    expect(result.current.columnVisibility).toEqual({ region: true, quantity: false });
    expect(result.current.tableDensity).toBe('compact');
  });

  it('hydrates columnOrder and columnVisibility from localStorage when id and datasetTableControls are set', () => {
    localStorage.setItem(
      'dist-001',
      JSON.stringify({
        tableColumnOrder: ['region', 'quantity'],
        tableColumnVisibility: { region: true, quantity: false },
      }),
    );
    const { result } = renderHook(() => useContext(DataTableActionsContext), {
      wrapper: buildWrapper({ id: 'dist-001', datasetTableControls: true }),
    });
    expect(result.current.columnOrder).toEqual(['region', 'quantity']);
    expect(result.current.columnVisibility).toEqual({ region: true, quantity: false });
  });

  it('ignores localStorage when datasetTableControls is falsy', () => {
    localStorage.setItem(
      'dist-001',
      JSON.stringify({
        tableColumnOrder: ['region', 'quantity'],
        tableColumnVisibility: { region: true, quantity: false },
      }),
    );
    const { result } = renderHook(() => useContext(DataTableActionsContext), {
      wrapper: buildWrapper({ id: 'dist-001', datasetTableControls: false }),
    });
    expect(result.current.columnOrder).toEqual([]);
    expect(result.current.columnVisibility).toEqual({});
  });

  it('does not read from localStorage when id is null', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    renderHook(() => useContext(DataTableActionsContext), {
      wrapper: buildWrapper({ id: null, datasetTableControls: true }),
    });
    expect(getItemSpy).not.toHaveBeenCalled();
  });

  it('MockDataTableActionsProvider passes its value through to consumers', () => {
    const custom: DataTableActionsContextProps = {
      columnOrder: ['unit_price'],
      setColumnOrder: jest.fn(),
      columnVisibility: { unit_price: true },
      setColumnVisibility: jest.fn(),
      page: 7,
      setPage: jest.fn(),
      tableDensity: 'expanded',
      setTableDensity: jest.fn(),
    };
    let captured: DataTableActionsContextProps | undefined;
    const Probe = () => {
      captured = useContext(DataTableActionsContext);
      return null;
    };
    render(
      <MockDataTableActionsProvider value={custom}>
        <Probe />
      </MockDataTableActionsProvider>,
    );
    expect(captured).toBe(custom);
  });
});
