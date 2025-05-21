import React from 'react'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'
import PropTypes from 'prop-types'

const DeleteButton = ({ deleteFilter, enabled, i }) => {
  const deleteClass = enabled ? 'delete-button' : 'delete-button disabled'

  return (
    <button aria-label='delete filter' className={deleteClass} disabled={!enabled} onClick={() => deleteFilter(i)}>
      <FontAwesomePro icon='trash' size={20} />
    </button>
  )
}

DeleteButton.propTypes = {
  /**
   * Callback function to delete filter.
   * Passes `i` prop value as an argument
   */
  deleteFilter: PropTypes.func,
  /**
   * `true` enables the button.
   * `false` disables the button
   */
  enabled: PropTypes.bool,
  /**
   * Index value used for identifying the
   * correct filter to delete. Passed through
   * deleteFilter callback as an argument
   */
  i: PropTypes.number
}

DeleteButton.displayName = 'DeleteButton'
export default DeleteButton
