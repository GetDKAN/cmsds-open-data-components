import React from 'react';
import SwaggerUI from 'swagger-ui-react';

const APIPage = () => (
  <section className="ds-l-container">
    <SwaggerUI url={`${process.env.REACT_APP_ROOT_URL}?authentication=false`} docExpansion={'list'} />;
  </section>
);

export default APIPage;
