import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import { SpanOpenAPIVersion, SpanVersionStamp } from '@civicactions/swagger-ui-layout';
import ApiDocsInfo from './ApiDocsInfo';
import 'swagger-ui-react/swagger-ui.css';
import '../../templates/APIPage/swagger-ui-overrides.scss';


const ApiDocumentation = ({ endpoint, docsURL, showRowLimitNotice }) => {
  // this plugin is defined here rather than in swagger-ui-layout so that it can have docsURL and
  // showRowLimitNotice easily in scope. I couldn't figure out how to pass the plugin these values
  // another way.
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
        info: (props) => <ApiDocsInfo {...props} isDatasetDocs docsURL={docsURL} showRowLimitNotice={showRowLimitNotice} />,
      },
      statePlugins: {
        docs: {
          selectors: {
            docsUrl: (state) => state.get('docsUrl')
          }
        }
      }
    }
  }

  return (
    <div>
      <SwaggerUI
        url={endpoint}
        plugins={[SpanOpenAPIVersion, SpanVersionStamp, ApiDocsSwaggerUIPlugin]}
        docsURL={docsURL}
      />
    </div>
  );
};

export default ApiDocumentation;
