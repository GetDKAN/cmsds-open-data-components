import React, { useContext } from 'react';
import qs from 'qs';
import ApiDocumentation from '../ApiDocumentation';
import ApiRowLimitNotice from '../ApiRowLimitNotice';
import { ACAContext } from '../../utilities/ACAContext';
import { acaToParams } from '../../utilities/aca';
type DatasetAPIProps = {
  id: String;
  rootUrl: String;
  apiUrl: string;
  showRowLimitNotice?: boolean;
};

const DatasetAPI = ({
  id,
  rootUrl,
  apiUrl,
  showRowLimitNotice = false,
}: DatasetAPIProps) => {
  const {ACA} = useContext(ACAContext)
  return (
    <>
      <ApiDocumentation
        endpoint={`${rootUrl}/metastore/schemas/dataset/items/${id}/docs?${qs.stringify(acaToParams({}, ACA))}`}
        docsURL={apiUrl}
        showRowLimitNotice={showRowLimitNotice}
      />
    </>
  );
};

export default DatasetAPI;
