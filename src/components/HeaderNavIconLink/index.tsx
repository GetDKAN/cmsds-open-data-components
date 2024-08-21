import React from 'react';

import "./header-nav-icon-link.scss";

export type HeaderNavIconLinkProps = {
  url: string;
  urlTitle: string;
  logoFilePath: string;
  logoAltText: string;
  backArrow?: boolean;
}

const HeaderNavIconLink = (props: HeaderNavIconLinkProps) => {
  const { url, urlTitle, logoFilePath, logoAltText, backArrow } = props;
  return(
    <div className={`dkan-c-header-nav-icon-link ${backArrow ? 'show-back-arrow' : ''} ds-u-valign--middle	`}>
      <a href={url} title={urlTitle}>
        <img src={logoFilePath} alt={logoAltText} />
      </a>
    </div>
  );
}

export default HeaderNavIconLink;
