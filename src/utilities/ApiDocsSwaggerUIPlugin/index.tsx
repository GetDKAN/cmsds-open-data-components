import type { ComponentType, ComponentProps } from 'react';
import ApiDocsInfo from './ApiDocsInfo';
import OperationCompWrapperInner from './OperationCompWrapperInner';
import OperationTag from './OperationTag';
import OperationSummary from './OperationSummary';
import ExecuteButton, { ExecuteButtonProps } from './ExecuteButton';
import ClearButton, { ClearButtonProps } from './ClearButton';
import Models from './Models';

export type ApiDocsSwaggerUIPluginProps = {
  docsURL?: string;
  showRowLimitNotice?: boolean;
  isDatasetDocs?: boolean;
  // We can optionally pass in class names for the try it out, execute, and clear buttons.
  // All Open Data sites should style these buttons automatically to match their theme
  // but there may be instances like with PDC where buttons are custom styled.
  buttonClassNames?: {
    tryItOutButton?: string;
    executeButton?: string;
    clearButton?: string;
    copyToClipboardButton?: string;
  }
}

type SwaggerUISystem = {
  specSelectors: { version(): string };
}

export interface SwaggerUIComponentProps extends Record<string, unknown> {}

const ApiDocsSwaggerUIPlugin = ({
  docsURL = '',
  showRowLimitNotice = false,
  isDatasetDocs = false,
  buttonClassNames = {}
}: ApiDocsSwaggerUIPluginProps) => (system: SwaggerUISystem) => {
  return {
    wrapComponents: {
      App: (Original: ComponentType<SwaggerUIComponentProps>) => (props: SwaggerUIComponentProps) => (
        <div id='api-docs-swagger-ui-plugin' className='ds-l-container'>
          <Original {...props} />
        </div>
      ),
      parameters: (Original: ComponentType<SwaggerUIComponentProps>) => (props: SwaggerUIComponentProps) => (
        <Original
          {...{ ...props, allowTryItOut: true, tryItOutEnabled: true }}
        />
      ),
      operation: (Original: ComponentType<SwaggerUIComponentProps>) => (props: SwaggerUIComponentProps) => (
        <OperationCompWrapperInner {...props} Original={Original} />
      ),
      execute: (Original: ComponentType<SwaggerUIComponentProps>) => (props: SwaggerUIComponentProps) => (
        <ExecuteButton
          {...(props as ExecuteButtonProps)}
          className={buttonClassNames.executeButton ?? 'ds-c-button ds-c-button--solid execute-button'}
        />
      ),
      clear: (Original: ComponentType<SwaggerUIComponentProps>) => (props: SwaggerUIComponentProps) => (
        <ClearButton
          {...(props as ClearButtonProps)}
          className={buttonClassNames.clearButton ?? 'ds-c-button ds-u-margin-left--2 clear-button'}
        />
      ),
      VersionStamp: (Original: ComponentType<SwaggerUIComponentProps>, system: SwaggerUISystem) => () => {
        const version = system.specSelectors.version();
        return (
          <span className='version version-stamp version-stamp--span'>
            {version}
          </span>
        );
      },
    },
    components: {
      info: (props: SwaggerUIComponentProps) => (
        <ApiDocsInfo
          {...props}
          isDatasetDocs={isDatasetDocs}
          docsURL={docsURL}
          showRowLimitNotice={showRowLimitNotice}
          buttonClassNames={buttonClassNames}
        />
      ),
      OperationTag: (props: SwaggerUIComponentProps) => (
        <OperationTag {...(props as ComponentProps<typeof OperationTag>)} />
      ),
      OperationSummary: (props: SwaggerUIComponentProps) => (
        <OperationSummary
          {...(props as ComponentProps<typeof OperationSummary>)}
          tryItOutButtonClassNames={buttonClassNames.tryItOutButton ?? ''}
          copyToClipboardButtonClassNames={buttonClassNames.copyToClipboardButton ?? ''}
        />
      ),
      Models: (props: SwaggerUIComponentProps) => (
        <Models {...(props as ComponentProps<typeof Models>)} />
      ),
      OperationSummaryMethod: () => null,
      TryItOutButton: () => null,
    }
  }
}

export default ApiDocsSwaggerUIPlugin;
