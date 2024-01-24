import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@cmsgov/design-system';

const DocumentationTable = (props) => {
  const { data } = props;
  return (
    <>
      <Table stackable className={'ds-c-table'}>
        <TableHead>
          <TableRow>
            <TableCell key={'Application'} id={'application'} headers={'Application'}>
              Application
            </TableCell>
            <TableCell key={'Notes'} id={'notes'} headers={'Notes'}>
              Notes
            </TableCell>
            <TableCell key={'Links'} id={'links'} headers={'Links'}>
              Links
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d) => (
            <TableRow key={`${d.id}-row`}>
              <TableCell key={d.id} id={d.id} stackedTitle="Application" headers={'Application'}>
                {d.application}
              </TableCell>
              <TableCell key={`${d.id}-notes`} id={d.id} stackedTitle="Notes" headers={'Notes'}>
                {d.notes}
              </TableCell>
              <TableCell key={`${d.id}-link`} id={d.id} stackedTitle="Links" headers={'Links'}>
                <a className="dkan-newtab" href={d.link}>
                  {d.linkText}
                  <span className="ds-u-visibility--screen-reader"> {d.screenReaderOnlyText}</span>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default DocumentationTable;
