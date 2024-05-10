import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableBody } from '@cmsgov/design-system';
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

const DatasetAdditionalInformation = ({ metadata, metadataMapping}) => {
  const rows = buildRows(metadataMapping, metadata);
  return (
    <div className="dc-c-additional-info-table ds-u-margin-bottom--6 ds-u-padding-left--0 ds-l-lg-col--7 ds-l-md-col--9 ds-l-col--12">
      <h2 className="ds-h2 ds-text-heading--2xl">Additional Information</h2>
      <Table compact stackable stackableBreakpoint="sm" warningDisabled>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={`${r.label}_${metadata.identifier}`}>
                <TableCell id={r.label.replace(/\s+/g, "")} component="th" className="ds-u-font-weight--bold">
                    {r.label}
                  </TableCell>
                <TableCell stackedTitle={r.label} headers={r.label.replace(/\s+/g, "")}>{r.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default DatasetAdditionalInformation;
