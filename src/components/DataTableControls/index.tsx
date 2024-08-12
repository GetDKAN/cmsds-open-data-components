import { useState } from "react";
import { Alert } from "@cmsgov/design-system";
import ManageColumns from "../ManageColumns/ManageColumns";
import FullScreenDataTable from "../FullScreenDataTable";

const DataTableControls = ({id, columns, defaultColumnOrder, columnOrder, setColumnOrder, setColumnVisibility, isModal}) => {
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
        <button
          aria-label='Manage columns - Opens in a dialog'
          icon='columns'
          text='Manage columns'
          className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
          onClick={() => {
            setManageColumnsModalOpen(true)
          }}
        ><i className="far fa-cog ds-u-margin-right--1"></i>Manage Columns</button>
        <button
          aria-label='Full Screen mode - Opens in a dialog'
          icon='fullscreen'
          text='Full Screen'
          className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
          onClick={() => {
            setFullScreenModalOpen(true)
          }}
        ><i className="far fa-cog ds-u-margin-right--1"></i>FullScreen</button>
      </div>
      <div>
        <ManageColumns
          id={id}
          columns={columns}
          columnOrder={columnOrder}
          defaultColumnOrder={defaultColumnOrder} 
          setColumnOrder={setColumnOrder}
          setColumnVisibility={setColumnVisibility}
          modalOpen={manageColumnsModalOpen}
          setModalOpen={setManageColumnsModalOpen}
        />
        <FullScreenDataTable modalOpen={fullScreenModalOpen} setModalOpen={setFullScreenModalOpen} isModal={isModal}/>
      </div>
    </>
  )
};

export default DataTableControls;