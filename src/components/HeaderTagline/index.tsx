import React from 'react';
import './header-tagline.scss';

const HeaderTagline = ({tagline} : {tagline: string}) => {
  return (
    <span className="dkan-c-cms-topnav--tagline ds-u-valign--middle	ds-u-padding-left--2">
      {tagline}
    </span>
  );
};

export default HeaderTagline;
