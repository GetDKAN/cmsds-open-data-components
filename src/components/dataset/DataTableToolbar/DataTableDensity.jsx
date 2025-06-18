import React from 'react'
import PropTypes from 'prop-types'
import DataIcon from './DataIcon'

const DataTableDensity = ({
  active,
  items = [
    { icon: <DataIcon name='density-1' height={20} width={20} icon='density-1' fill='#666666' />, text: 'expanded', value: 'density-1' },
    { icon: <DataIcon name='density-2' height={20} width={20} icon='density-2' fill='#666666' />, text: 'normal', value: 'density-2' },
    { icon: <DataIcon name='density-3' height={20} width={20} icon='density-3' fill='#666666' />, text: 'tight', value: 'density-3' }
  ],
  densityChange,
  className = 'data-table-density',
  screenReaderClass = 'sr-only sr-only-focusable',
  title = 'Display Density'
}) => (
  <div className={className}>
    <span className='density-buttons-title'>{title}</span>
    <div className='density-buttons'>
      {items.map((item) => {
        let srClass = screenReaderClass
        if (!item.icon) {
          srClass = ''
        }
        return (
          <button
            type='button'
            key={item.text}
            onMouseUp={() => densityChange(item.value)}
            onTouchEnd={() => densityChange(item.value)}
            onClick={() => densityChange(item.value)}
            title={item.text}
            className={active === item.text ? 'active' : ''}
            aria-label={`${title}, ${item.text}${active === item.text ? ' - selected' : ''}`}
          >
            {item.icon &&
              (
                <>
                  {item.icon}
                </>
              )}
            <span className={srClass}>{item.text}</span>
          </button>
        )
      })}
    </div>
  </div>
)

DataTableDensity.propTypes = {
  /**
   * Button active state class.
   * Text of active item. Ex. 'Normal'
   */
  active: PropTypes.string,
  /**
   * Button click callback function
   */
  densityChange: PropTypes.func.isRequired,
  /**
   * Custom class(es) used for accessibility purposes.
   * Applied to button text span
   */
  screenReaderClass: PropTypes.string,
  /**
   * Custom class(es) applied to wrapping element
   */
  className: PropTypes.string,
  /**
   * Array of button data
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node,
    text: PropTypes.string,
    value: PropTypes.string
  })),
  /**
   * Button group title text
   */
  title: PropTypes.string
}

DataTableDensity.displayName = 'DataTableDensity'
export default DataTableDensity
