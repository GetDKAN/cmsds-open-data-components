import React from 'react';
import { useQuery } from '@tanstack/react-query';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';
import { DatasetDictionaryItemType } from '../../types/dataset';

const DataDictionary = (
  { datasetDictionary, title } : 
  { datasetDictionary: DatasetDictionaryItemType[], title: string}) => {

  const tableColumns = [
    {
      colName: "name",
      UIName: "Name"
    },
    {
      colName: "title",
      UIName: "Title"
    },
    {
      colName: "type",
      UIName: "Type"
    },
    {
      colName: "format",
      UIName: "Format"
    }
  ];


  return (
    <>
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{title}</h2>
      <Table>
        <TableHead>
          <TableRow>
            { tableColumns.map((col) => {
              return (
                <TableCell>{col.UIName}</TableCell>
              )
            }) }
          </TableRow>
        </TableHead>
        <TableBody>
          {datasetDictionary.map((row : DatasetDictionaryItemType) => {      
            return (
              <TableRow>
                { tableColumns.map((col) => {
                  return (
                    <TableCell>{row[col.colName]}</TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default withQueryProvider(DataDictionary);