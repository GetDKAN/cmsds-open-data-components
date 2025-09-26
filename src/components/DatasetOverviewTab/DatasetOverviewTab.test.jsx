import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetOverview from './index';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import * as dataset from "../../tests/fixtures/dataset.json";
import { MemoryRouter } from 'react-router-dom';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';
import axios from 'axios';

jest.mock('axios');

describe('<DatasetOverview />', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        count: 69,
        query: { properties: Array(22) }
      }
    });
  });

  test("Renders correctly", async () => {
    resource.setResource = jest.fn();
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    const Wrapped = withQueryProvider(() => (
      <MemoryRouter>
        <DatasetOverview
          resource={resource}
          distributions={distribution.distribution}
          dataset={dataset}
          metadataMapping={metadataMapping}
          rootUrl="/"
        />
      </MemoryRouter>
    ));
    render(<Wrapped />);
    expect(screen.getByText("About this Resource")).toBeInTheDocument();
    expect(await screen.findByText("69")).toBeInTheDocument();
    expect(await screen.findByText("22")).toBeInTheDocument();
  });
});
