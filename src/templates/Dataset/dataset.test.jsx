import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Dataset from './index';
import * as dataset from "../../tests/fixtures/dataset";
import * as datasetWithDictionary from "../../tests/fixtures/datasetDescribedBy.json"
import { MemoryRouter } from 'react-router-dom';

const rootUrl = 'http://dkan.com/api/1';
jest.mock('axios');

describe('<Dataset />', () => {
  beforeEach(async () => {
    await axios.get.mockImplementation((url) => {
      switch (url) {
        case 'http://dkan.com/api/1/metastore/schemas/dataset/items/4eaa5ebe-62f7-402e-a407-963cd380688b?show-reference-ids':
          return Promise.resolve({data: dataset});
        case 'http://dkan.com/api/1/metastore/schemas/dataset/items/df01c2f8-dc1f-4e79-96cb-8208beaf143c?show-reference-ids':
          return Promise.resolve({data: datasetWithDictionary});
        case 'https://dkan.com/api/1/metastore/schemas/data-dictionary/items/71ec19df-f5ef-5b99-b43b-e566e22670b7?':
          return Promise.resolve({data: {}});
        default:
          return
      }
    });
  })
  test("Renders correctly", async () => {
    await act(async () => {
      jest.useFakeTimers();
      await render(<MemoryRouter>
        <Dataset
          rootUrl={rootUrl}
          id={"4eaa5ebe-62f7-402e-a407-963cd380688b"}
        />
      </MemoryRouter>);
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Product Data for Newly Reported Drugs in the Medicaid Drug Rebate Program 2024-01-08-to-2024-01-14' }));
      expect(screen.queryByText('Data Dictionary')).not.toBeInTheDocument();
    });

  });
  test("Renders Data Dictionary tab if dataset has describedBy attribute", async () => {
    await act(async () => {
      jest.useFakeTimers();
      await render(<MemoryRouter>
        <Dataset
          rootUrl={rootUrl}
          id={"df01c2f8-dc1f-4e79-96cb-8208beaf143c"}
        />
      </MemoryRouter>);
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '2022 General Payment Data' }));
      expect(screen.queryAllByText('Data Dictionary'));
    });
  })
});