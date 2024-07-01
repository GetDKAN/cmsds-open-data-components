import React from 'react';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import axios from 'axios';

import { DatasetDictionaryItemType } from '../../types/dataset';
import SitewideDataDictionaryTable from '../SitewideDataDictionaryTable';
import DatasetDictionaryTable from '../DatasetDictionaryTable';
import { Button, Spinner } from '@cmsgov/design-system';

const DataDictionary = (
  { datasetDictionaryEndpoint, datasetSitewideDictionary, title, pageSize = 20, additionalParams, csvDownload } : 
  { 
    datasetDictionaryEndpoint: string,
    datasetSitewideDictionary: DatasetDictionaryItemType[]
    title: string,
    pageSize: number,
    additionalParams: any,
    csvDownload : boolean
  }) => {
  
  const {data, isPending, error} = useQuery({
    queryKey: ["dictionary" + datasetDictionaryEndpoint],
    queryFn: () => {
      return axios.get(`${datasetDictionaryEndpoint}?${qs.stringify(additionalParams, {arrayFormat: 'comma',encode: false })}`)
        .then((res) => res.data)
        .catch((error) => console.error(error))
    },
    enabled: datasetDictionaryEndpoint !== undefined
  });

  const datasetDictionary = data && data.data && data.data.fields && data.data.fields.length ? data.data.fields : null;
  
  return (
    <>
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      {datasetDictionary && (
        <>
          <div className="ds-u-margin-bottom--1 ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--end">
            <Button className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4" onClick={() => window.open(datasetDictionaryEndpoint)} type="button" >
              <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i> View Dictionary JSON
            </Button>
            {csvDownload && (
              <div className="ds-l-col--12 ds-l-sm-col--6 ds-l-md-col--4 ds-u-margin-top--2 ds-u-sm-margin-top--0 ds-u-padding--0 ds-u-sm-padding-left--2">
                <a
                  href={datasetDictionaryEndpoint + "/csv"}
                  className="ds-c-button"
                  style={{width: '100%'}}
                >
                  <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i>
                  Download Dictionary CSV
                </a>
              </div>
            )}
          </div>
          <DatasetDictionaryTable datasetDictionary={datasetDictionary} pageSize={pageSize}/>
        </>
      )}

      {datasetSitewideDictionary && (
        <SitewideDataDictionaryTable datasetDictionary={datasetSitewideDictionary} pageSize={pageSize} />
      )}
    </>
  )
}

export default withQueryProvider(DataDictionary);