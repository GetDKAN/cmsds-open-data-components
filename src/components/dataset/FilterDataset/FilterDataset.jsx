import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@cmsgov/design-system'
import AddFilter from './AddFilter'
import FilterItem from './FilterItem'
import './FilterDataset.scss'
import { FilteredDispatch } from '../DatasetResource/FilteredDatasetContext'

const FilterDataset = ({
  lFilters,
  applyFilter,
  addFilter,
  updateFilters,
  deleteFilter,
  resetFilters,
  open,
  onExit
}) => {
  const { initOrder } = useContext(FilteredDispatch)

  const applyAndClose = () => {
    applyFilter(lFilters)
    onExit()
  }

  // we want to disable the button if any of the filters have an empty value
  const isEmpty = (filter) => {
    for (const key in filter) {
      // These filters don't need a value.
      if (filter.condition === 'is_empty' || filter.condition === 'not_empty') {
        continue
      }
      if (!filter[key]) {
        return true
      }
    }
    return false
  }
  // How to know when to disable apply button
  const areAnyEmpty = ((allFilters) => {
    if (!allFilters) {
      return true
    }
    // no filters? no accept button
    if (allFilters.length === 0) {
      return true
    }
    for (let i = 0; i < allFilters.length; i++) {
      if (isEmpty(allFilters[i])) {
        return true
      }
    }
    return false
  })(lFilters)

  let applyButtonStyle = 'btn blueberry'
  areAnyEmpty ? applyButtonStyle = 'btn blueberry disabled' : applyButtonStyle = 'btn blueberry'
  const filterMessage = lFilters ? lFilters.length === 1 ? `Apply ${lFilters.length} Filter` : `Apply ${lFilters.length} Filters` : 'Apply 0 Filters'

  return (
    <div className='filter-dialog'>
      <div className={`ds-c-dialog-wrap${open ? ' open' : ''}`}>
        <Dialog
          isOpen={open}
          heading='Filter dataset'
          className='filter-dialog'
          onExit={onExit}
          ariaCloseLabel='Close filter dataset dialog'
          actions={(
            <div className='filter-dialog-actions'>
              <button
                className='btn'
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                disabled={areAnyEmpty}
                className={applyButtonStyle}
                key='primary'
                onClick={applyAndClose}
              >
                {filterMessage}
              </button>
            </div>
          )}
        >
          {/* content goes here */}
          <div>
            {/* main start */}
            <div className='info'>
              <span>
                Add filters to only display data that meets your criteria. Filtered results can be downloaded.
              </span>
            </div>
            <div className='filter-header'>
              <div className='header-item'>
                <h3>Column name</h3>
              </div>
              <div className='header-item'>
                <h3>Condition</h3>
              </div>
              <div className='header-item'>
                <h3>Value</h3>
              </div>
              <div style={{ minWidth: 36, height: 36, border: 'solid 1px transparent', borderRadius: '100%' }} />
            </div>
            <div className='filter-container'>
              {/* filters go here. */}
              {(lFilters && lFilters.length > 0) && (
                lFilters.map((filter, i) =>
                  (
                    <FilterItem
                      key={`filter-${i}`}
                      i={i}
                      columns={initOrder}
                      filter={filter}
                      filters={lFilters}
                      updateFilters={updateFilters}
                      deleteFilter={deleteFilter}
                    />
                  )
                )
              )}
            </div>
            <AddFilter addFilter={addFilter} />
          </div>
        </Dialog>
      </div>
    </div>
  )
}

FilterDataset.propTypes = {
  /**
   * Array of filters
   */
  lFilters: PropTypes.arrayOf(PropTypes.shape({
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
   * Callback function to add a filter
   */
  addFilter: PropTypes.func,
  /**
   * Callback function to update filters
   */
  updateFilters: PropTypes.func,
  /**
   * Callback function to delete a filter
   */
  deleteFilter: PropTypes.func,
  /**
   * Callback function to reset all filters
   */
  resetFilters: PropTypes.func,
  /**
   * Callback function to apply filter(s)
   */
  applyFilter: PropTypes.func,
  /**
   * Callback funtion for dialog window close event
   */
  onExit: PropTypes.func,
  /**
   * `true` shows the component dialog window
   */
  open: PropTypes.bool
}
FilterDataset.displayName = 'FilterDataset'
export default FilterDataset
