import { useState } from "react";
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
            aria-label='Manage columns - Opens in a dialog'
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              setManageColumnsModalOpen(true)
            }}
          ><i className="far fa-cog ds-u-margin-right--1"></i>Manage Columns</button>
          <button
            aria-label='Full Screen mode - Opens in a dialog'
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              // todo if in modal needs to close the original modal
              if (isModal) {
                closeFullScreenModal();
              } else {
                setFullScreenModalOpen(true)
              }
            }}
          ><i className={`fa ${isModal ? 'fa-compress' : 'fa-expand'} ds-u-margin-right--1`}></i>{isModal ? "Exit Full Screen" : "Full Screen"}</button>
        </div>
      </div>
      <div>
        <ManageColumns
          id={id}
          columns={columns}
          defaultColumnOrder={defaultColumnOrder} 
          modalOpen={manageColumnsModalOpen}
          setModalOpen={setManageColumnsModalOpen}
        />
        <FullScreenDataTable modalOpen={fullScreenModalOpen} setModalOpen={setFullScreenModalOpen} isModal={isModal}/>
      </div>
    </>
  )
};

export default DataTableControls;