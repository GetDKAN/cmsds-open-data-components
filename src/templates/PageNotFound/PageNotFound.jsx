import React from 'react';

const PageNotFound = ({ siteUrl, content }) => {
  return (
    <section className="ds-l-container ds-u-padding-top--3">
      {content ? (
        content
      ) : (
        <>
          <h1 className="ds-text-heading--4xl">Error: Page not found</h1>
          <p>
            We're sorry, but there is no {siteUrl} web page that matches your entry. You may have
            been directed here because:
          </p>
          <ol>
            <li>The address you typed contains a typo;</li>
            <li>The requested page may have expired or;</li>
            <li>The requested page may have been moved.</li>
          </ol>
          <p>
            <span className="ds-u-font-weight--bold">Note:</span> If you were using a bookmark,
            please reset it once you find the correct page.
          </p>
        </>
      )}
    </section>
  );
};

export default PageNotFound;
