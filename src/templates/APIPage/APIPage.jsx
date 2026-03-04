import React, { useContext } from 'react';
import qs from 'qs';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import ApiRowLimitNotice from '../../components/ApiRowLimitNotice';
import ApiDocsInfo from '../../components/ApiDocumentation/ApiDocsInfo';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-ui-overrides.scss';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const APIPage = ({ hideAuth = true, rootUrl, showRowLimitNotice = false }) => {
  let params = {
    authentication: hideAuth ? false : undefined,
  };
  const {ACA} = useContext(ACAContext);

  // this plugin is defined here rather than in swagger-ui-layout so that it can easily re-use
  // the ApiDocsInfo component.
  const ApiDocsSwaggerUIPlugin = (props) => {
    return {
      wrapComponents: {
        VersionStamp: (Original, system) => () => {
          const version = system.specSelectors.version();
          const classList = "version version-stamp version-stamp--span";
          return (
            <span className={classList}>
              { version }
            </span>
          );
        },
      },
      components: {
        info: (props) => <ApiDocsInfo {...props} />,
      },
    }
  }

  return (
    <>
      {showRowLimitNotice && <ApiRowLimitNotice />}
      <section className="ds-l-container ds-u-padding--0 ds-u-margin-top--5">
        <SwaggerUI
          url={`${rootUrl}${qs.stringify(acaToParams(params, ACA), { addQueryPrefix: true })}`}
          docExpansion={'list'}
          defaultModelsExpandDepth={-1}
          plugins={[SpanOpenAPIVersion, SpanVersionStamp, ApiDocsSwaggerUIPlugin]}
        />
      </section>
    </>
  );
};

export default APIPage;
