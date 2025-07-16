import React from 'react'
import PropTypes from 'prop-types'
import Text from '../../common/Text/Text'
import DatasetDate from '../../common/DatasetDate/DatasetDate'
import DatasetHeaderLoading from '../DatasetHeaderLoading/DatasetHeaderLoading'

import './DatasetHeader.scss'
const DatasetHeader = ({ title, description, modified, released, refresh, isLoading }) => {
  const date = { modified, released, refresh }
  if (isLoading) {
    return <DatasetHeaderLoading />
  }
  return (
    <header className='dataset-header'>
      {title && <h1 className='dataset-title'>{title}</h1>}
      <div className='dataset-description'>
        <Text value={description} />
      </div>
      <DatasetDate date={date} updatedBoldLabel />
    </header>
  )
}

DatasetHeader.propTypes = {
  /**
   * Dataset title
   */
  title: PropTypes.string,
  /**
   * Dataset description
   */
  description: PropTypes.string,
  /**
   * Dataset modified date string
   */
  modified: PropTypes.string,
  /**
   * Dataset released date string
   */
  released: PropTypes.string,
  /**
   * Dataset anticipated refresh date string
   */
  refresh: PropTypes.string,
  /**
   * `true` shows the DatasetHeaderLoading component
   */
  isLoading: PropTypes.bool
}
DatasetHeader.displayName = 'DatasetHeader'
export default DatasetHeader
