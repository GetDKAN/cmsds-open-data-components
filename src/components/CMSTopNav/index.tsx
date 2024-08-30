import React from 'react';
import { NavLink } from 'react-router-dom';
import HeaderTagline from '../HeaderTagline';
import HeaderNavIconLink from '../HeaderNavIconLink';
import { OrgType, NavLinkArray } from '../../types/misc';
import './cms-topnav.scss';

export type CMSTopNavProps = {
  org: OrgType
  links: NavLinkArray[]
}

const CMSTopNav = (props: CMSTopNavProps) => {
  const { links, org } = props;
  const { urlTitle, logoAltText="", logoFilePath="", tagline, url} = org;
  return (
    <div className="dkan-c-cms-topnav ds-u-display--flex ds-u-padding-x--5 ds-u-align-items--center ds-u-justify-content--center ds-u-lg-justify-content--start">
      <div className="ds-l-col--12 ds-l-md-col--5 ds-l-lg-col--7 ds-u-display--flex ds-u-align-items--center ds-u-justify-content--center ds-u-md-justify-content--start">
        <HeaderNavIconLink
          url={url}
          urlTitle={urlTitle}
          logoAltText={logoAltText}
          logoFilePath={logoFilePath}
        />
        <HeaderTagline tagline={tagline} />
      </div>
      <div className="ds-l-col--7 ds-l-lg-col--5 ds-u-display--none ds-u-md-display--inline-flex ds-u-align-items--center ds-u-justify-content--end">
        <nav className="dkan-c-cms-topnav--menu">
          <ul className="ds-u-justify-content--end ds-u-md-align-items--center ds-u-flex-direction--column ds-u-md-flex-direction--row">
            {links.map((link: any) => {
              return(
                <li className="ds-u-margin-x--05 ds-u-font-size--sm">
                  <NavLink to={link.url}>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default CMSTopNav;
