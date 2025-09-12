import React from 'react';
import DatasetTable from '.';
import DataTableActionsProvider from './DataTableActionsContext';

const DataTableStateWrapper = ({
  showCopyLinkButton = true,
  showDataTableToolbar = true,
  showDownloadFilteredDataButton = true,
  showDownloadFullDataButton = true,
  showStoredQueryDownloadButton = false,
}: {
  showCopyLinkButton?: boolean;
  showDataTableToolbar?: boolean;
  showDownloadFilteredDataButton?: boolean;
  showDownloadFullDataButton?: boolean;
  showStoredQueryDownloadButton?: boolean;
}) => {
  return (
    <DataTableActionsProvider>
      <DatasetTable
        showCopyLinkButton={showCopyLinkButton}
        showDataTableToolbar={showDataTableToolbar}
        showDownloadFilteredDataButton={showDownloadFilteredDataButton}
        showDownloadFullDataButton={showDownloadFullDataButton}
        showStoredQueryDownloadButton={showStoredQueryDownloadButton}
      />
    </DataTableActionsProvider>
  );
};

export default DataTableStateWrapper;
