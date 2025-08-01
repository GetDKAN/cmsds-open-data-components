import React, { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import DataTableContext from '../../templates/Dataset/DataTableContext';
  
// Define context props
type DataTableActionsContextProps = {
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  columnVisibility: {
    [key: string]: boolean
  }
  setColumnVisibility: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  tableDensity: 'compact' | 'normal' | 'expanded';
  setTableDensity: React.Dispatch<React.SetStateAction<'compact' | 'normal' | 'expanded'>>;
}

// Create a defaults object for reusability
const DataTableActionsContextDefaults: DataTableActionsContextProps = {
  columnOrder: [],
  setColumnOrder: () => {},
  columnVisibility: {},
  setColumnVisibility: () => {},
  page: 1,
  setPage: () => {},
  tableDensity: 'normal' as const,
  setTableDensity: () => {}
}

// Create the context instance
export const DataTableActionsContext = createContext<DataTableActionsContextProps>(DataTableActionsContextDefaults);

// Define our reusable provider component
const DataTableActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set up all of the state
  const { id, datasetTableControls } = useContext(DataTableContext);
  // a wrapper component to keep column state synced between full screen and regular modes
  const localStorageData = id ? JSON.parse(localStorage.getItem(id) as string) : null;

  const [page, setPage] = useState<DataTableActionsContextProps['page']>(1);
  const [columnOrder, setColumnOrder] = useState<DataTableActionsContextProps['columnOrder']>(() => {
    if (datasetTableControls && localStorageData) return localStorageData.tableColumnOrder;
    else return [];
  });
  const [columnVisibility, setColumnVisibility] = useState<DataTableActionsContextProps['columnVisibility']>(() => {
    if (datasetTableControls && localStorageData) return localStorageData.tableColumnVisibility;
    else return {};
  });
  const [tableDensity, setTableDensity] = useState<DataTableActionsContextProps['tableDensity']>('normal');

  const providerValue: DataTableActionsContextProps = {
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    page,
    setPage,
    tableDensity,
    setTableDensity
  }

  return (
    <DataTableActionsContext.Provider value={providerValue}>
      {children}
    </DataTableActionsContext.Provider>
  )
}

// For easy mocking in unit tests
type MockDataTableActionsProviderProps = {
  children: ReactNode;
  value: DataTableActionsContextProps
}

export const MockDataTableActionsProvider: React.FC<MockDataTableActionsProviderProps> = ({
  children,
  value = DataTableActionsContextDefaults
}) => (
  <DataTableActionsContext.Provider value={value}>
    {children}
  </DataTableActionsContext.Provider>
);

export default DataTableActionsProvider;
