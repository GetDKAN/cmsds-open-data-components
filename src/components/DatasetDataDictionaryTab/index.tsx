import React from 'react';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { DatasetDictionaryItemType } from '../../types/dataset';
import SitewideDataDictionaryTable from '../SitewideDataDictionaryTable';
import DatasetDictionaryJSON from "../DataDictionary/DatasetDictionaryJSON";
import DatasetDictionaryPDF from '../DataDictionary/DatasetDictionaryPDF';

const DataDictionary = (
  { datasetDictionaryEndpoint, datasetSitewideDictionary, datasetDictionaryFileType, title, pageSize = 20, csvDownload } : 
  { 
    datasetDictionaryEndpoint: string,
    datasetSitewideDictionary: DatasetDictionaryItemType[],
    datasetDictionaryFileType: string,
    title: string,
    pageSize: number,
    additionalParams: any,
    csvDownload : boolean,
  }) => {
  
  return (
    <div data-testid="dataset-dictionary-tab">
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      {datasetDictionaryFileType === 'application/vnd.tableschema+json' && (
        <>
          
          <DatasetDictionaryJSON datasetDictionaryEndpoint={datasetDictionaryEndpoint} pageSize={pageSize} showDownloadButton={csvDownload} />
        </>
      )}
      {datasetDictionaryFileType === 'application/pdf' && (
        <DatasetDictionaryPDF datasetDictionaryEndpoint={datasetDictionaryEndpoint}/>
      )}

      {datasetSitewideDictionary && (
        <SitewideDataDictionaryTable datasetDictionary={datasetSitewideDictionary} pageSize={pageSize} />
      )}
    </div>
  )
}

export default withQueryProvider(DataDictionary);