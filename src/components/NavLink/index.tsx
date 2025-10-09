import React, { MouseEventHandler } from 'react';
import { NavLink as RRDNavLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@cmsgov/design-system';
import './NavLink.scss';

type NavLinkPropTypes = {
  link: {
    label: string,
    url: string,
    target?: '_blank' | null
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
        {link?.target === '_blank' &&
          <ExternalLinkIcon className='ds-u-margin-left--05 ds-c-external-link-icon' />
        }
      </RRDNavLink>
    );
  // }
};

export default NavLink;
