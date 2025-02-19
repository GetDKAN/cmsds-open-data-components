import React from 'react';
import { useState } from 'react';
import { Dialog, Button } from '@cmsgov/design-system';
import SearchItemIcon from '../../assets/icons/searchItem';

type LargeFileDialogProps = {
  downloadUrl: string;
};

const LargeFileDialog = (props: LargeFileDialogProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { downloadUrl } = props;
  return (
    <>
      <Button variation="solid" size="small" onClick={() => setModalOpen(true)}>
        <SearchItemIcon id="download" />
        Download
      </Button>
      {modalOpen && (
        <Dialog
          onExit={() => setModalOpen(false)}
          heading="Notice: Large File Size"
          actions={
            <>
              <Button href={downloadUrl} className="ds-u-margin-right--2 " variation="solid">
                Yes, download
              </Button>
              <Button variation="ghost" onClick={() => setModalOpen(false)}>
                No, cancel
              </Button>
            </>
          }
        >
          <p>
            This is a very large file and, depending on your network characteristics and software,
            may take a long time to download or fail to download. Additionally, the number of rows
            in the file may larger than the maximum rows your version of Microsoft Excel supports.
            If you can't download the file, we recommend engaging your IT support staff. If you are
            able to download the file but are unable to open it in MS Excel or get a message that
            the data has been truncated, we recommend trying alternative programs such as MS Access,
            Universal Viewer, Editpad or any other software your organization has available for
            large datasets.
          </p>
          <p>Would you like to proceed?</p>
        </Dialog>
      )}
    </>
  );
};

export default LargeFileDialog;