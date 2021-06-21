import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

const Breadcrumb = ({ currentPage, pageTrail = [] }) => {

  const pageTrailContent = pageTrail.map((page) => (
    <li class="dc-c-breadcrumb__list-item">
      <Link to={page.path} class="dc-c-breadcrumb__link">
        <span>{page.title}</span>
      </Link>
    </li>
  ));

  return (
    <nav class="dc-c-breadcrumb ds-u-margin-top--6" aria-label="Breadcrumbs">
      <ol class="dc-c-breadcrumb__list">
        {pageTrailContent}
        {currentPage ? (
          <li class="dc-c-breadcrumb__list-item dc-c-current" aria-current="page">
            <span>{currentPage}</span>
          </li>
        ) : ''}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  currentPage: PropTypes.string.isRequired,
  pageTrail: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }))
}

export default Breadcrumb;