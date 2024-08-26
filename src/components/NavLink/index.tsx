import React, { MouseEventHandler } from 'react';
import { NavLink as RRDNavLink } from 'react-router-dom';
import './NavLink.scss';

type NavLinkPropTypes = {
  link: {
    label: string,
    url: string,
  },
  className: string | null,
  wrapLabel: boolean,
  clickHandler?: null | Function
}

const NavLink = ({ link, className = null, wrapLabel = false, clickHandler } : NavLinkPropTypes) => {
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;

    return (
      <RRDNavLink
        className={({ isActive }) => (isActive ? `dc-c-active-link ${className}` : `${className}`)}
        to={link.url}
        onClick={clickHandler ? clickHandler as MouseEventHandler : undefined}
      >
        {innerHtml}
      </RRDNavLink>
    );
  // }
};

export default NavLink;
