import React from 'react';
import { Link } from '@reach/router';
import { Button, Badge } from '@cmsgov/design-system';
import TransformedDate from '../TransformedDate';

const DatasetSearchListItem = ({item, updateFacets}) => {
  const { title, modified, description, theme, keyword, identifier } = item;
  const updatedDate = new Date(modified)
  const dateOptions = {month: 'long', year: 'numeric', day: 'numeric'}
  return(
    <div className="dc-dataset-searchlist-item ds-u-border-top--1 ds-u-margin-bottom--5">
      <div className="ds-l-row ds-u-padding-top--5">
        <div className="ds-l-col--7">
          {theme &&
            <ul className="ds-u-padding--0 ds-u-display--flex ds-u-flex-direction--row ds-u-flex-wrap--wrap">
              {theme.map((t) => (
                <li key={t} className="ds-u-margin-right--1 ds-u-margin-bottom--1">
                  <Badge variation="info">{t}</Badge>
                </li>
              ))}
            </ul>
          }
        </div>
        <span className="ds-l-col--5 ds-u-color--gray ds-u-text-align--right">
          Updated <TransformedDate date={modified} />
        </span>
      </div>
      <h3>
        <Link
          className="ds-u-color--base"
          to={`/dataset/${identifier}`}
        >
          {title}
        </Link>
      </h3>
      {/* 215 average character limit */}
      <p className="ds-u-margin-top--0">{description}</p>
      <div>
        {keyword &&
          <ul className="ds-u-padding--0 ds-u-display--flex ds-u-flex-wrap--wrap">
            {keyword.map((k) => (
              <li key={k}>
                <Badge className="ds-u-radius ds-u-fill--primary-alt-lightest ds-u-color--base ds-u-margin-right--1 ds-u-margin-bottom--2" variation="info">{k}</Badge>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
}

export default DatasetSearchListItem;
