import { Dialog } from "@cmsgov/design-system";
import './FullScreenDataTable.scss';
import DatasetTable from "../DatasetTableTab";

const FullScreenDataTable = ({modalOpen, setModalOpen, isModal} : {modalOpen: boolean, setModalOpen: Function, isModal: boolean}) => {

  return (
    <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
      <Dialog
        heading='Dataset Explorer'
        isOpen={modalOpen}
        onExit={() => setModalOpen(false)}
        className="dkan-full-screen-dataset-dialog"
      >
        {!isModal && (
          <DatasetTable isModal={true} closeFullScreenModal={() => setModalOpen(false)} />
        )}
      </Dialog>
    </div>
  )
}
export default FullScreenDataTable;