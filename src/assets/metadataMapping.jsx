import React from 'react';
import { Link } from '@reach/router';
import TransformedDate from '../components/TransformedDate';
import { frequencyMap } from './frequencyMap';

export const defaultMetadataMapping = {
  modified: (data) => {
    return [{ label: 'Modified', value: <TransformedDate date={data} /> }];
  },
  issued: (data) => {
    return [{ label: 'Issued', value: <TransformedDate date={data} /> }];
  },
  accrualPeriodicity: (data) => {
    return [
      {
        label: 'Frequency',
        value: frequencyMap[data].name,
      },
    ];
  },
  publisher: (data) => {
    if (data.data && data.data.name) {
      return [{ label: 'Publisher', value: data.data.name }];
    } else {
      return [];
    }
  },
  identifier: (data) => {
    return [{ label: 'Identifier', value: data }];
  },
  contactPoint: (data) => {
    let rows = [];
    if (data.fn) {
      rows.push({ label: 'Contact', value: data.fn });
    }
    if (data.hasEmail) {
      rows.push({ label: 'Contact Email', value: data.hasEmail });
    }
    return rows;
  },
  bureauCode: (data) => {
    if (data.length) {
      return [{ label: 'Bureau Code', value: data[0] }];
    }
  },
  programCode: (data) => {
    if (data.length) {
      return [{ label: 'Program Code', value: data[0] }];
    }
  },
  theme: (data) => {
    return [
      {
        label: 'Category',
        value: data
          .map((theme) => (
            <Link key={theme.data} to={`/datasets?theme[]=${theme.data}`}>
              {theme.data}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr]),
      },
    ];
  },
  keyword: (data) => {
    return [
      {
        label: 'Tags',
        value: data
          .map((keyword) => (
            <Link key={keyword.data} to={`/datasets?keyword[]=${keyword.data}`}>
              {keyword.data}
            </Link>
          ))
          .reduce((prev, curr) => [prev, ', ', curr]),
      },
    ];
  },
  license: (data) => {
    return [{ label: 'License', value: <a href={data}>{data}</a> }];
  },
  accessLevel: (data) => {
    return [{ label: 'Public Access Level', value: data }];
  },

  temporal: (data) => {
    return [
      { label: 'Temporal Coverage', value: <span className="dc-c-word-break--all">{data}</span> },
    ];
  },
  spatial: (data) => {
    return [{ label: 'Spacial/Geographical Coverage', value: data }];
  },
  references: (data) => {
    return [
      {
        label: 'Related Documents',
        value: (
          <ul className="ds-u-margin--0 ds-u-padding-y--0 ds-u-padding-left--2 ds-u-padding-right--0">
            {data.map((item) => (
              <li key={item}>
                <a href={item}>{item}</a>
              </li>
            ))}
          </ul>
        ),
      },
    ];
  },
};
