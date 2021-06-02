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
    license,
    theme,
    contactPoint,
    bureauCode,
    publisher
  } = datasetInfo;
  let tags = [];
  let themes = []
  if(keyword && keyword.length) {
    tags = keyword.map((k, index) => {
      if(index === 0) {
        return (<Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>{k.data}</Link>);
      } else {
        return (<>, <Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>{k.data}</Link></>);
      }
    })
  }
  if(theme && theme.length) {
    themes = theme;
  }
  

  return(
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
          {modified
            &&(
              <TableRow>
                <TableCell>Last Update</TableCell>
                <TableCell><TransformedDate date={modified} /></TableCell>
              </TableRow>
            )
          }
          {issued
            && (
              <TableRow>
                <TableCell>Issued</TableCell>
                <TableCell><TransformedDate date={issued} /></TableCell>
              </TableRow>
            )
          }
          {(publisher && publisher.data)
            && (
              <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>{publisher.data.name}</TableCell>
              </TableRow>
            )
          }
          {identifier
            && (
              <TableRow>
                <TableCell>Identifier</TableCell>
                <TableCell>{identifier}</TableCell>
              </TableRow>
            )
          }
          {(contactPoint && contactPoint.fn)
            && (
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>{contactPoint.fn}</TableCell>
              </TableRow>
            )
          }
          {(contactPoint && contactPoint.hasEmail)
            && (
              <TableRow>
                <TableCell>Contact Email</TableCell>
                <TableCell>{contactPoint.hasEmail}</TableCell>
              </TableRow>
            )
          }
          {(bureauCode && bureauCode.length)
            && (
              <TableRow>
                <TableCell>Bureau Code</TableCell>
                <TableCell>{bureauCode[0]}</TableCell>
              </TableRow>
            )
          }
          {(programCode && programCode.length)
            && (
              <TableRow>
                <TableCell>Program Code</TableCell>
                <TableCell>{programCode[0]}</TableCell>
              </TableRow>
            )
          }
          {(themes && themes.length)
            && (
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>{themes.map(t => t.data).join(',')}</TableCell>
              </TableRow>
            )
          }
          {(tags && tags.length)
            && (
              <TableRow>
                <TableCell>Tags</TableCell>
                <TableCell>{tags}</TableCell>
              </TableRow>
            )
          }
          {license
            && (
              <TableRow>
                <TableCell>License</TableCell>
                <TableCell><a href={license} target="_blank" rel="nofollow">{license}</a></TableCell>
              </TableRow>
            )
          }
          {accessLevel
            && (
              <TableRow>
                <TableCell>Public Access Level</TableCell>
                <TableCell>{accessLevel}</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default DatasetAdditionalInformation;
