import React from 'react';
import { useQuery } from '@tanstack/react-query';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';

const DataDictionary = ({ rootUrl } : {rootUrl: string}) => {

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
    }
  ];
  
  const {data, status, error} = useQuery({
    queryKey: ["dictionary"],
    queryFn: () => {
      return fetch(rootUrl + "/metastore/schemas/data-dictionary/items/sitewide-data-dictionary").then(
        (res) => res.json(),
      )
    }
  });

  return (
    <>
      {data && (
        <h2 className="ds-text-heading--2xl ds-u-margin-y--3">{data.title}</h2>
      )}
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
          {data && data.data.fields.map((row) => {      
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