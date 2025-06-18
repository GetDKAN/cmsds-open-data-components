import React from 'react';
import DeleteFilter from './DeleteFilter';
import PropTypes from 'prop-types';

const FilterItem = ({ columns, deleteFilter, filters, filter, updateFilters, i }) => {
  const disabledCheck = (val) => {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].column === val) {
        return true;
      }
    }
    return false;
  };

  const stripText = (text) => {
    return text.split('%').join('');
  };
  return (
    <div className="filter-item">
      <select
        aria-label="Select column"
        className="ds-c-field"
        value={filter.column}
        onChange={(e) => updateFilters(i, 'column', e.target.value)}
      >
        <option value="" defaultValue disabled hidden>
          Select column
        </option>
        {columns.map((option, i) => (
          <option
            key={`${option.id}-${i}-col`}
            value={option.id}
            disabled={disabledCheck(option.id)}
          >
            {option.Header}
          </option>
        ))}
      </select>

      <select
        aria-label="Select condition"
        className="ds-c-field"
        value={filter.condition}
        onChange={(e) => updateFilters(i, 'condition', e.target.value)}
      >
        <option value="" defaultValue disabled hidden>
          Select condition
        </option>
        <option value="=">&#65309;&nbsp;Equals</option>
        <option value="<>">&#8800;&nbsp;&nbsp;Not Equal</option>
        {/* temporarily remove unsupported filters */}
        <option value="LIKE">&#65315;&nbsp;Contains</option>
        <option value="starts with">^&nbsp;Starts With</option>
        <option value="is_empty">Is empty</option>
        <option value="not_empty">Not empty</option>
      </select>
      <input
        aria-label="Enter value"
        placeholder="Enter value"
        value={filter.condition === 'LIKE' ? stripText(filter.value) : filter.value}
        onChange={(e) => updateFilters(i, 'value', e.target.value)}
      />
      <DeleteFilter enabled deleteFilter={deleteFilter} i={i} />
    </div>
  );
};

FilterItem.propTypes = {
  /**
   * Array of column names used in
   * select dropdowns
   */
  columns: PropTypes.array,
  /**
   * Callback function to delete a filter
   */
  deleteFilter: PropTypes.func,
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
      '', // We need to allow an empty case because there are initially no filters so there is no condition set which throws a type error
    ]),
    value: PropTypes.string,
  }),
  /**
   * Array of filters
   */
  filters: PropTypes.arrayOf(
    PropTypes.shape({
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
        '', // We need to allow an empty case because there are initially no filters so there is no condition set which throws a type error
      ]),
      value: PropTypes.string,
    })
  ),
  /**
   * Callback function to update filters
   */
  updateFilters: PropTypes.func,
  /**
   * Index value used for identifying the
   * correct filter to delete
   */
  i: PropTypes.number,
};

FilterItem.displayName = 'FilterItem';
export default FilterItem;
