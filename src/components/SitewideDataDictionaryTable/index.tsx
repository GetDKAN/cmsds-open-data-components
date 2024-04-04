import React, { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DatasetDictionaryItemType } from '../../types/dataset';
import DataDictionaryTable from '../DataDictionaryTable';

const SitewideDataDictionaryTable = ({ datasetDictionary, pageSize} : {datasetDictionary: DatasetDictionaryItemType[], pageSize: number}) => {
  const columnHelper = createColumnHelper<DatasetDictionaryItemType>()
  const tableColumns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('title', {
      header: 'Title',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
    }),
    columnHelper.accessor('format', {
      header: 'Format',
    }),
  ];

  return ( <DataDictionaryTable tableColumns={tableColumns} tableData={datasetDictionary} count={datasetDictionary.length} pageSize={pageSize} /> )
}

export default SitewideDataDictionaryTable;