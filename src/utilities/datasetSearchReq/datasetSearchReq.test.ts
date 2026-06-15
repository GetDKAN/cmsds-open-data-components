import axios from 'axios';
import qs from 'qs';
import datasetSearchReq from './index';

jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mock;

const baseArgs = {
  rootUrl: 'https://example.test/api/1',
  selectedTopics: [],
  selectedTags: [],
  fulltext: '',
};

describe('datasetSearchReq', () => {
  beforeEach(() => {
    mockedAxios.mockReset();
    mockedAxios.mockResolvedValue({ data: { results: [], facets: [] } });
  });

  it('calls {rootUrl}/search with GET and returns the response data', async () => {
    const result = await datasetSearchReq(baseArgs);
    expect(mockedAxios).toHaveBeenCalledTimes(1);
    const call = mockedAxios.mock.calls[0][0];
    expect(call.method).toBe('GET');
    expect(call.url).toBe('https://example.test/api/1/search');
    expect(result).toEqual({ results: [], facets: [] });
  });

  it('passes null params for empty selections and skips them via the qs serializer', async () => {
    await datasetSearchReq(baseArgs);
    const call = mockedAxios.mock.calls[0][0];
    expect(call.params).toEqual({ theme: null, keyword: null, fulltext: null });
    // The contract this utility owns: qs.stringify with skipNulls drops them all.
    expect(call.paramsSerializer.serialize(call.params)).toBe('');
  });

  it('joins selectedTopics into a comma-separated theme param', async () => {
    await datasetSearchReq({ ...baseArgs, selectedTopics: ['sales', 'inventory'] });
    const call = mockedAxios.mock.calls[0][0];
    expect(call.params.theme).toBe('sales,inventory');
    expect(call.paramsSerializer.serialize(call.params)).toBe(
      qs.stringify({ theme: 'sales,inventory' }),
    );
  });

  it('joins selectedTags into a comma-separated keyword param', async () => {
    await datasetSearchReq({ ...baseArgs, selectedTags: ['quarterly', 'regional'] });
    const call = mockedAxios.mock.calls[0][0];
    expect(call.params.keyword).toBe('quarterly,regional');
  });

  it('passes fulltext through verbatim when non-empty', async () => {
    await datasetSearchReq({ ...baseArgs, fulltext: 'widgets' });
    const call = mockedAxios.mock.calls[0][0];
    expect(call.params.fulltext).toBe('widgets');
    expect(call.paramsSerializer.serialize(call.params)).toBe('fulltext=widgets');
  });
});
