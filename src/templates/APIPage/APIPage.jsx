import React from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './swagger.scss';
import './swagger-ui-overrides.scss';

const APIPage = ({ hideAuth, additionalParams, rootUrl }) => {
  const hasACA = additionalParams && additionalParams.ACA ? true : false;
  let params = {
    authentication: hideAuth ? false : undefined,
    ACA: hasACA ? additionalParams.ACA : undefined,
    redirect: hasACA ? false : undefined,
  };
  return (
    <section className="ds-l-container">
    <SwaggerUI
      url={`${rootUrl}${qs.stringify(params, { addQueryPrefix: true })}`}
      docExpansion={'list'}
      defaultModelsExpandDepth={-1}
    />
  </section>
  )
};

APIPage.defaultProps = {
  hideAuth: true,
};

export default APIPage;
