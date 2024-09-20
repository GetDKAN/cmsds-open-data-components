import React from 'react';
import './header-tagline.scss';

export type HeaderTaglineProps = {
  tagline: string;
  
}

const HeaderTagline = (props: HeaderTaglineProps) => {
  return (
    <span className="dkan-c-cms-topnav--tagline ds-u-valign--middle	ds-u-padding-left--2">
      {props.tagline}
    </span>
  );
};

export default HeaderTagline;
