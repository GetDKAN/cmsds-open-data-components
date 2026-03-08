import React, { useContext } from 'react';
import qs from 'qs';
import ApiDocumentation from '../../components/ApiDocumentation';
import { ApiDocsSwaggerUIPluginProps } from '../../utilities/ApiDocsSwaggerUIPlugin';
import { ACAContext } from '../../utilities/ACAContext';
import { acaToParams } from '../../utilities/aca';

type DatasetAPIProps = {
  id: String;
  rootUrl: String;
  apiUrl: string;
  showRowLimitNotice?: boolean;
  swaggerButtonClassNames?: ApiDocsSwaggerUIPluginProps['buttonClassNames'];
};

const DatasetAPI = ({
  id,
  rootUrl,
  apiUrl,
  showRowLimitNotice = false,
  swaggerButtonClassNames = {},
}: DatasetAPIProps) => {
  const {ACA} = useContext(ACAContext)
  
  return (
    <>
      <ApiDocumentation
        endpoint={`${rootUrl}/metastore/schemas/dataset/items/${id}/docs?${qs.stringify(acaToParams({}, ACA))}`}
        docsURL={apiUrl}
        showRowLimitNotice={showRowLimitNotice}
        swaggerButtonClassNames={swaggerButtonClassNames}
      />
    </>
  );
};

export default DatasetAPI;
