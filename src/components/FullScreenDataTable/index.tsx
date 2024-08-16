import React from "react";
import { Dialog } from "@cmsgov/design-system";
import './FullScreenDataTable.scss';
import DatasetTable from "../DatasetTableTab";

const FullScreenDataTable = ({modalOpen, setModalOpen} : {modalOpen: boolean, setModalOpen: Function}) => {
  return (
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
  )
}
export default FullScreenDataTable;