import React from 'react';
type pageHeaderProps = {
  headerText: string;
};

const PageHeader = (props: pageHeaderProps) => {
  const { headerText } = props;
  return (
    <div className="ds-l-container ds-u-padding-top--4">
      <div className="ds-l-row">
        <div className="ds-l-md-col--8">
          <h1 className="dc-c-entity__name ds-text-heading--3xl ds-u-margin-bottom--6">
            <span className="ds-u-margin-right--2" data-testid="profile-full-name">
              {headerText}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
