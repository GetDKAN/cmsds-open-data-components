import { useContext } from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import SpanOpenAPIVersion from '../../components/ApiDocsSwaggerUIPlugin/SpanOpenAPIVersion';
import SpanVersionStamp from '../../components/ApiDocsSwaggerUIPlugin/SpanVersionStamp';
import ApiRowLimitNotice from '../../components/ApiRowLimitNotice';
import ApiDocsSwaggerUIPlugin from '../../components/ApiDocsSwaggerUIPlugin';
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
      <section className="ds-l-container ds-u-padding--0 ds-u-margin-top--5">
        <SwaggerUI
          url={`${rootUrl}${qs.stringify(acaToParams(params, ACA), { addQueryPrefix: true })}`}
          docExpansion={'list'}
          defaultModelsExpandDepth={-1}
          plugins={[SpanOpenAPIVersion, SpanVersionStamp, ApiDocsSwaggerUIPlugin({ showRowLimitNotice })]}
        />
      </section>
    </>
  );
};

export default APIPage;
