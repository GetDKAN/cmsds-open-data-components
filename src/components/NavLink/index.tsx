import React, { MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRDNavLink } from 'react-router-dom';
import './NavLink.scss';

type NavLinkPropTypes = {
  link: {
    label: string,
    url: string,
  },
  className: string,
  wrapLabel: boolean,
  clickHandler?: null | Function
}

const NavLink = ({ link, className, wrapLabel, clickHandler } : NavLinkPropTypes) => {
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

NavLink.defaultProps = {
  wrapLabel: false,
  className: null,
};

NavLink.propTypes = {
  link: PropTypes.shape({
    url: PropTypes.string,
    label: PropTypes.string,
    nonReactLink: PropTypes.bool,
  }).isRequired,
  className: PropTypes.string,
  /**
   * Will wrap the link label in a span for help with styling.
   */
  wrapLabel: PropTypes.bool,
};

export default NavLink;
