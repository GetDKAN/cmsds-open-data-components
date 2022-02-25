import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';

const ResourceInformation = ({ resource }) => {
  const { count, columns } = resource;
  return (
    <div className="dc-c-resource-info-table">
      <h2>About this Resource</h2>
      <Table compact striped>
        <TableRow>
          <TableCell component="th" scope="row">
            Rows
          </TableCell>
          <TableCell align="right">{parseInt(count).toLocaleString()}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Columns
          </TableCell>
          <TableCell align="right">{columns.length.toLocaleString()}</TableCell>
        </TableRow>
      </Table>
    </div>
  );
};

export default ResourceInformation;
