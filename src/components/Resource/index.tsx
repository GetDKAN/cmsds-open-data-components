import React from 'react';
import DOMPurify from 'dompurify';
import { useMediaQuery } from 'react-responsive';
import ResourceInformation from '../ResourceInformation';
import { DistributionType, ResourceType } from '../../types/dataset';
import { getFormatType } from '../../utilities/format';
import './Resource.scss';

type ResourcePropsType = {
  distributions: DistributionType[],
  resource: ResourceType,
  title: string
}

const Resource = ({ distributions, resource, rootUrl, title } : ResourcePropsType ) => {
  const sm = useMediaQuery({ minWidth: 0, maxWidth: 767 });
  return (
    <div className="ds-u-display--flex ds-u-flex-wrap--wrap">
      <h2 className="ds-l-col--12 ds-u-padding-left--0 ds-text-heading--2xl">Resources</h2>
      {distributions.length ? ( 
        <ul className="ds-c-list ds-c-list--bare dc-c-resource-full-width">
          {
            distributions.map((dist) => {
              const fileFormat = getFormatType(dist)
              return (
                <li key={dist.identifier} className={`ds-u-display--flex ds-u-flex-wrap--wrap ${fileFormat !== "csv" && "ds-u-margin-bottom--2"}`}>
                  <div className="ds-u-font-weight--bold ds-u-font-size--lg ds-l-col--12 ds-l-md-col--6 ds-u-padding-left--0 ds-u-align-items--center ds-u-display--flex">
                    <i className={'fa ds-u-color--primary ds-u-padding-right--1 ds-u-font-size--3xl ' + 'fa-file-' + (fileFormat == "xlsx" ? "xls" : fileFormat)}></i>
                    <p className="ds-u-margin-top--0">{dist.data.title ? dist.data.title : title}{" (" + fileFormat.toUpperCase() + ")"}</p>
                  </div>
                  <div className="ds-l-col--12 ds-l-md-col--6 ds-u-text-align--center ds-u-md-text-align--right ds-u-margin-top--2 ds-u-md-margin-top--0">
                    <a
                      href={dist.data.downloadURL}
                      style={{
                        order: sm ? '1' : '0',
                        width: sm ? '100%' : 'auto'
                      }}
                      aria-label={`Download ${dist.data.title || title} ${fileFormat}`}
                      className="ds-c-button"
                    >
                      <i className="fa fa-file-download ds-u-padding-right--1"></i>
                      Download
                    </a>
                  </div>
                  {dist.data.description && (
                    <div className={'ds-u-measure--wide ds-u-margin-bottom--7'}>
                      <div className="dc-c-metadata-description ds-u-margin--0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dist.data.description) }}/>
                    </div>
                  )}
                  {fileFormat === "csv" && <ResourceInformation rootUrl={rootUrl} distribution={dist} />}
                </li>
              )
            })
          }
        </ul>
      ) : (
        <div className="ds-u-margin-bottom--2">No resources have been added to this dataset.</div>
      )}
    </div>
  );
};

export default Resource;