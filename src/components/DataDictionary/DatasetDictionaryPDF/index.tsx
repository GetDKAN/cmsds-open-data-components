import React from 'react';
import './datasetDictionaryPDF.scss';

const DatasetDictionaryPDF = ({datasetDictionaryEndpoint} : {datasetDictionaryEndpoint: string}) => {
  return (
    <>
      <div className="ds-u-margin-bottom--1 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end">
        <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-top--2 ds-u-sm-margin-top--0 ds-u-padding--0 ds-u-sm-padding-left--2">
          <a
            href={datasetDictionaryEndpoint}
            target='_blank'
            rel='noopener noreferrer'
            className="ds-c-button"
          >
            <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i> Download Dictionary PDF
          </a>
        </div>
      </div>
      {(!window.location.host.includes('cms.gov') && datasetDictionaryEndpoint) ? (
        // We can not iframe the data dictionary file on a domain other than https://*.cms.gov
        // because there is a Content Security Policy directive set
        <p>The data dictionary file can not be displayed at this time.</p>
      ) : (
        <div className='data-dictionary-iframe-container ds-u-margin-top--3'>
          <iframe src={datasetDictionaryEndpoint} className='data-dictionary-iframe'></iframe>
        </div>
      )}
    </>
  )
}

export default DatasetDictionaryPDF