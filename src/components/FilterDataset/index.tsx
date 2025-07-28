import React from "react";
import { Dialog } from "@cmsgov/design-system";

import './FilterDataset.scss'

type FilterDatasetProps = {
  modalOpen: boolean;
  setModalOpen: Function;
}

const FilterDataset: React.FC<FilterDatasetProps> = ({ modalOpen, setModalOpen }) => {
  return (
    <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
      <Dialog
        heading='Filter Dataset'
        isOpen={modalOpen}
        onExit={() => setModalOpen(false)}
        className="dkan-full-screen-dataset-dialog"
      >
        Filter controls go here
      </Dialog>
    </div>
  )
}
export default FilterDataset;