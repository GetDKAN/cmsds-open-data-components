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

    expect(screen.getByText("1 - 25 of 69 rows")).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });
});