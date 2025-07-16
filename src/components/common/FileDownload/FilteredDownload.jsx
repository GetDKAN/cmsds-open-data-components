import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomePro from '../FontAwesomePro/FontAwesomePro'
import DatasetDownloadLink from '../../dataset/DatasetDownloadLink/DatasetDownloadLink'

const FilteredDownload = ({ resource, datasetTitle, filteredURL, isDatasetExplorerDownloadLink = false }) => {
  let format = null

  if (
    Object.prototype.hasOwnProperty.call(resource, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data, 'format')
  ) {
    format = resource.data.format
    format.toUpperCase()
  }

  let title = null

  if (
    Object.prototype.hasOwnProperty.call(resource, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data, 'data') &&
    Object.prototype.hasOwnProperty.call(resource.data.data, 'title')
  ) {
    title = resource.data.data.title
  } else {
    title = 'This Dataset'
  }

  const item = (
    <>
      {filteredURL && title && format && (
        <DatasetDownloadLink
          linkText={(
            <>
              {isDatasetExplorerDownloadLink ? (
                <FontAwesomePro icon='download' aria-hidden />
              ) : (
                <FontAwesomePro icon='filter' aria-hidden />
              )}
              {isDatasetExplorerDownloadLink ? (
                <span>Download filtered dataset ({format.toUpperCase()})</span>
              ) : (
                <span>Download filtered dataset <span className='sr-only'>- {format}</span></span>
              )}
            </>
          )}
          linkHref={filteredURL}
        />
      )}
      {!isDatasetExplorerDownloadLink && (
        <div className='format'>
          <span>
            {format}
          </span>
        </div>
      )}
    </>
  )

  return isDatasetExplorerDownloadLink ? item : <div className='resource'>{item}</div>
}

FilteredDownload.propTypes = {
  /**
   * Dataset data object
   */
  resource: PropTypes.shape({
    data: PropTypes.object,
    format: PropTypes.string,
    identifier: PropTypes.string
  }),
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * Filtered dataset download url
   */
  filteredURL: PropTypes.string,
  /**
   * Dataset explorer download link gets different styling
   */
  isDatasetExplorerDownloadLink: PropTypes.bool
}
FilteredDownload.displayName = 'FilteredDownload'
export default FilteredDownload
