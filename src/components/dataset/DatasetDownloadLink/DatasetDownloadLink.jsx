import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@cmsgov/design-system'
import { HashLink } from 'react-router-hash-link'

import './DatasetDownloadLink.scss'

const DatasetDownloadLink = ({
  linkText,
  linkAriaLabel = '',
  linkHref,
  className,
  downloadAttr = false,
  onClick = () => {}
}) => {
  const [modalOpen, toggleModal] = useState(false)

  const additionalLinkAttrs = {
    className: 'dataset-download-link'
  }
  if (linkAriaLabel) {
    additionalLinkAttrs['aria-label'] = linkAriaLabel
  }
  if (className) {
    additionalLinkAttrs.className = `${additionalLinkAttrs.className} ${className}`
  }
  if (downloadAttr) {
    additionalLinkAttrs.download = true
  }
  const additionalBtnAttrs = {}
  if (linkHref) {
    additionalBtnAttrs['data-download-url'] = linkHref
  }

  return (
    <>
      <a
        href=''
        tabIndex={0}
        target='_blank'
        rel='noopener noreferrer'
        role='button'
        onClick={(e) => {
          e.preventDefault()

          toggleModal(!modalOpen)
        }}
        {...additionalLinkAttrs}
      >
        {linkText}
      </a>
      <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
        <Dialog
          isOpen={modalOpen}
          heading='Notice: Downloading in Excel'
          className='csv-download-link-dialog'
          ariaCloseLabel='Close notice dialog'
          onExit={() => {
            toggleModal(!modalOpen)
          }}
          actions={(
            <div className='csv-download-link-dialog-actions'>
              <button
                className='btn blueberry'
                key='primary'
                onClick={() => {
                  if (linkHref) {
                    window.location.href = linkHref
                  } else {
                    onClick()
                  }

                  toggleModal(!modalOpen)
                }}
                {...additionalBtnAttrs}
              >
                Yes, download
              </button>
              <button
                className='btn'
                onClick={() => {
                  toggleModal(!modalOpen)
                }}
              >
                No, cancel
              </button>
            </div>
          )}
        >
          <p>Before downloading these files in Excel, please review the <strong>Excel Download Instructions</strong> to ensure accuracy with the display of your data when downloading, opening and saving these files.</p>
          <ul className="csv-faq-link">
            <li>
              <HashLink
                smooth
                to='/about#download-files-in-excel'
                onClick={() => {
                  document.querySelector('body').classList.remove('ds--dialog-open')
                }}
              >
                Excel Download Instructions
              </HashLink>
            </li>
          </ul>
          <p>Would you like to proceed?</p>
        </Dialog>
      </div>
    </>
  )
}

DatasetDownloadLink.propTypes = {
  linkText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  linkAriaLabel: PropTypes.string,
  /**
   * Leave as empty string or simply do not pass linkHref prop if using onClick
   */
  linkHref: PropTypes.string,
  className: PropTypes.string,
  downloadAttr: PropTypes.bool,
  /**
   * Only fires if linkHref is falsy
   */
  onClick: PropTypes.func
}

DatasetDownloadLink.displayName = 'DatasetDownloadLink'

export default DatasetDownloadLink
