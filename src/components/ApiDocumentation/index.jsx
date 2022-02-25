import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocumentation = ({ endpoint }) => {
  return (
    <div>
      <SwaggerUI url={endpoint} />
    </div>
  );
};

export default ApiDocumentation;
