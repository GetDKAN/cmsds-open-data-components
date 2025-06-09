import React from "react";
import { useContext, useState } from "react";
import DatasetTable from ".";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import ManageColumnsContext from '../ManageColumns/ManageColumnsContext';

const DataTableStateWrapper = ({showQueryBuilder = true} : {showQueryBuilder?: boolean}) => {
  const { id, datasetTableControls } = useContext(DataTableContext);
  // a wrapper component to keep column state synced between full screen and regular modes
  const localStorageData = id ? JSON.parse(localStorage.getItem(id) as string) : null;

  const defaultPage = 1;
  const [page, setPage] = useState(defaultPage);

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
      setColumnVisibility: setColumnVisibility,
      page: page,
      setPage: setPage
    }}>
      <DatasetTable showQueryBuilder={showQueryBuilder} />
    </ManageColumnsContext.Provider>
  )
}

export default DataTableStateWrapper;