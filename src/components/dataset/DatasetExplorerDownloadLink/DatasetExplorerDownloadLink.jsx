import React, { useContext, useState, useEffect } from 'react'
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext'
import FilteredDownload from '../../common/FileDownload/FilteredDownload'
import FileDownload from '../../common/FileDownload/FileDownload'
import { getApiBaseUrl } from '../../../utilities/getApiBaseUrl'
import { DatasetContext } from '../../../context/DatasetContext'
import qs from 'qs'
import PropTypes from 'prop-types'
import toLower from 'lodash/toLower'
import './DatasetExplorerDownloadLink.scss'

const DatasetExplorerDownloadLink = ({ force }) => {
  const {
    filteredResource,
    filteredTable,
    initOrder,
    curOrder,
    filtersApplied
  } = useContext(FilteredDispatch)

  const [filteredURL, setFilteredURL] = useState('')
  const datasetState = useContext(DatasetContext)
  const { data: dataset = {}, isLoading } = datasetState
  const title = dataset?.title || ''
  const identifier = datasetState?.data?.identifier || undefined
  const distribution = 'distribution' in dataset ? dataset.distribution : []
  let isPublic
  if (dataset.accessLevel) {
    isPublic = toLower(dataset.accessLevel) === 'public'
  }

  const fileDownloadResource = distribution[0]
  /* istanbul ignore else */
  if (fileDownloadResource !== undefined) {
    fileDownloadResource.format = 'csv'
  }

  // have columns been reordered from initial order?
  const checkOrder = (arr1, arr2) => {
    if (!arr1 || !arr2) {
      return false
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].id !== arr2[i]) {
        return true
      }
    }
    return false
  }

  const resourceData = { data: fileDownloadResource }
  const columnsHidden = filteredTable?.visibleColumns?.length !== initOrder?.length
  const columnsReOrdered = checkOrder(initOrder, curOrder)

  const isFiltered = (() => {
    if (columnsReOrdered) {
      return true
    }
    if (columnsHidden) {
      return true
    }
    if (filtersApplied.length > 0) {
      return true
    }
    return false
  })()

  useEffect(() => {
    if (!isFiltered) {
      setFilteredURL('')
    } else {
      const baseUrl = getApiBaseUrl()

      const getFilteredDownload = () => {
        const fConditions = filteredResource?.conditions?.length > 0 ? filteredResource?.conditions.map((c) => {
          return c
        }) : []
        const fProperties = filteredTable?.visibleColumns?.length > 0 ? filteredTable?.visibleColumns.map((c) => c.id) : []
        const orderMap = {}
        initOrder.forEach((columnInfo, index) => {
          orderMap[columnInfo.id] = index + 1
        })
        const transformedProperties = fProperties.map((property) => {
          return orderMap[property]
        })
        const reqObject = {
          conditions: fConditions,
          properties: transformedProperties
        }
        let joiner = ''
        if (fConditions.length > 0 && transformedProperties.length > 0) {
          joiner = '&'
        }
        const encodedProperties = transformedProperties.length > 0 ? `properties=${transformedProperties.join('-')}` : ''
        const url = `${baseUrl}/pdc/query/${identifier}/0/download?${qs.stringify({ conditions: reqObject.conditions }, { encode: true })}${joiner}${encodedProperties}&format=csv`
        setFilteredURL(url)
      }
      getFilteredDownload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered, filteredResource.conditions, filteredTable.visibleColumns])

  return (
    (isPublic && !isLoading && resourceData.data !== undefined) ? (
      <div className='dataset-explorer-download-link'>
        {((isFiltered && !force) || force === 'filtered') ? (
          <FilteredDownload
            datasetTitle={title}
            resource={resourceData}
            key={resourceData.title}
            filteredURL={filteredURL}
            isDatasetExplorerDownloadLink={true}
          />
        ) : (
          <FileDownload
            resource={resourceData}
            key={resourceData.title}
            isDatasetExplorerDownloadLink={true}
          />
        )}
      </div>
    ) : null
  )
}

DatasetExplorerDownloadLink.propTypes = {
  /**
   * Forces a particular download link to show
   * whether the dataset is filtered or not
   */
  force: PropTypes.oneOf(['full', 'filtered'])
}

DatasetExplorerDownloadLink.displayName = 'DatasetExplorerDownloadLink'
export default DatasetExplorerDownloadLink
