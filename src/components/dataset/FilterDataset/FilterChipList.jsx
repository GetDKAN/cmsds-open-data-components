import React from 'react'
import FilterChip from './FilterChip'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'
import PropTypes from 'prop-types'
import './FilterChip.scss'

const FilterChipList = ({
  filters,
  deleteFilter,
  resetFilters,
  hidden,
  resetHiddenColumns,
  reordered,
  resetColumnOrder
}) => {
  const showReset = filters.length > 0 || hidden || reordered
  const applyReset = () => {
    resetHiddenColumns()
    resetColumnOrder()
    resetFilters()
  }
  // lets avoid displaying filters if the only one there is our empty starter filter
  return (
    <div className='chip-list'>
      {filters && filters.map((filter, i) => (
        <FilterChip key={`${i}-${filter.div}`} filter={filter} deleteFilter={deleteFilter} i={i} />
      ))}
      {hidden && (
        <button className='chip-body' onClick={resetHiddenColumns}>
          <FontAwesomePro icon='columns' size={12} fill='#323A45' aria-hidden={true} />
          Columns hidden
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden={true} />
        </button>
      )}
      {reordered && (
        <button className='chip-body' onClick={resetColumnOrder}>
          <FontAwesomePro icon='columns' size={12} fill='#323A45' aria-hidden={true} />
          Columns reordered
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden={true} />
        </button>
      )}
      {showReset && (
        <button className='clear-all' onClick={applyReset}>Clear all filters</button>
      )}
    </div>
  )
}

FilterChipList.propTypes = {
  /**
   * Array of filters
   */
  filters: PropTypes.arrayOf(PropTypes.shape({
    column: PropTypes.string,
    condition: PropTypes.oneOf([
      '=',
      '<>',
      '>',
      '<',
      'LIKE',
      'starts with',
      'is_empty',
      'not_empty',
      '' // We need to allow an empty case because there are initially no filters so there is no condition set which throws a type error
    ]),
    value: PropTypes.string
  })),
  /**
   * `true` if some columns have been hidden
   * as a result of a filter
   */
  hidden: PropTypes.bool,
  /**
   * `true` if columns have been reordered
   */
  reordered: PropTypes.bool,
  /**
   * Callback function to delete filter
   */
  deleteFilter: PropTypes.func,
  /**
   * Callback function to reset the original column order
   */
  resetColumnOrder: PropTypes.func,
  /**
   * Callback function to reset hidden columns
   */
  resetHiddenColumns: PropTypes.func,
  /**
   * Callback function to remove all applied filters
   */
  resetFilters: PropTypes.func
}
FilterChipList.displayName = 'FilterChipList'
export default FilterChipList
