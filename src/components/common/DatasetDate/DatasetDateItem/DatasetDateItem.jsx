import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Tooltip, TooltipIcon } from '@cmsgov/design-system'

const DatasetDateItem = (props) => {
  const { type, date, boldLabel = false, displayTooltips = true } = props

  const dateText = {
    modified: 'Last Modified',
    released: 'Released',
    refresh: 'Planned Update'
  }
  const tooltipValue = {
    modified: '<strong>Last Modified: </strong> The date the<br/>dataset was last updated.',
    released: '<strong>Released: </strong> The date the most<br/>recent dataset was made available<br/>to the public.',
    refresh: '<strong>Planned Update:</strong> The date the<br/>dataset is scheduled to be updated.'
  }
  return (
    <div className={`dataset-date-item${boldLabel ? ' bold-label' : ''}`}>
      <span className='dataset-data-item-label'><span>{dateText[type]}</span>: {moment(date).format('MMMM D, YYYY')}</span>
        {displayTooltips === true &&
        <Tooltip
          aria-label={dateText[type]}
          className="ds-c-tooltip__trigger-icon ds-u-display--inline ds-u-padding-left--0 ds-uw-padding-right--0"
          title={<span dangerouslySetInnerHTML={{ __html: tooltipValue[type] }} />}
          placement="top"
        >
          <TooltipIcon />
        </Tooltip>
        }
    </div>
  )
}

DatasetDateItem.propTypes = {
  /**
   * Date label
   */
  type: PropTypes.oneOf(['modified', 'released', 'refresh']),
  /**
   * Date string
   */
  date: PropTypes.string,
  /**
   * Apply bold style to label
   */
  boldLabel: PropTypes.bool,
  /**
   * Display tooltips or not
   */
  displayTooltips: PropTypes.bool
}
DatasetDateItem.displayName = 'DatasetDateItem'
export default DatasetDateItem
