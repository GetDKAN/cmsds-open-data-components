import React from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@cmsgov/design-system'
import MagnifyingGlassIcon from '../../assets/icons/magnifyingglass'
import ChevronRightIcon from '../../assets/icons/chevronright'
import './search-input.scss'

const SearchInput = ({
  placeholder = 'Search the Data',
  showMagnifyingGlass,
  showSearchButton,
  onDark,
  onChange,
  onSubmit,
  onKeyDown,
  defaultValue = ''
}) => (
  <div className="search-input-container">
    <TextField
      className={`${showMagnifyingGlass ? 'left-padding' : ''} ${showSearchButton ? 'right-padding' : ''}`}
      label={placeholder}
      labelClassName="ds-u-visibility--screen-reader"
      placeholder={placeholder}
      onBlur={() => {}}
      onChange={onChange}
      onKeyDown={onKeyDown}
      defaultValue={defaultValue}
    />
    {showMagnifyingGlass && (
      <div className="magnifying-glass-icon ds-u-visibility--hidden ds-u-sm-visibility--visible">
        <MagnifyingGlassIcon />
      </div>
    )}
    {showSearchButton && (
      <Button
        variation="solid"
        className={onDark && 'on-dark'}
        onClick={onSubmit}
      >
        <span className="magnifying-glass-icon" aria-label="Search the Data">
          <MagnifyingGlassIcon />
        </span>
        <span className="sm-label">
          Search the Data <ChevronRightIcon />
        </span>
      </Button>
    )}
    <div className="rounded-border" />
  </div>
)

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  showMagnifyingGlass: PropTypes.bool,
  showSearchButton: PropTypes.bool,
  onDark: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onKeyDown: PropTypes.func,
  defaultValue: PropTypes.string
}

export default SearchInput
