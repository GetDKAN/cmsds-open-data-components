import React from 'react'
import cx from 'classnames'
import { usePopperTooltip } from 'react-popper-tooltip'
import PropTypes from 'prop-types'
import './Tooltip.scss'

const Tooltip = ({
  children,
  tooltip,
  hideArrow,
  type,
  customClass,
  tooltipClass,
  show,
  position = 'top'
}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible
  } = usePopperTooltip({
    placement: position
  })

  const Trigger = () => (
    <span
      ref={setTriggerRef}
      className={cx('tooltip-trigger', type, customClass)}
    >
      {children}
    </span>
  )

  return (
    show ? (
      <span className='tooltip-wrapper'>
        {visible && (
          <span
            ref={setTooltipRef}
            {...getTooltipProps({
              className: cx('tooltip-container', type, tooltipClass, { invisible: !show })
            })}
          >
            {!hideArrow && (
              <span
                {...getArrowProps({
                  className: 'tooltip-arrow'
                })}
              />
            )}
            {tooltip}
          </span>
        )}
        {Trigger()}
      </span>
    ) : (
      Trigger()
    )
  )
}

Tooltip.defaultProps = {
  delayShow: 500,
  delayHide: 100,
  hideArrow: true
}

Tooltip.propTypes = {
  /**
   * Tooltip trigger content
   */
  children: PropTypes.any,
  /**
   * Tooltip element content
   */
  tooltip: PropTypes.any,
  /**
   * `true` shows the triangle-arrow on the tooltip container.
   * The arrow is permanently hidden in component SCSS
   */
  hideArrow: PropTypes.bool,
  /**
   * Custom class(es) added to tooltip and trigger wrapping elements
   */
  type: PropTypes.string,
  /**
   * Custom class(es) added to the tooltip trigger wrapping element
   */
  customClass: PropTypes.string,
  /**
   * Custom class(es) added to the tooltip wrapping element
   */
  tooltipClass: PropTypes.string,
  /**
   * `true` allows the tooltip to be shown when invoked
   */
  show: PropTypes.bool,
  /**
   * Position of the tooltip
   */
  position: PropTypes.string
}

Tooltip.displayName = 'Tooltip'
export default Tooltip
