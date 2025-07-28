import React from "react";
import { useState } from "react";
import { Alert } from "@cmsgov/design-system";
import ManageColumns from "../ManageColumns/ManageColumns";
import FullScreenDataTable from "../FullScreenDataTable";
import FilterDataset from "../FilterDataset";

const DataTableControls = (
  {id, columns, defaultColumnOrder, isModal, closeFullScreenModal} : {
    id: string,
    columns: Array<any>,
    defaultColumnOrder: Array<string>,
    isModal: boolean,
    closeFullScreenModal: Function
  }
) => {
  const [filterDatasetModalOpen, setFilterDatasetModalOpen] = useState(false);
  const [manageColumnsModalOpen, setManageColumnsModalOpen] = useState(false);
  const [fullScreenModalOpen, setFullScreenModalOpen] = useState(false);

  const hiddenColumns = columns.filter(c => c.getIsVisible() === false ).length;

  return (
    <>
      <div className='ds-u-border-top--1 ds-u-fill--gray-lightest ds-u-display--flex ds-u-justify-content--between'>
        <div>
          {hiddenColumns > 0 && (
            <Alert variation="warn">{hiddenColumns} Columns Hidden</Alert>
          )}
        </div>
        <div>
          <button
            aria-label='Filter Dataset - Opens in a dialog'
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              setFilterDatasetModalOpen(true)
            }}
          >
            <i className="far fa-filter ds-u-margin-right--1"></i>Filter Dataset
          </button>
          <button
            aria-label='Manage columns - Opens in a dialog'
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              setManageColumnsModalOpen(true)
            }}
          >
            <i className="far fa-cog ds-u-margin-right--1"></i>Manage Columns
          </button>
          <button
            aria-label={isModal ? 'Close Full Screen dialog' : 'Full Screen mode - Opens in a dialog'}
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              if (isModal) {
                closeFullScreenModal();
              } else {
                setFullScreenModalOpen(true)
              }
            }}
          >
            <i className={`fa ${isModal ? 'fa-compress' : 'fa-expand'} ds-u-margin-right--1`}></i>{isModal ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </div>
      <div>
        <FilterDataset
          modalOpen={filterDatasetModalOpen}
          setModalOpen={setFilterDatasetModalOpen}
        />
        <ManageColumns
          id={id}
          columns={columns}
          defaultColumnOrder={defaultColumnOrder} 
          modalOpen={manageColumnsModalOpen}
          setModalOpen={setManageColumnsModalOpen}
        />
        {!isModal && (
          <FullScreenDataTable modalOpen={fullScreenModalOpen} setModalOpen={setFullScreenModalOpen} />
        )}
      </div>
    </>
  )
};

export default DataTableControls;