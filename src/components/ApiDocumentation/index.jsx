import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';

const InfoUrlPrefix = function(system) {
  return {
    wrapComponents: {
      InfoUrl: (Original, system) => (props) => {
        console.log(Original)
        console.log(props)
        return (
          <>
          <span>Hello World Text Prefix: </span><Original {...props} />
          </>
        )
      }
    }
  }
}

const ApiDocumentation = ({ endpoint }) => {
  return (
    <div>
      <SwaggerUI
        url={endpoint}
        plugins={[SpanOpenAPIVersion, SpanVersionStamp, InfoUrlPrefix]}
      />
    </div>
  );
};

export default ApiDocumentation;
