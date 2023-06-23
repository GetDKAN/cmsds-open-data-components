import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRDNavLink } from 'react-router-dom';
import './NavLink.scss';
// import validator from 'validator';

const NavLink = ({ link, className, wrapLabel }) => {
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;

  // if (validator.isURL(link.url, { require_protocol: true })) {
  //   return (
  //     <a className={className} href={link.url}>
  //       {innerHtml}
  //     </a>
  //   );
  // } else {
    return (
      <RRDNavLink
        className={({ isActive }) => (isActive ? `dc-c-active-link ${className}` : `${className}`)}
        to={link.url}
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
