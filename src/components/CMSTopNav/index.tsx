import React from 'react';
import NavBar from '../NavBar';
import { OrgType, NavLinkArray } from '../../types/misc';
import './cms-topnav.scss';

export type CMSTopNavProps = {
  org: OrgType
  links: NavLinkArray[]
}

const CMSTopNav = (props: CMSTopNavProps) => {
  const { urlTitle, logoAltText, logoFilePath, tagline, url} = props.org;
  return (
    <div className="dkan-c-cms-topnav ds-l-row ds-u-display--flex ds-u-padding-x--5 ds-u-align-items--center ds-u-justify-content--center ds-u-sm-justify-content--start">
      <div className="ds-l-col--12 ds-l-sm-col--5 ds-l-lg-col--7 ds-u-display--flex ds-u-align-items--center ds-u-justify-content--center ds-u-sm-justify-content--start">
        <div className="cms-link-container">
          <a href={url} title={urlTitle}>
            <img src={logoFilePath} alt={logoAltText} />
          </a>
        </div>
        <span className="dkan-c-cms-topnav--tagline">{tagline}</span>
      </div>
      <div className="ds-l-col--7 ds-l-lg-col--5">
        <NavBar
          links={props.links}
          menuName="CMS Main Header"
          menuId="cms-topnav"
          menuClasses="ds-u-display--flex ds-u-flex-direction--row dc-c-header--links ds-u-font-size--sm"
        />
      </div>
    </div>
  );
}

export default CMSTopNav;
