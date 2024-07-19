import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetTable from './index';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";

describe('<DatasetTableTab />', () => {
  test("Renders correctly", () => {
    resource.setSort = jest.fn();
    render(
      <DatasetTable
        resource={resource}
        distribution={distribution.distribution[0]}
        rootUrl={"test/api/"}
      />)

    expect(screen.getByText("Data filters: none")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("ds-c-pagination");
  });
  test("Renders data dictionary info banner if prop is provided", () => {
    resource.setSort = jest.fn();
    render(
      <DatasetTable
        resource={resource}
        distribution={distribution.distribution[0]}
        rootUrl={"test/api/"}
        dataDictionaryBanner={true}
      />)
    expect(screen.getByText('Click on the "Data Dictionary" tab above for full column definitions')).toBeInTheDocument();
  });
  test("Does not render data dictionary info banner if prop is not provided", () => {
    resource.setSort = jest.fn();
    render(
      <DatasetTable
        resource={resource}
        distribution={distribution.distribution[0]}
        rootUrl={"test/api/"}
      />)
    expect(screen.queryByText('Click on the "Data Dictionary" tab above for full column definitions')).not.toBeInTheDocument();
  });
});