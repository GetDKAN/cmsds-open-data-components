import React from "react";
import { Alert } from "@cmsgov/design-system";
import ManageColumns from "../ManageColumns/ManageColumns";
import FullScreenDataTable from "../FullScreenDataTable";

const DataTableControls = (
  {id, columns, defaultColumnOrder, isModal, closeFullScreenModal} : {
    id: string,
    columns: Array<any>,
    defaultColumnOrder: Array<string>,
    isModal: boolean,
    closeFullScreenModal: Function
  }
) => {
  const hiddenColumns = columns.filter(c => c.getIsVisible() === false ).length;

  return (
    <div className='ds-u-border-top--1 ds-u-fill--gray-lightest ds-u-display--flex ds-u-justify-content--between'>
      <div>
        {hiddenColumns > 0 && (
          <Alert variation="warn">{hiddenColumns} Columns Hidden</Alert>
        )}
      </div>
      <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
        <ManageColumns id={id} columns={columns} defaultColumnOrder={defaultColumnOrder} />
        <FullScreenDataTable isModal={isModal} closeFullScreenModal={closeFullScreenModal} />
      </div>
    </div>
  )
};

export default DataTableControls;