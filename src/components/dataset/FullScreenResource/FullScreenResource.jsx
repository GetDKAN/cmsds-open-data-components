import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@cmsgov/design-system';
import ToggleBlock from '../../common/ToggleBlock/ToggleBlock';
import DataTableToolbar from '../DataTableToolbar/DataTableToolbar';
import DataTable from '../DataTable/DataTable';
import DatasetHeader from '../DatasetHeader/DatasetHeader';
import DataHeaderButton from '../DataTableToolbar/DataHeaderButton';
import Tooltip from '../../common/Tooltip/Tooltip';
import './FullScreenResource.scss';

const FullScreenResource = (props) => {
  const {
    datasetTitle,
    datasetModified,
    datasetReleased,
    datasetRefresh,
    datasetDescription,
    showTooltip,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <div className="table-control-item fullscreen-button-container">
      <Tooltip tooltip="Fullscreen" position="top" trigger="hover" show={showTooltip}>
        <DataHeaderButton
          icon="expand"
          click={toggleModal}
          text="Fullscreen"
          ariaLabel="Fullscreen - Opens in a dialog"
        />
      </Tooltip>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
          isOpen={modalOpen}
          heading={<span className="dataset-explorer-title">Dataset Explorer</span>}
          onExit={toggleModal}
          ariaCloseLabel="Close dataset explorer dialog"
          size="full"
          className="fullscreen-resource"
        >
          <div className="fullscreen-content">
            <ToggleBlock title={datasetTitle}>
              <DatasetHeader
                description={datasetDescription}
                modified={datasetModified}
                released={datasetReleased}
                refresh={datasetRefresh}
              />
            </ToggleBlock>
            <DataTableToolbar
              fullscreen
              datasetTitle={datasetTitle}
              datasetDescription={datasetDescription}
              datasetModified={datasetModified}
              datasetReleased={datasetReleased}
              datasetRefresh={datasetReleased}
              instanceId={2}
            />
            <DataTable datasetTitle={datasetTitle} />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

FullScreenResource.propTypes = {
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * Dataset description
   */
  datasetDescription: PropTypes.string,
  /**
   * Dataset modified date string
   */
  datasetModified: PropTypes.string,
  /**
   * Dataset released date string
   */
  datasetReleased: PropTypes.string,
  /**
   * Dataset anticipated refresh date string
   */
  datasetRefresh: PropTypes.string,
  /**
   * `true` shows mobile helper tooltips for button
   */
  showTooltip: PropTypes.bool,
};

FullScreenResource.displayName = 'FullScreenResource';
export default FullScreenResource;
