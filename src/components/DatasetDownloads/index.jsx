import React from 'react';
import PropTypes from 'prop-types';

const DatasetDownloads = ({ downloadURL, type }) => {
  return(
    <div className="ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border ds-u-border--1">
      <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-top--0 ds-u-margin-bottom--2 ds-u-padding-bottom--2 ds-u-border ds-u-border-bottom--1">Downloads</h2>
      <p className="ds-u-margin-bottom--1 ds-u-color--gray">Resource</p>
      <a href={downloadURL}>Download this resource ({type.toUpperCase()})</a>
    </div>
  );
}

DatasetDownloads.propTypes = {
  downloadURL: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default DatasetDownloads;
