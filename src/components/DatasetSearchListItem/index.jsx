import React from 'react';
import { Button, Badge } from '@cmsgov/design-system';

const DatasetSearchListItem = ({item}) => {
  const { title, modified, description, theme, keyword } = item;
  const updatedDate = new Date(modified.replace(/-/g, '\/'))
  const dateOptions = {month: 'long', year: 'numeric', day: 'numeric'}
  return(
    <div className="dc-dataset-searchlist-item ds-u-border-top--1 ds-u-margin-bottom--5">
      <div className="ds-u-display--flex ds-u-flex-direction--row ds-u-justify-content--between ds-u-padding-top--5">
        <ul className="ds-u-padding--0 ds-u-display--flex ds-u-flex-direction--ro">
          {theme.map((t) => (
            <li key={t} className="ds-u-margin-right--1">
              <Badge variation="info">
                {t}
              </Badge>
            </li>
          ))}
        </ul>
        <span className="ds-u-color--gray">
          Updated {`${updatedDate.toLocaleDateString(undefined, dateOptions)}`}
        </span>
      </div>
      <h3>{title}</h3>
      
      <p className="ds-u-margin-top--0">{description}</p>
      <div>
        <ul className="ds-u-padding--0">
          {keyword.map((k) => (
            <li key={k}>
              <Button className="dc-dataset-searchlist-item--keyword" size="small">
                {k}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DatasetSearchListItem;
