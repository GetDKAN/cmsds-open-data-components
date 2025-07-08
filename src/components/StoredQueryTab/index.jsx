import React from 'react';
type DatasetStoredQueryProps = {
  id: String;
  rootUrl: String;
  apiUrl: string;
  additionalParams: {
    ACA: string,
  }
};


const StoredQueryViewer = ({ id }: DatasetStoredQueryProps) => {


  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/1/stored-query/items/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
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
