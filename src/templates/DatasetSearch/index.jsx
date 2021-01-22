import React from 'react';
import { useSearchAPI } from '@civicactions/data-catalog-services';
import { TextField, Dropdown } from '@cmsgov/design-system'
import DatasetSearchListItem from '../../components/DatasetSearchListItem';

const DatasetSearch = () => {
  const { items, totalItems } = useSearchAPI("http://payments.localtest.me/api/1")
  console.log(items)
  return(
    <section className="ds-l-container">
      <h1>Datasets</h1>
      <div className="ds-l-row">
        <div className="ds-l-col--8">
          <TextField />
          <p>Showing: {totalItems}</p>
          <ol className="dc-dataset-search-list ds-u-padding--0">
            {items.map((item) => (
              <li className="ds-u-padding--0">
                <DatasetSearchListItem item={item} />
              </li>
            ))}
          </ol>
          <p>pagination</p>
        </div>
        <div className="ds-l-col--4">
          <p className="ds-u-border--1">Sort drop down</p>
          <h2 className="ds-u-border--1">categories</h2>
          <h2 className="ds-u-border--1">tags</h2>
        </div>
      </div>
    </section>
  );
}

export default DatasetSearch;
