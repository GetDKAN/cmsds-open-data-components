import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

export default function ToggleBlock ({
  customId = undefined,
  className = 'toggle-block',
  title,
  children,
  headingClasses = 'toggle-block-title',
  headingLevel = 2,
  innerClasses = 'toggle-block-inner',
  allowToggle = true,
  defaultClosed = false,
  toggleCallback = () => {},
  additionalBlockHeadingMarkup = <></>
}) {
  const [show, toggleShow] = useState(!defaultClosed)

  const ToggleHeading = `h${headingLevel}`

  let toggleBlockHeading = (
    <>
      <ToggleHeading className={headingClasses}>
        {title}
      </ToggleHeading>
      {additionalBlockHeadingMarkup}
    </>
  )

  if (allowToggle) {
    toggleBlockHeading = (
      <>
        <ToggleHeading className={headingClasses}>
          <button type='button' onClick={() => { toggleShow(!show); toggleCallback(!show) }} aria-expanded={show}>
            <FontAwesomeIcon
              icon={['fas', show ? 'chevron-down' : 'chevron-right']}
              size='1x'
              aria-hidden='true'
              role='presentation'
            />
            {title}
          </button>
        </ToggleHeading>
        {additionalBlockHeadingMarkup}
      </>
    )
  }

  return (
    <div
      id={customId}
      className={
        classNames('toggle-block-container', {
          [className]: className
        })
      }
    >
      {toggleBlockHeading}
      <div
        className={
          classNames('toggle-block-panel', {
            [innerClasses]: innerClasses,
            open: show,
            closed: !show
          })
        }
      >
        {children}
      </div>
    </div>
  )
}

ToggleBlock.propTypes = {
  /**
   * Custom id applied to wrapping element
   */
  customId: PropTypes.string,
  /**
   * Button/Header text
   */
  title: PropTypes.node.isRequired,
  /**
   * Panel content
   */
  children: PropTypes.node.isRequired,
  /**
   * Custom classes applied to header element
   */
  headingClasses: PropTypes.string,
  /**
   * Heading level applied to toggle button
   */
  headingLevel: PropTypes.number,
  /**
   * Custom classes applied to panel element
   */
  innerClasses: PropTypes.string,
  /**
   * 'true' makes the component an accordion element
   */
  allowToggle: PropTypes.bool,
  /**
   * Custom classes applied to wrapping element
   */
  className: PropTypes.string,
  /**
   * `true` sets the accordion element closed by default
   */
  defaultClosed: PropTypes.bool,
  /**
   * Callback function used when accordion button element is toggled.
   * Passes the `show` state value as an argument
   */
  toggleCallback: PropTypes.func,
  /**
   * Additional markup to be added after the header h2.
   * Used for data archive download links
   */
  additionalBlockHeadingMarkup: PropTypes.node
}
