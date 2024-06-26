import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { buildRows } from '../DatasetAdditionalInformation';
import { Table, TableBody, TableRow, TableCell } from '@cmsgov/design-system';
import Resource from '../Resource';
import { DatasetOverviewPropsType } from '../../types/dataset';

const DatasetOverview = ({ dataset, resource, distributions, metadataMapping } : DatasetOverviewPropsType) => {
  const md = useMediaQuery({ minWidth: 0, maxWidth: 768 });
  const rows = buildRows(metadataMapping, dataset);

  return (
    <>
      <Resource
        distributions={distributions}
        resource={resource}
        title={dataset.title}
      />
      <div className="dc-c-additional-info-table ds-u-margin-bottom--6 ds-u-padding-left--0 ds-l-lg-col--7 ds-l-md-col--9 ds-l-col--12">
        <h2 className="ds-text-heading--2xl ds-text-heading--2xl">Additional Information</h2>
        <Table compact stackable stackableBreakpoint="md" warningDisabled>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={`${r.label}_${dataset.identifier}`}>
                {md ? (
                  ''
                ) : (
                  <TableCell component="th" className="ds-u-font-weight--bold">
                    {r.label}
                  </TableCell>
                )}
                <TableCell stackedTitle={r.label}>{r.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DatasetOverview;