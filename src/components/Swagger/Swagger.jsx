import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import CMSDSLayoutPlugin from './Plugins/CMSDSLayoutPlugin';

const Swagger = ({apiUrl}) => {
  return(
    <SwaggerUI
      url={apiUrl}
      plugins={[CMSDSLayoutPlugin]}
      layout={"CMSDSLayout"}
    />
  );
};

export default Swagger
