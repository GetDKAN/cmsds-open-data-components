import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import SpanOpenAPIVersion from '../ApiDocsSwaggerUIPlugin/SpanOpenAPIVersion';
import SpanVersionStamp from '../ApiDocsSwaggerUIPlugin/SpanVersionStamp';
import ApiDocsSwaggerUIPlugin from '../ApiDocsSwaggerUIPlugin';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';

type ApiDocumentationProps = {
  endpoint: string;
  docsURL: string;
  showRowLimitNotice: boolean;
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ endpoint, docsURL, showRowLimitNotice }) => {
  return (
    <div>
      <SwaggerUI
        url={endpoint}
        plugins={[SpanOpenAPIVersion, SpanVersionStamp, ApiDocsSwaggerUIPlugin({ docsURL, showRowLimitNotice, isDatasetDocs: true })]}
      />
    </div>
  );
};

export default ApiDocumentation;
