import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import Swagger from '../../components/Swagger';

const APIPage = ({ hideAuth, additionalParams, rootUrl }) => (
  <section className="ds-l-container">
    <Swagger apiUrl={rootUrl} />
    {/* <SwaggerUI
      url={`${rootUrl}?${hideAuth ? 'authentication=false&' : ''}${
        additionalParams && additionalParams.ACA
          ? 'ACA=' + additionalParams.ACA + '&redirect=false'
          : ''
      }`}
      docExpansion={'list'}
      defaultModelsExpandDepth={-1}
    /> */}
  </section>
);

APIPage.defaultProps = {
  hideAuth: true,
};

export default APIPage;
