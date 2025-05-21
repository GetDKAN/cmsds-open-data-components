import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomePro from '../../common/FontAwesomePro/FontAwesomePro'

/*
  wrapping unicode selectors in span tags cause text decoration underline breaks
  The quick solution appears to return entire jsx terms instead of trying to template it.
*/

const FilterChip = ({ filter, deleteFilter, i }) => {
  const { condition, value, column } = filter

  switch (condition) {
    case '=':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} equals ${value} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#65309;&nbsp;
          {value}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case '<>':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} not equal to ${value} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#8800;&nbsp;
          {value}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case '>':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} greater than ${value} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#62;&nbsp;
          {value}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case '<':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} less than ${value} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#60;&nbsp;
          {value}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case 'LIKE':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} contains ${value.split('%').join('')} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#65315;&nbsp;
          {/* strip the sql */}
          {value.split('%').join('')}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case 'starts with':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} starts with ${value.split('%').join('')} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          ^&nbsp;
          {/* strip the sql */}
          {value.split('%').join('')}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case 'is_empty':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} is empty filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          Is&nbsp;empty&nbsp;
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    case 'not_empty':
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} not empty filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          Not&nbsp;empty&nbsp;
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
    default:
      return (
        <button className='chip-body' onClick={() => deleteFilter(i)} aria-label={`Remove ${column} contains ${value} filter`}>
          <FontAwesomePro icon='filter' size={12} fill='#6F757C' aria-hidden />
          "{column}"
          &#65315;&nbsp;
          {value}
          <FontAwesomePro icon='times' size={12} fill='#6F757C' aria-hidden />
        </button>
      )
  }
}

FilterChip.propTypes = {
  /**
   * Filter data
   */
  filter: PropTypes.shape({
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
  }),
  /**
   * Callback function to delete filter.
   * Passes `i` prop value as an argument
   */
  deleteFilter: PropTypes.func,
  /**
   * Index value used for identifying the
   * correct filter to delete. Passed through
   * deleteFilter callback as an argument
   */
  i: PropTypes.number
}

FilterChip.displayName = 'FilterChip'
export default FilterChip
