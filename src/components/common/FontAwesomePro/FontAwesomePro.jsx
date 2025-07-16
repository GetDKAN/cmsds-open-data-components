import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import svgIndex from '../../../assets/icons'

const FontAwesomePro = (props) => {
  const {
    'aria-hidden': ariaHidden,
    fill = '#323A45',
    height = 16,
    icon = 'long-arrow-right',
    size,
    width = 16
  } = props

  // Set fill on path
  const ref = useRef()
  useEffect(() => {
    if (fill && ref.current && ref.current.firstElementChild) {
      ref.current.firstElementChild.setAttribute('fill', fill)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icon])

  // Set default svg attribtues
  // const iconAttr = { /////////////////
  //   'aria-hidden': ariaHidden,
  //   className: `fa fa-${icon}`,
  //   focusable: 'false',
  //   height: size || height,
  //   role: 'img',
  //   width: size || width
  // }

  // Get svgIndex export array values
  const svgList = svgIndex.values() ////////

  // Loop through svgIndex export array
  // const iconMap = (ico) => { //////////////
  //   for (const svg of svgList) {
  //     const key = Object.keys(svg)[0]
  //     if (key === ico) {
  //       // Get value from svgIndex, which is a ReactComponent
  //       const Value = Object.values(svg)[0]
  //       return <Value {...iconAttr} ref={ref} aria-label={icon.split('-').join(' ')} />
  //     }
  //   }
  // }

  // return ( ///////
  //   iconMap(icon)
  // )
}

FontAwesomePro.propTypes = {
  /**
   * Hide icon from screen reader
   */
  'aria-hidden': PropTypes.bool,
  /**
   * Icon color code string (hex, rgb, string, etc)
   */
  fill: PropTypes.string,
  /**
   * SVG outer pixel height - Overwritten by 'size' prop if provided
   */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * FontAwesome icon name
   */
  icon: PropTypes.string,
  /**
   * SVG pixel size - Applies to height and width equally
   */
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * SVG outer pixel width - Overwritten by 'size' prop if provided
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
FontAwesomePro.displayName = 'FontAwesomePro'
export default FontAwesomePro
