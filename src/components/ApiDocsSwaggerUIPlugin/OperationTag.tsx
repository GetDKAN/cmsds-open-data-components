import React, { useState } from 'react';

type OperationTagProps = {
  children: React.ReactNode
  tag: string
}

const OperationTag: React.FC<OperationTagProps> = ({ children, tag, tagObj, getComponent }) => {
  const [show, toggleShow] = useState(true);

  // https://github.com/swagger-api/swagger-ui/blob/1b33a5976d8f5e02d3bc40de1deae3a4a3642e36/src/core/components/operation-tag.jsx
  const Markdown = getComponent("Markdown", true)
  const tagDescription = tagObj.getIn(["tagDetails", "description"], null)

  return (
    <div className='OperationTag'>
      <div className={`toggle-block toggle-block-container${show ? ' open' : ' closed'}`}>
        <h3 className='toggle-block-title'>
          <button
            type='button'
            onClick={() => {
              toggleShow(!show);
            }}
            aria-expanded={show}
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
            <span className='toggle-block-title-text'>{tag}</span>
          </button>
        </h3>
        <div className={`toggle-block-panel${show ? ' open' : ' closed'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default OperationTag;
