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
    publisher,
    references,
  } = datasetInfo;
  let tags = [];
  let themes = [];
  if (keyword && keyword.length) {
    tags = keyword.map((k, index) => {
      if (index === 0) {
        return (
          <Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>
            {k.data}
          </Link>
        );
      } else {
        return (
          <>
            ,{' '}
            <Link key={k.data} to={`/datasets?keyword[]=${k.data}`}>
              {k.data}
            </Link>
          </>
        );
      }
    });
  }
  if (theme && theme.length) {
    themes = theme;
  }

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
          {modified ? (
            <TableRow>
              <TableCell>Last Update</TableCell>
              <TableCell>
                <TransformedDate date={modified} />
              </TableCell>
            </TableRow>
          ) : null}
          {issued ? (
            <TableRow>
              <TableCell>Issued</TableCell>
              <TableCell>
                <TransformedDate date={issued} />
              </TableCell>
            </TableRow>
          ) : null}
          {publisher && publisher.data ? (
            <TableRow>
              <TableCell>Publisher</TableCell>
              <TableCell>{publisher.data.name}</TableCell>
            </TableRow>
          ) : null}
          {identifier ? (
            <TableRow>
              <TableCell>Identifier</TableCell>
              <TableCell>{identifier}</TableCell>
            </TableRow>
          ) : null}
          {contactPoint && contactPoint.fn ? (
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>{contactPoint.fn}</TableCell>
            </TableRow>
          ) : null}
          {contactPoint && contactPoint.hasEmail ? (
            <TableRow>
              <TableCell>Contact Email</TableCell>
              <TableCell>{contactPoint.hasEmail}</TableCell>
            </TableRow>
          ) : null}
          {bureauCode && bureauCode.length ? (
            <TableRow>
              <TableCell>Bureau Code</TableCell>
              <TableCell>{bureauCode[0]}</TableCell>
            </TableRow>
          ) : null}
          {programCode && programCode.length ? (
            <TableRow>
              <TableCell>Program Code</TableCell>
              <TableCell>{programCode[0]}</TableCell>
            </TableRow>
          ) : null}
          {themes && themes.length ? (
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>{themes.map((t) => t.data).join(',')}</TableCell>
            </TableRow>
          ) : null}
          {tags && tags.length ? (
            <TableRow>
              <TableCell>Tags</TableCell>
              <TableCell>{tags}</TableCell>
            </TableRow>
          ) : null}
          {license ? (
            <TableRow>
              <TableCell>License</TableCell>
              <TableCell>
                <a href={license} target="_blank" rel="nofollow">
                  {license}
                </a>
              </TableCell>
            </TableRow>
          ) : null}
          {accessLevel ? (
            <TableRow>
              <TableCell>Public Access Level</TableCell>
              <TableCell>{accessLevel}</TableCell>
            </TableRow>
          ) : null}
          {references ? (
            <TableRow>
              <TableCell>Related Documents</TableCell>
              <TableCell>
                <ul className="ds-u-margin--0 ds-u-padding-y--0 ds-u-padding-left--2 ds-u-padding-right--0">
                  {references.map((r, index) => (
                    <li key={`${r}_${index}`}>
                      <a href={r}>{r}</a>
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatasetAdditionalInformation;
