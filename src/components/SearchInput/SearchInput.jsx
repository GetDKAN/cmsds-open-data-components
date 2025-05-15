import React, { useState, useEffect, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, FormGroup, Label, Input, InputGroup, InputGroupText } from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import MagnifyingGlassIcon from '../../assets/icons/magnifyingglass'
import CloseCircledIcon from '../../assets/icons/closecircled'
import ChevronRightIcon from '../../assets/icons/chevronright'
import './SearchInput.scss'

const SearchInput = ({
  className = '',
  labelContent = 'Search',
  onChangeFunction,
  placeholder = 'Search the Data',
  value = '',
  bsSize = 'lg',
  labelClassName = '',
  srOnly = true,
  resetContent = 'Reset',
  submitContent = 'Submit',
  showSubmit = true,
  submitID = 'inputSubmit',
  defaultSubmit = true,
  showReset = true,
  inputClassName = 'ds-c-field',
  darkTheme = false,
  submitClassName = '',
  showMagnifyingGlass = false
}) => {
  const [searchQuery, setSearchQuery] = useState(value)
  const searchInput = useRef(null)
  const isMobile = useMediaQuery({ minWidth: 0, maxWidth: 768 })

  useEffect(() => {
    if (defaultSubmit && value === '') {
      setSearchQuery(value)
    } else {
      const readableTerm = value.slice(value.indexOf('=') + 1).split('%20').join(' ')
      setSearchQuery(readableTerm)
    }
  }, [value])

  useEffect(() => {
    if (defaultSubmit) {
      const timer = setTimeout(() => {
        if (searchQuery !== value) {
          onChangeFunction({ type: 'UPDATE_FULLTEXT', data: { fulltext: searchQuery, page: 1 } })
        }
      }, 500)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, onChangeFunction, defaultSubmit])

  const reset = (
    <Button
      type='reset'
      id='inputReset'
      aria-label='Clear search input'
      className='ds-c-button'
      onClick={() => { setSearchQuery('') }}
    >
      <span className='reset-text'>
        <CloseCircledIcon />
        <span className='sr-only'>{resetContent}</span>
      </span>
    </Button>
  )
  const labelClass = srOnly ? 'sr-only' : ''
  const defaultSubmitClasses = 'ds-c-button ds-c-button--alternate'
  const darkThemeClasses = 'ds-c-button--on-dark ds-c-button--solid'
  const combinedSubmitClasses = `${defaultSubmitClasses} ${submitClassName || ''} ${darkTheme ? darkThemeClasses : ''} ${isMobile ? 'mobile' : ''}`.trim()

  return (
    <FormGroup className={`dc-search-input ${className}`}>
      <Label for='inputSearch' className={`${labelClass} ${labelClassName}`}>{labelContent}</Label>
      <InputGroup>
        {showMagnifyingGlass &&
        <InputGroupText addon>
          { !isMobile ? (
           <MagnifyingGlassIcon />
          ) : ('') }
        </InputGroupText> }
        <Input
          type='text'
          name='inputSearch'
          id='inputSearch'
          placeholder={placeholder}
          className={inputClassName}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onChangeFunction && onChangeFunction(e)
          }}
          bsSize={bsSize}
          innerRef={searchInput}
        />
      <span id="searchControls">
      {showReset && searchQuery.length ? reset : null}
      {showSubmit && 
        <Button 
          type='submit'
          aria-label='Submit search'
          className={combinedSubmitClasses}
          id={submitID}>
          { !isMobile ? (
            <>
            {submitContent}
            <ChevronRightIcon />
          </>
          ) : (
           <MagnifyingGlassIcon />
          )}
      </Button>}
      </span>
       </InputGroup>
   </FormGroup>
  )
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  bsSize: PropTypes.string,
  labelClassName: PropTypes.string,
  srOnly: PropTypes.bool,
  className: PropTypes.string,
  resetContent: PropTypes.node,
  submitContent: PropTypes.node,
  onChangeFunction: PropTypes.func.isRequired,
  showSubmit: PropTypes.bool,
  showReset: PropTypes.bool,
  submitID: PropTypes.string,
  defaultSubmit: PropTypes.bool,
  labelContent: PropTypes.string,
  inputClassName: PropTypes.string,
  submitClassName: PropTypes.string,
  darkTheme: PropTypes.bool,
  showMagnifyingGlass: PropTypes.bool
}
export default SearchInput
