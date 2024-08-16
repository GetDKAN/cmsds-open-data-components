import React from "react";
import { createContext, useContext, useState } from "react";
import DatasetTable from ".";
import { DataTableContext } from "../../templates/Dataset";

export const ManageColumnsContext = createContext({})

const DataTableStateWrapper = () => {
  const { id, datasetTableControls } = useContext(DataTableContext);
  // a wrapper component to keep column state synced between full screen and regular modes
  const localStorageData = id ? JSON.parse(localStorage.getItem(id) as string) : null;

  const [columnOrder, setColumnOrder] = useState(() => {
    if (datasetTableControls && localStorageData)
      return localStorageData.tableColumnOrder;
    else
      return [];
  })
  const [columnVisibility, setColumnVisibility] = useState(() => {
    if (datasetTableControls && localStorageData)
      return localStorageData.tableColumnVisibility;
    else
      return {};
  })

  return (
    <ManageColumnsContext.Provider value={{
      columnOrder: columnOrder,
      setColumnOrder: setColumnOrder,
      columnVisibility: columnVisibility,
      setColumnVisibility: setColumnVisibility
    }}>
      <DatasetTable />
    </ManageColumnsContext.Provider>
  )
}

export default DataTableStateWrapper;