import React from 'react';

/**
 * This is the same clear component from Swagger UI but it's been converted
 * to a functional component and to TypeScript.
 * https://github.com/swagger-api/swagger-ui/blob/master/src/core/components/clear.jsx
 * 
 * We're only doing this so that we can add our own classes to the button but
 * keep the original functionality. At this time, you unfortunately can't simply
 * pass a custom className prop to the Original component via a wrapComponents
 * override.
 */
export type ClearButtonProps = {
  specActions: {
    [key: string]: (...args: any[]) => void;
  }
  path: string;
  method: string;
  className?: string;
};

const ClearButton: React.FC<ClearButtonProps> = (props) => {
  const {
    specActions,
    path,
    method,
    className = '',
  } = props;

  const handleClick = () => {
    specActions.clearResponse( path, method )
    specActions.clearRequest( path, method )
  };

  return (
    <button
      type="button"
      className={className.trim() || 'btn btn-clear opblock-control__btn'}
      onClick={handleClick}
    >
      Clear
    </button>
  );
};

export default ClearButton;
