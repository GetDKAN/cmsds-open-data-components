import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import SpanOpenAPIVersion from '../../utilities/ApiDocsSwaggerUIPlugin/SpanOpenAPIVersion';
import SpanVersionStamp from '../../utilities/ApiDocsSwaggerUIPlugin/SpanVersionStamp';
import ApiDocsSwaggerUIPlugin, { ApiDocsSwaggerUIPluginProps } from '../../utilities/ApiDocsSwaggerUIPlugin';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';

type ApiDocumentationProps = {
  endpoint: string;
  docsURL: string;
  showRowLimitNotice: boolean;
  swaggerButtonClassNames?: ApiDocsSwaggerUIPluginProps['buttonClassNames'];
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ endpoint, docsURL, showRowLimitNotice, swaggerButtonClassNames = {} }) => {
  return (
    <div>
      <SwaggerUI
        url={endpoint}
        plugins={[
          SpanOpenAPIVersion,
          SpanVersionStamp,
          ApiDocsSwaggerUIPlugin({
            docsURL,
            showRowLimitNotice,
            isDatasetDocs: true,
            buttonClassNames: swaggerButtonClassNames
          })]}
      />
    </div>
  );
};

export default ApiDocumentation;
