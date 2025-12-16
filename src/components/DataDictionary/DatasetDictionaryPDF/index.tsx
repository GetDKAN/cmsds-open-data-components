const DatasetDictionaryPDF = ({datasetDictionaryEndpoint, rootUrl} : {datasetDictionaryEndpoint: string, rootUrl: string}) => {

  return (
    <>
      <a
          href={datasetDictionaryEndpoint}
          target='_blank'
          rel='noopener noreferrer'
          className="ds-c-button"
        >
          <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i> Download Dictionary PDF
        </a>
      {(!rootUrl.includes('cms.gov') && datasetDictionaryEndpoint) ? (
        // We can not iframe the data dictionary file on a domain other than https://*.cms.gov
        // because there is a Content Security Policy directive set
        <p>The data dictionary file can not be displayed at this time.</p>
      ) : (
        <div className='data-dictionary-iframe-container'>
          <iframe src={datasetDictionaryEndpoint} className='data-dictionary-iframe'></iframe>
        </div>
      )}
    </>
  )
}

export default DatasetDictionaryPDF