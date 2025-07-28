import React from 'react';
import DatasetTable from '.';
import DataTableActionsProvider from './DataTableActionsContext';

const DataTableStateWrapper = ({
  showQueryBuilder = true,
  showCopyLinkButton = true,
  showDownloadFilteredDataButton = true,
  showDownloadFullDataButton = true,
  showStoredQueryDownloadButton = false,
}: {
  showQueryBuilder?: boolean;
  showCopyLinkButton?: boolean;
  showDownloadFilteredDataButton?: boolean;
  showDownloadFullDataButton?: boolean;
  showStoredQueryDownloadButton?: boolean;
}) => {
  return (
    <DataTableActionsProvider>
      <DatasetTable
        showQueryBuilder={showQueryBuilder}
        showCopyLinkButton={showCopyLinkButton}
        showDownloadFilteredDataButton={showDownloadFilteredDataButton}
        showDownloadFullDataButton={showDownloadFullDataButton}
        showStoredQueryDownloadButton={showStoredQueryDownloadButton}
      />
    </DataTableActionsProvider>
  );
};

export default DataTableStateWrapper;
