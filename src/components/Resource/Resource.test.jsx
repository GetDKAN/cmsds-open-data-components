import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resource from './index';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";

describe('<Resource />', () => {
  test("Renders correctly", () => {
    resource.setResource = jest.fn();
    resource.setManual = jest.fn()
    render(
      <Resource
        resource={resource}
        distributions={distribution.distribution}
        title={"Test title"}
        fileFormat={"csv"}
      />
    )

    expect(screen.getByText("Test title (CSV)")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Download Test title csv"})).toBeInTheDocument();
  });
});