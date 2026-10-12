import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import DatasetOverview from './index';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import * as dataset from "../../tests/fixtures/dataset.json";
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
    resource.setCSVDistribution = jest.fn();
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    const Wrapped = withQueryProvider(() => (
      <DatasetOverview
        resource={resource}
        distributions={distribution.distribution}
        dataset={dataset}
        metadataMapping={metadataMapping}
        rootUrl="/"
      />
    ));
    renderWithProviders(<Wrapped />);
    expect(screen.getByText("About this Resource")).toBeInTheDocument();
    expect(await screen.findByText("69")).toBeInTheDocument();
    expect(await screen.findByText("22")).toBeInTheDocument();
  });

  test("Renders flat publisher and keyword values", async () => {
    const Wrapped = withQueryProvider(() => (
      <DatasetOverview
        distributions={distribution.distribution}
        dataset={dataset}
        metadataMapping={defaultMetadataMapping}
        rootUrl="/"
        showTags
      />
    ));
    renderWithProviders(<Wrapped />);
    expect(screen.getByText("data.medicaid.gov")).toBeInTheDocument();
    const tagLink = screen.getByRole('link', { name: 'drug rebate program tag - Opens a new search with this filter' });
    expect(tagLink).toHaveAttribute('href', '/search?keyword=drug rebate program');
  });
});
