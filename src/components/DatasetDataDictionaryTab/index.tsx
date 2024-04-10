import React from 'react';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { DatasetDictionaryItemType } from '../../types/dataset';
import SitewideDataDictionaryTable from '../SitewideDataDictionaryTable';
import DatasetDictionaryTable from '../DatasetDictionaryTable';
import { Button } from '@cmsgov/design-system';

const DataDictionary = (
  { datasetDictionaryEndpoint, datasetSitewideDictionary, title, pageSize = 20, additionalParams } : 
  { 
    datasetDictionaryEndpoint: string,
    datasetSitewideDictionary: DatasetDictionaryItemType[]
    title: string,
    pageSize: number,
    additionalParams: any,
  }) => {
  
  const {data, isPending, error} = useQuery({
    queryKey: ["dictionary" + datasetDictionaryEndpoint],
    queryFn: () => {
      return fetch(`${datasetDictionaryEndpoint}?${qs.stringify(additionalParams, {arrayFormat: 'comma',encode: false })}`).then(
        (res) => res.json(),
      )
    }
  });

  const datasetDictionary = data && data.data && data.data.fields.length ? data.data.fields : null;

  return (
    <>
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      {datasetDictionary && (
        <>
          <div className="ds-u-margin-bottom--1 ds-u-display--flex ds-u-justify-content--end">
            <Button className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4" onClick={() => window.open(datasetDictionaryEndpoint)} type="button" >
              <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i> View Dictionary JSON
            </Button>
          </div>
          <DatasetDictionaryTable datasetDictionary={datasetDictionary} pageSize={pageSize} />
        </>
      )}

      {datasetSitewideDictionary && (
        <SitewideDataDictionaryTable datasetDictionary={datasetSitewideDictionary} pageSize={pageSize} />
      )}
    </>
  )
}

export default withQueryProvider(DataDictionary);