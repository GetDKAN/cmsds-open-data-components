import React, { useEffect, useState } from 'react';
import TransformedDate from '../TransformedDate';

interface StoredQuery {
  title?: string;
  description?: string;
  uuid?: string;
  identifier?: string;
  modified?: string;
}

interface StoredQueryApiResponse {
  storedQuery?: StoredQuery;
}

interface StoredQueryViewerProps {
  id: string;
}

const StoredQueryViewer: React.FC<StoredQueryViewerProps> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StoredQueryApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/1/stored-query/items/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json: StoredQueryApiResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found.</div>;
const storedQueryUrl = `/stored-query/${data.storedQuery?.uuid}`;
  return (
     <li className="dc-c-list-item ds-u-padding-top--4">
      <div className="dc-c-searchlist-item ds-u-border-bottom--1 ds-u-padding-bottom--3">
        <div className="ds-l-row ds-u-align-items--start">
          <span id={`dataset-${data.storedQuery?.identifier}-updated-date`} className="ds-l-col--12 ds-u-text-align--left ds-text-heading--sm  ds-u-padding-top--0">
            Updated <TransformedDate date={data.storedQuery?.modified} />
          </span>
          <h2 className="ds-l-col--12 ds-text-heading--2xl"><a href={storedQueryUrl} target="_blank">{data.storedQuery?.title}</a></h2>
        </div>
        <div className="ds-l-row">
          <div className="ds-l-col--12">
           <p>{data.storedQuery?.description}</p></div>
        </div>
      </div>
    </li>
  );
};

export default StoredQueryViewer;
