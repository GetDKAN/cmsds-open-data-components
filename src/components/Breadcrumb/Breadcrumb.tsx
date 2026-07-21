import React from 'react';
import { Link } from 'react-router-dom';
import './breadcrumb.scss';

type PageTrail = {
  path: string,
  title: string,
}

const Breadcrumb = ({ currentPage, pageTrail = [] } : {currentPage: string, pageTrail: Array<PageTrail>} ) => {
  const pageTrailContent = pageTrail.map((page) => (
    <li key={page.path} className="dc-c-breadcrumb__list-item">
      <Link to={page.path} className="dc-c-breadcrumb__link">
        <span>{page.title}</span>
      </Link>
    </li>
  ));

  return (
    <nav className="dc-c-breadcrumb ds-u-margin-top--6" aria-label="Breadcrumbs">
      <ol className="dc-c-breadcrumb__list">
        {pageTrailContent}
        {currentPage ? (
          <li className="dc-c-breadcrumb__list-item dc-c-current" aria-current="page">
            <span>{currentPage}</span>
          </li>
        ) : (
          ''
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
