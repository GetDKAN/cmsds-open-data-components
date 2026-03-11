import React from 'react';

/**
 * This is the same execute component from Swagger UI but it's been converted
 * to a functional component and to TypeScript.
 * https://github.com/swagger-api/swagger-ui/blob/master/src/core/components/execute.jsx
 * 
 * We're only doing this so that we can add our own classes to the button but
 * keep the original functionality. At this time, you unfortunately can't simply
 * pass a custom className prop to the Original component via a wrapComponents
 * override.
 */
export type ExecuteButtonProps = {
  specSelectors: {
    [key: string]: (...args: any[]) => unknown;
  };
  specActions: {
    [key: string]: (...args: any[]) => unknown;
  };
  oas3Actions: {
    [key: string]: (...args: any[]) => unknown;
  };
  oas3Selectors: {
    [key: string]: (...args: any[]) => unknown;
  };
  operation: unknown;
  path: string;
  method: string;
  onExecute?: () => void;
  disabled?: boolean;
  className?: string;
};

const ExecuteButton: React.FC<ExecuteButtonProps> = (props) => {
  const {
    specSelectors,
    specActions,
    oas3Selectors,
    oas3Actions,
    operation,
    path,
    method,
    onExecute,
    disabled,
    className = '',
  } = props;

  const pathMethod: [string, string] = [path, method];

  const handleValidateParameters = () => {
    specActions.validateParams(pathMethod);

    return specSelectors.validateBeforeExecute(pathMethod);
  };

  const handleValidateRequestBody = () => {
    const validationErrors = {
      missingBodyValue: false,
      missingRequiredKeys: [] as string[],
    };
    oas3Actions.clearRequestBodyValidateError({ path, method });
    const oas3RequiredRequestBodyContentType = specSelectors.getOAS3RequiredRequestBodyContentType(pathMethod);
    const oas3RequestBodyValue = oas3Selectors.requestBodyValue(path, method);
    const oas3ValidateBeforeExecuteSuccess = oas3Selectors.validateBeforeExecute(path, method);
    const oas3RequestContentType = oas3Selectors.requestContentType(path, method);

    if (!oas3ValidateBeforeExecuteSuccess) {
      validationErrors.missingBodyValue = true;
      oas3Actions.setRequestBodyValidateError({ path, method, validationErrors });
      return false;
    }

    if (!oas3RequiredRequestBodyContentType) {
      return true;
    }

    const missingRequiredKeys = oas3Selectors.validateShallowRequired({
      oas3RequiredRequestBodyContentType,
      oas3RequestContentType,
      oas3RequestBodyValue,
    }) as string[] | null | undefined;

    if (!missingRequiredKeys || missingRequiredKeys.length < 1) {
      return true;
    }

    missingRequiredKeys.forEach((key) => validationErrors.missingRequiredKeys.push(key));
    oas3Actions.setRequestBodyValidateError({ path, method, validationErrors });

    return false;
  };

  const handleClick = () => {
    const paramsResult = handleValidateParameters();
    const requestBodyResult = handleValidateRequestBody();
    const isPass = paramsResult && requestBodyResult;

    if (isPass) {
      onExecute?.();
      specActions.execute({ operation, path, method });
    } else {
      specActions.clearValidateParams(pathMethod);
      setTimeout(() => {
        specActions.validateParams(pathMethod);
      }, 40);
    }
  };

  return (
    <button
      type="button"
      className={className.trim() || 'btn execute opblock-control__btn'}
      onClick={handleClick}
      disabled={disabled}
    >
      Execute
    </button>
  );
};

export default ExecuteButton;
