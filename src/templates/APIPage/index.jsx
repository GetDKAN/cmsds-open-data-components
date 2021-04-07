import React from 'react';
import { ApiDocs } from "@civicactions/data-catalog-components";

const APIPage = () => (
  <section className="ds-l-container">
    <ApiDocs endpoint={process.env.REACT_APP_ROOT_URL} />
  </section>
);

export default APIPage;
