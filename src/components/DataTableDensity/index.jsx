import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@cmsgov/design-system';

const DataTableDensity = ({ setTablePadding, tablePadding }) => {
  return (
    <div className="ds-u-display--flex">
      <span>Display density:</span>
      <ul>
        <li>
          <Button
            onClick={() => setTablePadding('ds-u-padding-y--0')}
            size="small"
            variation="transparent"
            className={tablePadding === 'ds-u-padding-y--0' ? 'ds-u-font-weight--bold' : ''}
          >
            <span className="ds-u-visibility--screen-reader">Table padding</span> Tight
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setTablePadding('ds-u-padding-y--1')}
            size="small"
            variation="transparent"
            className={tablePadding === 'ds-u-padding-y--1' ? 'ds-u-font-weight--bold' : ''}
          >
            <span className="ds-u-visibility--screen-reader">Table padding</span> Normal
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setTablePadding('ds-u-padding-y--2')}
            size="small"
            variation="transparent"
            className={tablePadding === 'ds-u-padding-y--2' ? 'ds-u-font-weight--bold' : ''}
          >
            <span className="ds-u-visibility--screen-reader">Table padding</span> Expanded
          </Button>
        </li>
      </ul>
    </div>
  );
};

DataTableDensity.propTypes = {
  setTablePadding: PropTypes.func.isRequired,
};

export default DataTableDensity;
