import React, { PropsWithChildren } from 'react';
import { Alert } from '@cmsgov/design-system';
import DocumentationTable from './DocumentationTable.jsx';
import { documentation } from './documentationData.js';

type DocumentationType = {
  id: string,
  application: string,
  notes: string,
  link: string,
  linkText: string,
  screenReaderOnlyText: string
};

type SpecsAndLimitsProps = {
  documentationList: Array<DocumentationType>
}

const SpecsAndLimits = (props: PropsWithChildren<SpecsAndLimitsProps>) => {
  const {documentationList, children } = props;
  
  const defaultContent = (
    <p>
      Some datasets are extremely large and may be difficult to download and/or cause
      computer performance issues. The Centers for Medicare and Medicaid Services (CMS)
      recommends using WinZip, WinRAR, or 7-Zip for file decompression.
    </p>
  );

  return (
    <section className="ds-u-padding-top--3 ds-l-container">
      <div className="ds-l-md-col--12">
        <h1 className="ds-text-heading--5xl ds-u-margin-bottom--4">Software Specs and Limits</h1>
        <div className="dc-page-content about ds-u-measure--wide ds-u-margin-top--6">
          { children ? children : defaultContent }
          <p>This documentation will assist users in importing the data.</p>
          <Alert heading="Notice" className={'ds-u-margin-top--6'}>
            <p className="ds-c-alert__text">
              Be aware of the file size and row limitations of the software you are attempting to
              import the files into. For information on limitations, look at the software's
              official documentation.
            </p>
          </Alert>
        </div>
        <section className={'ds-u-margin-top--4 ds-l-row'}>
          <div className={'ds-l-col--12'}>
            <h2 className="ds-text-heading--2xl ds-text-heading--2xl">Documentation by Application</h2>
            <div className={'ds-u-margin-top--4'}>
              <DocumentationTable data={documentationList} />
            </div>
          </div>
        </section>
      </div>
    </section>
)};

SpecsAndLimits.defaultProps = {
  documentationList: documentation,
  content: (
    <p>
      Some datasets are extremely large and may be difficult to download and/or cause
      computer performance issues. The Centers for Medicare and Medicaid Services (CMS)
      recommends using WinZip, WinRAR, or 7-Zip for file decompression.
    </p>
  )
};

export default SpecsAndLimits;
