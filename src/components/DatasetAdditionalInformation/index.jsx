import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';
import './additional-information-table.scss';

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

const DatasetAdditionalInformation = ({ datasetInfo, id, metadataMapping}) => {
  const rows = buildRows(metadataMapping, datasetInfo);
  return (
    <div className="dc-c-additional-info-table ds-u-margin-bottom--6">
      <h2 className="ds-text-heading--2xl ds-u-margin-y--2">Additional Information</h2>
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
              <TableCell className="ds-u-word-break-anywhere">{r.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetAdditionalInformation;
