import React from 'react';
import { Link } from '@reach/router';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@cmsgov/design-system';
import TransformedDate from '../TransformedDate';

const DatasetAdditionalInformation = ({ datasetInfo }) => {
  const {
    accessLevel,
    programCode,
    issued,
    modified,
    keyword,
    identifier,
    theme,
    contactPoint,
    bureauCode,
    publisher
  } = datasetInfo;

  const tags = keyword.map((k, index) => {
    if(index === 0) {
      return (<Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>{k.data}</Link>);
    } else {
      return (<>, <Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>{k.data}</Link></>);
    }
  })

  return(
    <div className="dc-c-additional-info-table ds-u-margin-bottom--3">
      <h2>Additional Information</h2>
      <Table compact striped>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Last Update</TableCell>
            <TableCell><TransformedDate date={modified} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Issued</TableCell>
            <TableCell><TransformedDate date={issued} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Publisher</TableCell>
            <TableCell>{publisher.data.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Identifier</TableCell>
            <TableCell>{identifier}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contact</TableCell>
            <TableCell>{contactPoint.fn}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contact Email</TableCell>
            <TableCell>{contactPoint.hasEmail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bureau Code</TableCell>
            <TableCell>{bureauCode[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Program Code</TableCell>
            <TableCell>{programCode[0]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>{theme.map(t => t.data).join(',')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tags</TableCell>
            <TableCell>{tags}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>License</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Public Access Level</TableCell>
            <TableCell>{accessLevel}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default DatasetAdditionalInformation;
