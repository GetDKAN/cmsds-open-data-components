import ApiRowLimitNotice from '../../components/ApiRowLimitNotice';

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
      {isDatasetDocs ? (
        <div className="ds-l-col--12 ds-l-md-col--3 ds-u-font-weight--bold ds-u-margin-top--2 ds-u-md-text-align--right">
        <a
          href={docsURL}
          className="ds-u-display--flex ds-u-align-items--center ds-u-margin-bottom--1 ds-u-color--primary"
          style={{ whiteSpace: 'nowrap' }}
        >
          View API documentation
          {/* Arrow right */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 11 16"
            width="11"
            height="16"
            aria-hidden="true"
            role="presentation"
            className="ds-u-margin-left--1"
          >
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.70403 7.07623L3.01151 0.388634C2.76291 0.130188 2.4577 0.000349045 2.08664 0.000349045C1.91391 -0.00377464 1.74226 0.0286551 1.58296 0.0956049C1.42367 0.162493 1.28034 0.262364 1.16239 0.388634L0.381515 1.15905C0.129223 1.41134 0 1.72025 0 2.0833C0 2.4402 0.126146 2.7528 0.381515 3.01863L5.37014 8.00048L0.381515 12.9891C0.129223 13.2414 0 13.5509 0 13.914C0 14.2696 0.126146 14.5829 0.381515 14.8493L1.16178 15.6185C1.41407 15.8708 1.72297 16 2.08603 16C2.44908 16 2.7586 15.8739 3.0109 15.6185L9.70403 8.93581C9.95571 8.66936 10.0855 8.35677 10.0855 8.00048C10.0855 7.63743 9.9594 7.32791 9.70403 7.07623Z" />
          </svg>
        </a>
      </div>
      ) : '' }
      <div className="ds-l-col--12 ds-u-margin-y--1">
        <a href={url} className="ds-u-color--primary">OpenAPI Specification (JSON)</a>
      </div>
    </div>
  )
}

export default ApiDocsInfo;
