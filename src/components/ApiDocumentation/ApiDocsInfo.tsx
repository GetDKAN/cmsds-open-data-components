import ApiRowLimitNotice from '../ApiRowLimitNotice';

 const ApiDocsInfo = ({ url, getComponent, isDatasetDocs, showRowLimitNotice, docsURL } : any) => {
  const VersionStamp = getComponent("VersionStamp");
  const OpenAPIVersion = getComponent("OpenAPIVersion");

  return (
    <div className="ds-l-row">
      <div className="ds-l-col--12 ds-l-md-col--9">
        <h2 className="ds-text-heading--2xl ds-u-sm-display--inline-block">Try the API{isDatasetDocs ? " for this dataset" : ''}</h2>
        <VersionStamp />
        <OpenAPIVersion />
        {isDatasetDocs ? (<p>
          The Open Data API provides programmatic access to this dataset including the
          ability to filter, query, and aggregate data.
        </p>) : ''}
        {showRowLimitNotice && <ApiRowLimitNotice />}
      </div>
      <div className="ds-l-col--12 ds-l-md-col--3 ds-u-font-weight--bold ds-u-margin-top--2 ds-u-md-text-align--right">
        <a href={docsURL} className="ds-u-margin-bottom--1">
          View API{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            documentation <i className="fa fa-arrow-right ds-u-font-weight--bold"></i>
          </span>
        </a>
      </div>
      <div className="ds-l-col--12 ds-u-margin-y--1"><a href={url}>OpenAPI Specification (JSON)</a></div>
    </div>
  )
}

export default ApiDocsInfo;