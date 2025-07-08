import React, { useEffect, useState } from 'react';

interface StoredQuery {
  title?: string;
  description?: string;
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

  return (
    <div>
      <h2>{data.storedQuery?.title}</h2>
      <p>{data.storedQuery?.description}</p>
      {/* Render more fields as needed */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default StoredQueryViewer;
