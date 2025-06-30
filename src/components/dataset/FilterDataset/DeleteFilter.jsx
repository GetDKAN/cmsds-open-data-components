import React from 'react'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'
// import { Button } from '@cmsgov/design-system';
import PropTypes from 'prop-types'

const DeleteButton = ({ deleteFilter, enabled, i }) => {
  const deleteClass = enabled ? 'delete-button' : 'delete-button disabled'

  return (
    <button aria-label='delete filter' className={deleteClass} disabled={!enabled} onClick={() => deleteFilter(i)}>
      <FontAwesomePro icon='trash' size={50} />
    </button>
  )
}


// const DeleteButton = ({ deleteFilter, enabled, i }) => {
//   return (
//     <Button
//       aria-label="Delete filter"
//       variation="ghost"
//       size="small"
//       type="button"
//       className="ds-u-margin-top--6 ds-u-padding-right--0"
//       onClick={() => deleteFilter(i)}
//       disabled={!enabled}
//     >
//       Delete filter
//       <span className="fas fa-trash" aria-hidden="true" />
//     </Button>
//   )
// }


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
