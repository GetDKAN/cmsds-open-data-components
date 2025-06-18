import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatatableHeader from './index';
import * as resource from "../../tests/fixtures/resource.json";

describe('<DatatableHeader />', () => {
  test("Renders correctly", () => {
    render(
      <DatatableHeader
        resource={resource}
        downloadUrl={"https://test.gov/test.csv"}
      />);

    const el = screen.getByText('Displaying', {exact: false})
    expect(el.textContent).toEqual("Displaying 1 - 25 of 69 results");
    expect(screen.getByText("Copy link to filtered data")).toBeInTheDocument();
    expect(screen.getByText("Download filtered data (CSV)")).toBeInTheDocument();
    expect(screen.getByText("Download full dataset (CSV)")).toBeInTheDocument();
    expect(screen.queryByText("Download stored query data (CSV)")).not.toBeInTheDocument();
  });

   test("Renders correctly with Stored Query Button", () => {
    render(
      <DatatableHeader
        resource={resource}
        downloadUrl={"https://test.gov/test.csv"}
        showCopyLinkButton={false}
        showDownloadFilteredDataButton={false}
        showDownloadFullDataButton={false}
        showStoredQueryDownloadButton={true}
      />);

    const el = screen.getByText('Displaying', {exact: false})
    expect(el.textContent).toEqual("Displaying 1 - 25 of 69 results");
    expect(screen.getByText("Download stored query data (CSV)")).toBeInTheDocument();
    expect(screen.queryByText("Copy link to filtered data")).not.toBeInTheDocument();
    expect(screen.queryByText("Download filtered data (CSV)")).not.toBeInTheDocument();
    expect(screen.queryByText("Download full dataset (CSV)")).not.toBeInTheDocument();
  });
});
