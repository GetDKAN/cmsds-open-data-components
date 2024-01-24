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
        distribution={distribution}
        rootUrl={"test/api/"}
      />)

    expect(screen.getByText("Add a filter")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("ds-c-pagination");
  });
});