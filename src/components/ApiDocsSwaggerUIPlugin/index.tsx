import ApiDocsInfo from './ApiDocsInfo';
import OperationCompWrapperInner from './OperationCompWrapperInner';
import OperationTag from './OperationTag';
import OperationSummary from './OperationSummary';
import Models from './Models';

type ApiDocsSwaggerUIPluginProps = {
  docsURL?: string;
  showRowLimitNotice?: boolean;
  isDatasetDocs?: boolean;
}

const ApiDocsSwaggerUIPlugin = ({ docsURL = '', showRowLimitNotice = false, isDatasetDocs = false }: ApiDocsSwaggerUIPluginProps) => (system: any) => {
  return {
    wrapComponents: {
      parameters: (Original: any) => (props: any) => (
        <Original
          {...{ ...props, allowTryItOut: true, tryItOutEnabled: true }}
        />
      ),
      operation: (Original: any) => (props: any) => (
        <OperationCompWrapperInner {...props} Original={Original} />
      ),
      App: (Original: any) => (props: any) => (
        <div id='api-docs-swagger-ui-plugin'>
          <Original {...props} />
        </div>
      ),
      VersionStamp: (Original: any, system: any) => () => {
        const version = system.specSelectors.version();
        const classList = "version version-stamp version-stamp--span";
        return (
          <span className={classList}>
            { version }
          </span>
        );
      },
    },
    components: {
      info: (props: any) => <ApiDocsInfo {...props} isDatasetDocs={isDatasetDocs} docsURL={docsURL} showRowLimitNotice={showRowLimitNotice} />,
      OperationTag: (props: any) => <OperationTag {...props} />,
      OperationSummary: (props: any) => <OperationSummary {...props} />,
      Models: (props: any) => <Models {...props} />,
      OperationSummaryMethod: () => null,
      TryItOutButton: () => null,
    }
  }
}

export default ApiDocsSwaggerUIPlugin;
