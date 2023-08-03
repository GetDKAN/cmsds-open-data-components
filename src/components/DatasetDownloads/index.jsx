import React from 'react';
import PropTypes from 'prop-types';

const DatasetDownloads = ({ dataDictionaryURL, dataDictionaryType, distributions }) => {
  function trimDataDictionaryType() {
    let splitDataDictionaryType = dataDictionaryType.split('/');
    let type = splitDataDictionaryType.length > 1 ? splitDataDictionaryType[1] : splitDataDictionaryType[0];
    return type.toUpperCase()
  }

  function getFormatType(dist) {
    if(dist.data.format) {
      return dist.data.format.toUpperCase()
    }
    if(dist.data.mediaType) {
      const mediaType = dist.data.mediaType.split('/');
      if (mediaType.length && mediaType[1]) {
        return mediaType[1].toUpperCase();
      }
    }
    if(dist.data["%Ref:downloadURL"].length && dist.data["%Ref:downloadURL"][0].data) {
      if(dist.data["%Ref:downloadURL"][0].data.mimeType) {
        const mimeType = dist.data["%Ref:downloadURL"][0].data.mimeType.split("/");
        if (mimeType.length && mimeType[1]) {
          return mimeType[1].toUpperCase();
        }
      }
    }
    return '';
  }

  return (
    <div className="ds-u-margin-bottom--3 ds-u-padding--2 ds-u-border ds-u-border--1 dc-c-dataset-downloads">
      <h2 className="ds-u-color--primary ds-u-font-size--h3 ds-u-margin-top--0 ds-u-margin-bottom--2 ds-u-padding-bottom--2 ds-u-border ds-u-border-bottom--1">
        Downloads
      </h2>
      {(distributions.length || (dataDictionaryURL && dataDictionaryType)) &&
       <ul className="ds-c-list ds-c-list--bare">
         {
          distributions.map((dist) => (
            <li className="ds-u-padding-bottom--1" key={dist.identifier}>
              <a href={dist.data.downloadURL} className="ds-u-word-break">
                {getFormatType(dist)}
                {' '}
                Resource File
              </a>
            </li>
          ))
         }
         {(dataDictionaryURL && dataDictionaryType) &&
            <li>
              <a href={dataDictionaryURL}>
                Data Dictionary ({trimDataDictionaryType()})
              </a>
            </li>
         }
       </ul>
      }
    </div>
  );
};


export default DatasetDownloads;
