import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'

const DataHeaderButton = ({ click, text, icon, fill = '#0c2499', secondary = undefined, active = false, ariaLabel }) => {
  const buttonClass = active ? 'dataset-button active' : 'dataset-button'
  return (
    <button aria-label={ariaLabel} onClick={click} className={buttonClass}>
      {/* <span className="fas fa-filter small-text ds-u-sm-display--none" /> */}
      <FontAwesomePro icon={icon} fill={fill} />
      <span className='dataset-button-text'>{text}</span>
      {secondary && (<FontAwesomePro icon={secondary} fill={fill} size={16} />)}
    </button>)
}

DataHeaderButton.propTypes = {
  /**
   * Accessible button label
   */
  ariaLabel: PropTypes.string,
  /**
   * `onClick` callback function
   */
  click: PropTypes.func,
  /**
   * Button text
   */
  text: PropTypes.string,
  /**
   * Button icon - prepended
   */
  icon: PropTypes.string,
  /**
   * Icon color
   */
  fill: PropTypes.string,
  /**
   * Button icon - appended
   */
  secondary: PropTypes.string,
  /**
   * Button active state class
   */
  active: PropTypes.bool
}

DataHeaderButton.displayName = 'DataHeaderButton'
export default DataHeaderButton
