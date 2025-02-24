import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';

const ApiDocumentation = ({ endpoint }) => {
  return (
    <div>
      <SwaggerUI
        url={endpoint}
        plugins={[SpanOpenAPIVersion, SpanVersionStamp]}
      />
    </div>
  );
};

export default ApiDocumentation;
