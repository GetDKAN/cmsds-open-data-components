import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';

const ApiDocumentation = ({ endpoint }) => {
  return (
    <div>
      <SwaggerUI url={endpoint} />
    </div>
  );
};

export default ApiDocumentation;
