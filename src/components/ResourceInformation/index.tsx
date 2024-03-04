import React from 'react';
import { ResourceType } from '../../types/dataset';

const ResourceInformation = ({ resource } : {resource: ResourceType}) => {
  const { count, columns } = resource;
  return (
    <div className="dc-c-resource-info-table ds-l-col--12 ds-u-padding-left--0 ds-u-margin-y--2">
      <h3 className="ds-u-font-size--base ds-h3 ds-text-heading--xl">About this Resource</h3>
      <div className="ds-u-display--flex ds-u-text-align--center ds-u-justify-content--center ds-u-md-justify-content--start">
        <div className="ds-u-fill--gray-lightest ds-u-radius ds-u-margin-right--1 ds-u-padding--2">
          <div className="ds-u-padding-top--05">Rows</div>
          <div className="ds-u-font-weight--bold">{count.toLocaleString()}</div>
        </div>
        <div className="ds-u-fill--gray-lightest ds-u-radius ds-u-margin-right--1 ds-u-padding--2">
          <div>
            <div className="ds-u-padding-top--05">Columns</div>
            <div className="ds-u-font-weight--bold">{columns.length.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceInformation;
