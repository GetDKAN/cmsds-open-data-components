import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import DataDictionary from './index';
import * as datasetDictionary from "../../tests/fixtures/dataDictionary.json";
import * as siteWideDataDictionary from "../../tests/fixtures/sitewideDataDictionary.json"
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('<DataDictionary />', () => {
  beforeEach(async () => {
    await axios.get.mockImplementation((url) => {
      switch (url) {
        case 'http://dkan.com/api/1/metastore/schemas/data-dictionary/items/sitewide-data-dictionary':
          return Promise.resolve({data: siteWideDataDictionary});
        case 'http://dkan.com/api/1/metastore/schemas/data-dictionary/items/71ec19df-f5ef-5b99-b43b-e566e22670b7?':
          return Promise.resolve({data: datasetDictionary});
        default:
          return
      }
    });
  })
  test("Renders sitewide dictionary correctly", async () => {
    await render(<MemoryRouter>
      <DataDictionary
        datasetSitewideDictionary={siteWideDataDictionary.data.fields}
        title={"Sitewide test title"}
      />
    </MemoryRouter>);

    expect(screen.getByRole('heading', {name: 'Sitewide test title'}));
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
    expect(screen.queryByText('Download Dictionary JSON')).not.toBeInTheDocument();
  });
  test("Renders dataset dictionary correctly", async () => {
    await act(async () => {
      await render(<MemoryRouter>
        <DataDictionary
          datasetDictionaryEndpoint='http://dkan.com/api/1/metastore/schemas/data-dictionary/items/71ec19df-f5ef-5b99-b43b-e566e22670b7'
          title="Dataset test title"
        />
      </MemoryRouter>);
    });

    expect(screen.getByRole('heading', {name: 'Dataset test title'}));
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(screen.queryByText('View Dictionary JSON')).toBeInTheDocument();
      expect(screen.queryByText('Format')).not.toBeInTheDocument();
      expect(screen.queryByText('Description')).toBeInTheDocument();
    });
  });
});