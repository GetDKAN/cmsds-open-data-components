import React from 'react';
import SwaggerUI from 'swagger-ui-react';

const APIPage = ({hideAuth, additionalParams}) => (
  <section className="ds-l-container">
    <SwaggerUI url={`${process.env.REACT_APP_ROOT_URL}?${hideAuth ? 'authentication=false&' : ''}${additionalParams && additionalParams.ACA ? 'ACA=' + additionalParams.ACA + '&redirect=false' : ''}`} docExpansion={'list'} />
  </section>
);

APIPage.defaultProps = {
  hideAuth: false,
}

export default APIPage;
