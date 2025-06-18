import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext'
import DataTableDensity from './DataTableDensity'
import find from 'lodash/find'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'

const PopOverContent = ({
  datasetTitle,
  updateRows,
  limit
}) => {
  const {
    activeDensity,
    setActiveDensity
  } = useContext(FilteredDispatch)
  const pageSizeOptions = [
    { defaultChecked: true, label: '20', value: '20' },
    { label: '50', value: '50' },
    { label: '100', value: '100' }
  ]
  const densityItems = [
    {
      icon: (
        <FontAwesomePro icon='density-1' aria-hidden />
      ),
      text: 'Expanded',
      value: 'density-1'
    },
    {
      icon: (
        <FontAwesomePro icon='density-2' aria-hidden />
      ),
      text: 'Normal',
      value: 'density-2'
    },
    {
      icon: (
        <FontAwesomePro icon='density-3' aria-hidden />
      ),
      text: 'Compact',
      value: 'density-3'
    }
  ]
  return (
    <div className='popover-container'>
      <DataTableDensity
        title='Row height'
        className='popover-row data-table-density'
        densityChange={(density) => {
          const densityText = find(densityItems, { value: density }).text
          setActiveDensity(densityText)
        }}
        items={densityItems.slice()}
        active={activeDensity}
      />
      <div className='popover-row rows-per-page'>
        <span className='rows-per-page-title' htmlFor='select_page_size_select_1'>
          Rows per page
        </span>
        <select
          aria-label='Rows per page'
          className='ds-c-field'
          id='select_page-size-select_1'
          name='page-size-select'
          value={limit.toString()}
          onChange={(event) => {
            updateRows(event.target.value)
          }}
        >
          {pageSizeOptions && pageSizeOptions.map((opt) => (
            <option
              value={opt.value}
              label={opt.label}
              defaultChecked={opt.defaultChecked}
              key={`select-${opt.label}`}
            />)
          )}
        </select>
      </div>
    </div>
  )
}

PopOverContent.propTypes = {
  /**
   * Dataset title
   */
  datasetTitle: PropTypes.string,
  /**
   * 'Rows per page' select callback function.
   * Returns the selected value as an argument
   */
  updateRows: PropTypes.func,
  /**
   * Default 'Rows per page' selected value
   */
  limit: PropTypes.oneOf([20, 50, 100])
}
PopOverContent.displayName = 'PopOverContent'
export default PopOverContent
