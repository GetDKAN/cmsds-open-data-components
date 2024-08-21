import React from 'react';
import { NavLink } from 'react-router-dom';
import { OrgType } from '../../types/misc';

export type HeaderSiteTitleProps = {
  inverse?: boolean
  org: OrgType
}

const HeaderSiteTitle = (props: HeaderSiteTitleProps) => {
  const inverse = props.inverse;
  const { logoFilePath, logoAltText, urlTitle } = props.org;
  const classList = "ds-u-padding-y--3 dc-c-site-title print-padding-top--0 print-padding-bottom--0 ds-u-text-align--center ds-u-md-text-align--left";
  if(logoFilePath) {
    return (
      <div className={classList}>
        <NavLink to="/">
          <img src={logoFilePath} alt={logoAltText} />
        </NavLink>
      </div>
      
    )
  }
  return(
    <div className={classList}>
      <NavLink to="/" className={`${inverse ? "ds-c-link--inverse " : ""} ds-u-font-size--2xl ds-u-lg-font-size--3xl`}>
        {urlTitle}
      </NavLink>
    </div>
    
  )
}

export default HeaderSiteTitle;
