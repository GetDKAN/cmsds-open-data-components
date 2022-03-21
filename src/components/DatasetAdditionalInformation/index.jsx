import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';
import TransformedDate from '../TransformedDate';

export function buildRows(metadataMapping, datasetInfo) {
  const rows = [];
  Object.keys(metadataMapping).forEach((d) => {
    if (!datasetInfo[d]) {
      return null;
    } else {
      rows.push(...metadataMapping[d](datasetInfo[d]));
    }
  });
  return rows;
}

const DatasetAdditionalInformation = ({ datasetInfo, id, metadataMapping }) => {
  const [rows] = useState(buildRows(metadataMapping, datasetInfo));
  return (
    <div className="dc-c-additional-info-table ds-u-margin-bottom--6">
      <h2>Additional Information</h2>
      <Table compact striped>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.label}_${id}`}>
              <TableCell>{r.label}</TableCell>
              <TableCell>{r.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetAdditionalInformation;
