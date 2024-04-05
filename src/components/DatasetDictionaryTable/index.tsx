import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DatasetDictionaryItemType } from '../../types/dataset';
import DataDictionaryTable from '../DataDictionaryTable';
import { Tooltip, TooltipIcon } from '@cmsgov/design-system';
import "./datadictionary.scss"

const DatasetDictionaryTable = ({ datasetDictionary, pageSize} : {datasetDictionary: DatasetDictionaryItemType[], pageSize: number}) => {
  const tableData = datasetDictionary.map((item) => {
    return {
      nameAndTitle: {
        name: item.name,
        title: item.title
      },
      description: item.description,
      type: item.type
    }
  })

  const columnHelper = createColumnHelper<DatasetDictionaryItemType>()
  const tableColumns = [
    columnHelper.accessor('nameAndTitle', {
      header: () => (
        <div className="ds-u-font-weight--normal dc-c-tooltip-width-override">
          Name / Title
          <Tooltip
            title={
              (
                <div className="ds-u-display--block">
                  <p>Name is the machine readable, mysql compliant name generated from the column header found in the csv file. Spaces will be converted to underscores, uppercase will convert to lowercase, special characters will be dropped, and there is a 64 character limit, anything longer will be truncated and given a unique 4 digit hash at the end. It is also the property name that would be used when running queries with the datastore API so it is helpful to not use overly long name values. (e.g., change_type)</p>
                  <p>Title is the human readable text that will be displayed in the data preview on the dataset page. (e.g., Change Type)</p>
                </div>
              )
            }
            // @ts-ignore
            style={{ border: 'none', background: 'none' }}
            maxWidth="500px"
          >
            <TooltipIcon />
          </Tooltip>
        </div>
      ),
      cell: props  => {
        const cellValue = props.getValue() as unknown as {name: string, title: string}
        return (
          <>
            <p className="dc-truncate">{cellValue.name}</p>
            <p className="dc-truncate">{cellValue.title}</p>
          </>
      )},
      size: 300
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      minSize: 600,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      size: 150,
      enableResizing: false
    }),
  ];

  return ( <DataDictionaryTable tableColumns={tableColumns} tableData={tableData} count={datasetDictionary.length} pageSize={pageSize} /> )
}

export default DatasetDictionaryTable;