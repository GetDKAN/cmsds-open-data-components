import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@cmsgov/design-system';
import ResourceInformation from '../ResourceInformation';
import { DistributionType, ResourceType } from '../../types/dataset';

type ResourcePropsType = {
  distributions: DistributionType[],
  resource: ResourceType,
  title: string
}

const Resource = ({ distributions, resource, title } : ResourcePropsType ) => {
  function getFormatType(dist : DistributionType) {
    if(dist.data.format) {
      return dist.data.format == "xlsx" ? "excel" : dist.data.format.toLowerCase()
    }
    if(dist.data.mediaType) {
      const mediaType = dist.data.mediaType.split('/');
      if (mediaType.length && mediaType[1]) {
        return mediaType[1].toLowerCase();
      }
    }
    if(dist.data["%Ref:downloadURL"].length && dist.data["%Ref:downloadURL"][0].data) {
      if(dist.data["%Ref:downloadURL"][0].data.mimeType) {
        const mimeType = dist.data["%Ref:downloadURL"][0].data.mimeType.split("/");
        if (mimeType.length && mimeType[1]) {
          return mimeType[1].toLowerCase();
        }
      }
    }
    return '';
  }
  
  const sm = useMediaQuery({ minWidth: 0, maxWidth: 767 });
  return (
    <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
      <h2 className="ds-l-col--12 ds-u-padding-left--0 ds-text-heading--2xl">Resources</h2>
      <div>
        {distributions.length &&
          <ul className="ds-c-list ds-c-list--bare">
            {
              distributions.map((dist) => {
                return (
                  <li key={dist.identifier}>
                    <span className="ds-u-font-weight--bold ds-u-font-size--lg ds-l-col--12 ds-l-md-col--6 ds-u-padding-left--0">
                      <i className={'fa ds-u-color--primary ds-u-padding-right--1 ' + 'fa-file-' + getFormatType(dist)}></i>
                      {title}
                    </span>
                    <a
                      href={dist.data.downloadURL}
                      className="ds-l-col--12 ds-l-md-col--6 ds-u-text-align--right ds-u-margin-top--2 ds-u-md-margin-top--0"
                      style={{ order: sm ? '1' : '0' }}
                    >
                      <Button style={{ width: sm ? '100%' : '' }}>
                        <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i>
                        Download
                      </Button>
                    </a>
                    <ResourceInformation resource={resource} />
                  </li>
                )
              })
            }
          </ul>
        }
      </div>
    </div>
  );
};

export default Resource;