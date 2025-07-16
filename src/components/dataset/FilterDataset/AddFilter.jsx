import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'

const AddFilter = ({ addFilter }) => {
  return (
    <button className='add-filter' aria-label='Add filter' onClick={addFilter}>
      <FontAwesomePro icon='plus-circle' size={16} />
      <span>Add new filter</span>
    </button>
  )
}

AddFilter.propTypes = {
  /**
   * Callback function to set filter
   */
  addFilter: PropTypes.func
}

AddFilter.displayName = 'AddFilter'
export default AddFilter
