import React from 'react';
import { Button } from '@cmsgov/design-system';
import './page-not-found.scss';

const PageNotFound = ({ siteUrl, content }) => {
  return (
    <section className="dc-page-not-found ds-l-container">
      {content ? (
        content
      ) : (
        <>
          <h1 className="ds-text-heading--3xl ds-u-color--primary ds-u-font-weight--bold ds-u-margin-bottom--2">Page Not Found</h1>
          <p className="dc-page-not-found--measure ds-u-color--black ds-u-margin-top--0 ds-u-margin-bottom--4">
            Sorry, we can't find this page. It may have moved or been renamed. Check that the address is correct and update any bookmarks when you find the page you want.
          </p>
          <Button
            variation="solid"
            href={siteUrl || "/"}
          >
            Home
          </Button>
        </>
      )}
    </section>
  );
};

export default PageNotFound;
