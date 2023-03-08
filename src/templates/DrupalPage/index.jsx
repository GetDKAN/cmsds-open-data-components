import React from 'react';
import { useDrupalEntity } from '@civicactions/data-catalog-services';

const DrupalPage = ({ path, rootUrl, uuid, entityType, bundle, options }) => {
  const { entity } = useDrupalEntity(rootUrl, uuid, entityType, bundle, options);
  const bodyContent = Object.keys(entity).length ? (
    <div className="dc-page ds-l-container">
      <h1>{entity.attributes.title}</h1>
      <div
        className="dc-page-content"
        dangerouslySetInnerHTML={{ __html: entity.attributes.body.processed }}
      />
    </div>
  ) : (
    ''
  );
  return <>{bodyContent}</>;
};
export default DrupalPage;
