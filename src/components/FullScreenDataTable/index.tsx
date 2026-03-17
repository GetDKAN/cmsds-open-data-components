import React, { useState } from "react";
import { Dialog } from "@cmsgov/design-system";
import './FullScreenDataTable.scss';
import DatasetTable from "../DatasetTableTab";

export type FullScreenDataTableProps = {  
  isModal: boolean;
  showTableResults?: boolean;
  showFilterDatasetButton?: boolean;
  showManageColumnsButton?: boolean;
  showDisplaySettingsButton?: boolean;
  showFullScreenButton?: boolean;
  showInfoShareContainer?: boolean;
}

const FullScreenDataTable: React.FC<FullScreenDataTableProps> = ({
  isModal,
  showTableResults = true,
  showFilterDatasetButton = true,
  showManageColumnsButton = true,
  showDisplaySettingsButton = true,
  showFullScreenButton = true,
  showInfoShareContainer = true,
}) => {
  const [modalOpen, setModalOpen] = useState(isModal);
  if (isModal) return null;
  
  return (
    <div className="dkan-fullscreen-data-table-wrapper">
      <button
        aria-haspopup="dialog"
        className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent"
        onClick={() => {
          if (modalOpen) {
            setModalOpen(false);
          } else {
            setModalOpen(true)
          }
        }}
      >
        <i className={`far ${modalOpen ? 'fa-compress' : 'fa-expand'} ds-u-margin-right--1`}></i>
        <span className="dkan-dataset-toolbar-button-label">
          {modalOpen ? "Exit Full Screen" : "Full Screen"}
        </span>
      </button>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
          heading='Dataset Explorer'
          isOpen={modalOpen}
          onExit={() => setModalOpen(false)}
          ariaCloseLabel="Close dialog"
          className="dkan-full-screen-dataset-dialog"
        >
          <DatasetTable
            isModal={true}
            showTableResults={showTableResults}
            showFilterDatasetButton={showFilterDatasetButton}
            showManageColumnsButton={showManageColumnsButton}
            showDisplaySettingsButton={showDisplaySettingsButton}
            showFullScreenButton={showFullScreenButton}
            showInfoShareContainer={showInfoShareContainer}
          />
        </Dialog>
      </div>
    </div>
  )
}
export default FullScreenDataTable;