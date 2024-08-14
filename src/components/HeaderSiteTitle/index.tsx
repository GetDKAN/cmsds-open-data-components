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
  if(logoFilePath) {
    return (
      <NavLink to="/">
        <img src={logoFilePath} alt={logoAltText} />
      </NavLink>
    )
  }
  return(
    <NavLink to="/" className={`${inverse ? "ds-c-link--inverse " : ""} ds-u-font-size--2xl ds-u-lg-font-size--3xl`}>
      {urlTitle}
    </NavLink>
  )
}

export default HeaderSiteTitle;
