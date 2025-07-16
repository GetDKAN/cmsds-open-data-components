import React from 'react'
import PropTypes from 'prop-types'
import DatasetDateItem from './DatasetDateItem/DatasetDateItem'

import './DatasetDate.scss'

const DatasetDate = (props) => {
  const {
    date,
    updatedBoldLabel = false,
    releasedBoldLabel = false,
    refreshBoldLabel = false,
    displayTooltips = true
  } = props

  const { modified, released, refresh } = date

  let count = 0
  released && count++
  modified && count++
  refresh && count++

  return (
    <div className='dataset-date'>
      {modified && <DatasetDateItem displayTooltips={displayTooltips} type='modified' date={modified} boldLabel={updatedBoldLabel} />}
      {count > 1 && <span className='bullet-point'>&bull;</span>}
      {released && <DatasetDateItem displayTooltips={displayTooltips} type='released' date={released} boldLabel={releasedBoldLabel} />}
      {count > 2 && <span className='bullet-point'>&bull;</span>}
      {refresh && <DatasetDateItem displayTooltips={displayTooltips} type='refresh' date={refresh} boldLabel={refreshBoldLabel} />}
    </div>
  )
}

DatasetDate.propTypes = {
  /**
   * Released and modified date strings
   */
  date: PropTypes.shape({
    modified: PropTypes.string,
    released: PropTypes.string,
    refresh: PropTypes.string
  }),
  /**
   * Apply bold style to updated label
   */
  updatedBoldLabel: PropTypes.bool,
  /**
   * Apply bold style to released label
   */
  releasedBoldLabel: PropTypes.bool,
  /**
   * Apply bold style to refresh label
   */
  refreshBoldLabel: PropTypes.bool,
  /**
   * Display tooltips or not
   */
  displayTooltips: PropTypes.bool
}
DatasetDate.displayName = 'DatasetDate'
export default DatasetDate
