import { useContext } from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import SpanOpenAPIVersion from '../../utilities/ApiDocsSwaggerUIPlugin/SpanOpenAPIVersion';
import SpanVersionStamp from '../../utilities/ApiDocsSwaggerUIPlugin/SpanVersionStamp';
import ApiDocsSwaggerUIPlugin, { ApiDocsSwaggerUIPluginProps } from '../../utilities/ApiDocsSwaggerUIPlugin';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-ui-overrides.scss';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

type APIPageProps = {
  hideAuth?: boolean;
  rootUrl: string;
  showRowLimitNotice?: boolean;
  swaggerButtonClassNames?: ApiDocsSwaggerUIPluginProps['buttonClassNames'];
}

const APIPage: React.FC<APIPageProps> = ({ hideAuth = true, rootUrl, showRowLimitNotice = false, swaggerButtonClassNames = {} }) => {
  let params = {
    authentication: hideAuth ? false : undefined,
  };
  const {ACA} = useContext(ACAContext);

  return (
    <>
      <section className="ds-l-container ds-u-padding--0 ds-u-margin-top--5">
        <SwaggerUI
          url={`${rootUrl}${qs.stringify(acaToParams(params, ACA), { addQueryPrefix: true })}`}
          docExpansion={'list'}
          defaultModelsExpandDepth={-1}
          plugins={[
            SpanOpenAPIVersion,
            SpanVersionStamp,
            ApiDocsSwaggerUIPlugin({
              showRowLimitNotice,
              buttonClassNames: swaggerButtonClassNames
            })
          ]}
        />
      </section>
    </>
  );
};

export default APIPage;
