import React from 'react';
import { Table, TableRow, TableCell } from '@cmsgov/design-system';
import './resource-information-table.scss';

const ResourceInformation = ({ resource }) => {
  const { count, columns } = resource;
  return (
    <div className="dc-c-resource-info-table">
      <h2 className="ds-text-heading--2xl ds-u-margin-y--3">About this Resource</h2>
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
