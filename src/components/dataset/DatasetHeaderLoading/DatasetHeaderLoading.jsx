import React from 'react'

import './DatasetHeaderLoading.scss'

const DatasetHeaderLoading = () => (
  <div className='DatasetHeaderLoading' data-testid='DatasetHeaderLoading'>
    <div className='DatasetHeaderLoading__title skeleton-box' />
    <div className='DatasetHeaderLoading__desc-container'>
      <div className='DatasetHeaderLoading__desc_item skeleton-box' />
      <div className='DatasetHeaderLoading__desc_item skeleton-box' />
    </div>
    <div className='DatasetHeaderLoading__date skeleton-box' />
  </div>
)
DatasetHeaderLoading.displayName = 'DatasetHeaderLoading'
export default DatasetHeaderLoading
