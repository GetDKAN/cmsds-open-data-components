import React, { useContext } from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import ApiRowLimitNotice from '../../components/ApiRowLimitNotice';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-ui-overrides.scss';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const APIPage = ({ hideAuth = true, rootUrl, showRowLimitNotice = false }) => {
  let params = {
    authentication: hideAuth ? false : undefined,
  };
  const {ACA} = useContext(ACAContext);
  return (
    <>
      {showRowLimitNotice && <ApiRowLimitNotice />}
      <section className="ds-l-container">
        <SwaggerUI
          url={`${rootUrl}${qs.stringify(acaToParams(params, ACA), { addQueryPrefix: true })}`}
          docExpansion={'list'}
          defaultModelsExpandDepth={-1}
          plugins={[SpanOpenAPIVersion, SpanVersionStamp]}
        />
      </section>
    </>
  );
};

export default APIPage;
