import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@cmsgov/design-system';
import ResourceInformation from '../ResourceInformation';
import { DistributionType, ResourceType } from '../../types/dataset';

type ResourcePropsType = {
  distribution: DistributionType,
  resource: ResourceType,
  title: string,
  fileFormat: string
}

const Resource = ({ distribution, resource, title, fileFormat } : ResourcePropsType ) => {
  const sm = useMediaQuery({ minWidth: 0, maxWidth: 767 });
  const fileIcon = 'fa-file-' + fileFormat.toLowerCase();
  return (
    <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
      <h2 className="ds-l-col--12 ds-u-padding-left--0 ds-text-heading--2xl">Resources</h2>
      <span className="ds-u-font-weight--bold ds-u-font-size--lg ds-l-col--12 ds-l-md-col--6 ds-u-padding-left--0">
        <i className={'fa ds-u-color--primary ds-u-padding-right--1 ' + fileIcon}></i>
        {title}
      </span>
      {Object.keys(distribution).length ? (
        <a
          href={distribution.data.downloadURL}
          className="ds-l-col--12 ds-l-md-col--6 ds-u-text-align--right ds-u-margin-top--2 ds-u-md-margin-top--0"
          style={{ order: sm ? '1' : '0' }}
        >
          <Button style={{ width: sm ? '100%' : '' }}>
            <i className="fa fa-file-download ds-u-color--primary ds-u-padding-right--1"></i>
            Download
          </Button>
        </a>
      ) : (
        ''
      )}
      <ResourceInformation resource={resource} />
    </div>
  );
};

export default Resource;