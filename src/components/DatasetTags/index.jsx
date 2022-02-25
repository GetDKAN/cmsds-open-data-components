import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

const DatasetTags = ({ keywords }) => {
  return (
    <div className="dc-c-dataset-tags ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border ds-u-border--1">
      <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-top--0 ds-u-margin-bottom--2">
        Tags
      </h2>
      {keywords &&
        keywords.map((k) => (
          <Link
            key={k.identifier}
            to={`/datasets?keyword[]=${k.data}`}
            className="dc-c-dataset-tags--tag ds-u-color--base ds-u-font-size--small ds-u-text-decoration--none ds-u-margin-right--1 ds-u-margin-bottom--1 ds-u-padding-x--2 ds-u-padding-y--1 ds-u-radius"
          >
            {k.data}
          </Link>
        ))}
    </div>
  );
};

DatasetTags.propTypes = {
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.string.isRequired,
      identifier: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DatasetTags;
