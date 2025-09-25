import React, { useContext } from 'react';
import { DistributionType } from '../../types/dataset';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';
import { acaToParams } from '../../utilities/aca';
import { ACAContext } from '../../utilities/ACAContext';

const ResourceInformation = ({ distribution, rootUrl } : {distribution: DistributionType, rootUrl: string}) => {
  const { ACA } = useContext(ACAContext);
  const { data: resource } = useQuery({
    queryKey: ['resource-information', distribution.identifier],
    queryFn: () => axios.get(`${rootUrl}/datastore/query/${distribution.identifier}?${qs.stringify(acaToParams({results: false, schema: false}, ACA))}`).then(res => res.data)
  });

  return (
    <div className="dc-c-resource-info-table ds-l-col--12 ds-u-padding-left--0 ds-u-margin-y--2">
      <h3 className="ds-u-font-size--base ds-text-heading--xl ds-text-heading--xl">About this Resource</h3>
      <div className="ds-u-display--flex ds-u-text-align--center ds-u-justify-content--center ds-u-md-justify-content--start">
        <div className="ds-u-fill--gray-lightest ds-u-radius ds-u-margin-right--1 ds-u-padding--2">
          <div className="ds-u-padding-top--05">Rows</div>
            <div className="ds-u-font-weight--bold">{resource?.count?.toLocaleString()}</div>
        </div>
        <div className="ds-u-fill--gray-lightest ds-u-radius ds-u-margin-right--1 ds-u-padding--2">
          <div>
            <div className="ds-u-padding-top--05">Columns</div>
            <div className="ds-u-font-weight--bold">{resource?.query?.properties?.length?.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceInformation;
