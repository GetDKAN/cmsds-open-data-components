import React from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import ApiRowLimitNotice from '../../components/ApiRowLimitNotice';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-ui-overrides.scss';

const APIPage = ({ hideAuth = true, additionalParams, rootUrl, showRowLimitNotice = false }) => {
  const hasACA = additionalParams && additionalParams.ACA ? true : false;
  let params = {
    authentication: hideAuth ? false : undefined,
    ACA: hasACA ? additionalParams.ACA : undefined,
    redirect: hasACA ? false : undefined,
  };
  return (
    <>
      {showRowLimitNotice && <ApiRowLimitNotice />}
      <section className="ds-l-container">
        <SwaggerUI
          url={`${rootUrl}${qs.stringify(params, { addQueryPrefix: true })}`}
          docExpansion={'list'}
          defaultModelsExpandDepth={-1}
          plugins={[SpanOpenAPIVersion, SpanVersionStamp]}
        />
      </section>
    </>
  );
};

export default APIPage;
