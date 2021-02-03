import React from "react";
import { useDrupalEntity } from '@civicactions/data-catalog-services';

const DrupalPage = ({ path, rootURL, uuid, entityType, bundle, options }) => {
  const {entity} = useDrupalEntity(rootURL, uuid, entityType, bundle, options);
  const bodyContent = Object.keys(entity).length ? (
    <div className="dc-page">
      <h1>{entity.attributes.title}</h1>
      <div className="dc-page-content" dangerouslySetInnerHTML={{ __html: entity.attributes.body.processed }} />
    </div>
  ) : '';
    return (
      <>
      {bodyContent}
      </>
  );
}
export default DrupalPage;