import React, { useState } from "react";
import { Dialog } from "@cmsgov/design-system";
import './FullScreenDataTable.scss';
import DatasetTable from "../DatasetTableTab";

const FullScreenDataTable = ({isModal, closeFullScreenModal} : { isModal: boolean, closeFullScreenModal: Function }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (isModal) return null;
  
  return (
    <div className="dkan-fullscreen-data-table-wrapper">
      <button
        aria-label={isModal ? 'Close Full Screen dialog' : 'Full Screen mode - Opens in a dialog'}
        className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent"
        onClick={() => {
          if (isModal) {
            closeFullScreenModal();
          } else {
            setModalOpen(true)
          }
        }}
      >
        <i className={`fa ${isModal ? 'fa-compress' : 'fa-expand'} ds-u-margin-right--1`}></i>
        <span className="ds-u-display--none ds-u-lg-display--inline-block">
          {isModal ? "Exit Full Screen" : "Full Screen"}
        </span>
      </button>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
          heading='Dataset Explorer'
          isOpen={modalOpen}
          onExit={() => setModalOpen(false)}
          className="dkan-full-screen-dataset-dialog"
        >
          <DatasetTable isModal={true} closeFullScreenModal={() => setModalOpen(false)} />
        </Dialog>
      </div>
    </div>
  )
}
export default FullScreenDataTable;