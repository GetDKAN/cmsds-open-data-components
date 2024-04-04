import React, {useState} from 'react';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getPaginationRowModel } from '@tanstack/react-table';

import { Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@cmsgov/design-system';
import { DatasetDictionaryItemType } from '../../types/dataset';
import SitewideDataDictionaryTable from '../SitewideDataDictionaryTable';
import DatasetDictionaryTable from '../DatasetDictionaryTable'

const DataDictionary = (
  { datasetDictionary, datasetSitewideDictionary, title, pageSize = 20 } : 
  { 
    datasetDictionary: DatasetDictionaryItemType[],
    datasetSitewideDictionary: DatasetDictionaryItemType[]
    title: string,
    pageSize: number
  }) => {
  


  return (
    <>
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      {datasetDictionary && (
        <DatasetDictionaryTable datasetDictionary={datasetDictionary} pageSize={pageSize} />
      )}

      {datasetSitewideDictionary && (
        <SitewideDataDictionaryTable datasetDictionary={datasetSitewideDictionary} pageSize={pageSize} />
      )}
    </>
  )
}

export default withQueryProvider(DataDictionary);