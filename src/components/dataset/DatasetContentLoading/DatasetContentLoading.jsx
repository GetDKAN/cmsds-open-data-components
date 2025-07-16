import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import './DatasetContentLoading.scss'

const DatasetContentLoadingTable = ({
  className,
  columns,
  rows,
  pagination
}) => (
  <div className={cx('DatasetContentLoadingTable', className)}>
    <div className='DatasetContentLoadingTable__title skeleton-box' />
    {Array(rows)
      .fill(0)
      .map((v, i) => (
        <div className='DatasetContentLoadingTable__row' key={i}>
          {Array(columns)
            .fill(0)
            .map((v, i) => (
              <div className='DatasetContentLoadingTable__row_column' key={i}>
                <div className='skeleton-box' />
              </div>
            ))}
        </div>
      ))}
    {pagination && (
      <div className='DatasetContentLoadingTable__pagination'>
        <div className='DatasetContentLoadingTable__pagination_btn skeleton-box' />
        <div className='DatasetContentLoadingTable__pagination_txt skeleton-box' />
        <div className='DatasetContentLoadingTable__pagination_btn skeleton-box' />
      </div>
    )}
  </div>
)

DatasetContentLoadingTable.propTypes = {
  className: PropTypes.any,
  columns: PropTypes.any,
  rows: PropTypes.any,
  pagination: PropTypes.any
}
DatasetContentLoadingTable.displayName = 'DatasetContentLoadingTable'

export const DatasetHeaderLoading = () => (
  <div className='DatasetContentLoading'>
    <DatasetContentLoadingTable
      className='DatasetContentLoading__dataset-explorer'
      columns={4}
      rows={8}
      pagination
    />
  </div>
)
export const DatasetContentLoading = () => (
  <div className='DatasetContentLoading'>
    <DatasetContentLoadingTable
      className='DatasetContentLoading__additional-info'
      columns={2}
      rows={5}
    />
  </div>
)
const DatasetLoading = () => (
  <div className='DatasetContentLoading'>
    <DatasetContentLoadingTable
      className='DatasetContentLoading__dataset-explorer'
      columns={4}
      rows={8}
      pagination
    />
    <DatasetContentLoadingTable
      className='DatasetContentLoading__additional-info'
      columns={2}
      rows={5}
    />
  </div>
)
DatasetLoading.displayName = 'DatasetLoading'
export default DatasetLoading
