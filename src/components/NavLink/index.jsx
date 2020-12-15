import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import validator from 'validator';

const NavLink = ({link, className, wrapLabel}) => {
  const innerHtml = wrapLabel ? <span>{link.label}</span> : link.label;

  if(validator.isURL(link.url, { require_protocol: true })) {
    return (
      <a
        className={className}
        href={link.url}
      >
        {innerHtml}
      </a>
    )
  } else {
    return (
      <Link
        className={className}
        to={link.url}
      >
        {innerHtml}
      </Link>
    )
  }
}

NavLink.defaultProps = {
  wrapLabel: false,
  className: null,
}

NavLink.propTypes = {
  link: PropTypes.shape({
    url: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  className: PropTypes.string,
  /**
   * Will wrap the link label in a span for help with styling.
   */
  wrapLabel: PropTypes.bool,
}

export default NavLink;