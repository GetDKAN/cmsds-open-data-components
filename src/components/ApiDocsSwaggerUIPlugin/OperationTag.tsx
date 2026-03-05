import React, { useState } from 'react';
import type { Map } from 'immutable';

type OperationTagProps = {
  children: React.ReactNode
  tag: string
  tagObj: Map<string, any>
}

const OperationTag: React.FC<OperationTagProps> = ({ children, tag, tagObj }) => {
  const [show, toggleShow] = useState(true);
  const tagDescription = tagObj.getIn(["tagDetails", "description"], null) as string | null;

  return (
    <div className='OperationTag'>
      <div
        className={`
          toggle-block toggle-block-container
          ${show ? ' open' : ' closed'}
          ${show ? ' ds-u-padding-bottom--0 ds-u-margin-bottom--4' : ''}
        `}
      >
        <h3
          className='toggle-block-title ds-u-margin-y--1 ds-u-display--flex ds-u-justify-content--start ds-u-font-size--lg'
        >
          <button
            type='button'
            onClick={() => {
              toggleShow(!show);
            }}
            aria-expanded={show}
            className='toggle-block-title-button ds-u-display--flex ds-u-align-items--center ds-u-text-align--left ds-u-fill--transparent ds-u-border--0 ds-u-padding--0'
          >
            {show ? (
              /* Chevron down */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20"
                height="20"
                aria-hidden="true"
                role="presentation"
                className="OperationTag__chevron-down"
              >
                <path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            ) : (
              /* Chevron up */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20"
                height="20"
                aria-hidden="true"
                role="presentation"
                className="OperationTag__chevron-up"
              >
                <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
              </svg>
            )}
            <span
              className='toggle-block-title-text ds-u-display--flex ds-u-align-items--center ds-u-padding-left--4'
            >
              {tag}
            </span>
            {tagDescription ? <span className='toggle-block-title-description ds-u-font-size--sm ds-u-font-weight--normal ds-u-margin-left--2'>{tagDescription}</span> : null}
          </button>
        </h3>
        <div
          className={`
            toggle-block-panel ds-u-padding-left--4
            ${show ? ' open' : ' closed'}
            ${show ? ' ds-u-display--block' : 'ds-u-display--none'}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default OperationTag;
