import React from 'react'
import PropTypes from 'prop-types'

const DataTablePageResults = ({
  total,
  pageSize,
  currentPage,
  className = 'data-table-results',
  viewing = false
}) => {
  // Add one to offset the 0 array index.
  const safeCurrentPage = Number.isFinite(currentPage) ? currentPage : 0
  const safePageSize = Number.isFinite(pageSize) ? pageSize : 0
  const page = safeCurrentPage + 1
  let displayTotal = total

  const currentLowestResult = total <= 0 ? 0 : 1 + ((safePageSize * page) - safePageSize)
  let currentHighestResult = (safePageSize * page)
  if (total < 0) {
    displayTotal = 0
  }
  if (currentHighestResult > total) {
    currentHighestResult = displayTotal
  }
  return (
    <div className={className}>
      <p>
        {viewing && (
          'Viewing '
        )}
        <span className="low-result">{currentLowestResult}</span>
        {' '}
        -
        {' '}
        <span className="high-result">{currentHighestResult}</span>
        {' '}
        of
        {' '}
        <span className="total">{displayTotal.toLocaleString()}</span>
        {' '}
        rows
      </p>
    </div>
  )
}

DataTablePageResults.propTypes = {
  className: PropTypes.string,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  viewing: PropTypes.bool
}

export default DataTablePageResults
