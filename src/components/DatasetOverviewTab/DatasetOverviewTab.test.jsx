import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetOverview from './index';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import * as dataset from "../../tests/fixtures/dataset.json";
import { MemoryRouter } from 'react-router-dom';

describe('<DatasetOverview />', () => {
  test("Renders correctly", () => {
    resource.setResource = jest.fn();
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetOverview
          resource={resource}
          distributions={distribution.distribution}
          dataset={dataset}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )

    expect(screen.getByText("About this Resource")).toBeInTheDocument();
    // rows and columns
    expect(screen.getByText("69")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
  });
  it("should render Drawer", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }

    render(
      <MemoryRouter>
        <DatasetOverview
          resource={resource}
          distributions={distribution.distribution}
          dataset={dataset}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    expect(screen.getByText("Metadata Definitions")).toBeInTheDocument();
    expect(screen.getByText("What do these fields mean?")).toBeInTheDocument();
  })
});