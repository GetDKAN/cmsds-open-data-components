type OperationSummaryProps = {
  toggleShown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  operationProps: any;
  tryItOutButtonClassNames?: string;
  copyToClipboardButtonClassNames?: string;
}

const OperationSummary: React.FC<OperationSummaryProps> = ({ toggleShown, operationProps, tryItOutButtonClassNames = '', copyToClipboardButtonClassNames = '' }) => {
  const { path, isShown, operationId, tag, method, summary } = operationProps.toJS()
  const readablePath = path.replace(/\//g, '\u200b/')

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(readablePath)
  }

  const handleTryItOutOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleShown(e)
  }

  return (
    <div className='OperationSummary ds-u-display--flex ds-u-flex-direction--column ds-u-lg-flex-direction--row'>
      <div className='OperationSummary__path-container ds-u-display--flex ds-u-align-items--center ds-u-flex-direction--column ds-u-md-flex-direction--row ds-u-fill--white ds-u-radius'>
        <span className='OperationSummary__method ds-u-display--flex ds-u-align-items--center ds-u-justify-content--center ds-u-color--white ds-u-radius ds-u-text-transform--uppercase ds-u-font-weight--bold ds-u-font-size--md ds-u-padding--1 ds-u-margin--05'>
          {method}
        </span>
        <input
          aria-label={`${tag} ${operationId}`}
          className='OperationSummary__path-container_path-input ds-u-border--0 ds-u-padding-y--1 ds-u-padding-x--2 ds-u-font-size--sm ds-u-md-margin-y--0 ds-u-margin-y--1'
          readOnly
          value={readablePath}
        />
        <span className='OperationSummary__summary ds-u-font-size--sm ds-u-padding-x--1 ds-u-text-align--left ds-u-md-text-align--right ds-u-md-margin-bottom--0 ds-u-margin-bottom--1'>{summary}</span>
        <button
          onClick={handleCopyToClipboard}
          className={copyToClipboardButtonClassNames ? `${copyToClipboardButtonClassNames}` : 'ds-u-display--flex ds-u-align-items--center ds-u-justify-content--center ds-u-padding--0 ds-u-margin--05 ds-u-radius OperationSummary__path-container_copy-btn ds-u-color--primary'}
          aria-label={`Copy ${tag} ${operationId} to clipboard`}
        >
          {/* Copy */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="16"
            height="16"
            aria-hidden="true"
            role="presentation"
            className="OperationSummary__copy-icon"
          >
            <path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
          </svg>
        </button>
      </div>
      <button
        className={tryItOutButtonClassNames ? `${tryItOutButtonClassNames}` : 'ds-c-button ds-u-lg-margin-left--2 ds-u-margin-top--2 ds-u-lg-margin-top--0 OperationSummary__try-it-out-btn'}
        onClick={handleTryItOutOnClick}
        aria-label={`Try it out - ${tag} ${operationId}`}
        aria-expanded={isShown}
      >
        {isShown ? (
          /* Chevron down */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="20"
            height="20"
            aria-hidden="true"
            role="presentation"
            className="ds-u-margin-right--1 OperationSummary__chevron-down"
          >
            <path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
          </svg>
        ) : (
          /* Chevron up */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="20"
            height="20"
            aria-hidden="true"
            role="presentation"
            className="OperationSummary__chevron-up"
          >
            <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
          </svg>
        )}
        Try it out
      </button>
    </div>
  )
}

export default OperationSummary;
