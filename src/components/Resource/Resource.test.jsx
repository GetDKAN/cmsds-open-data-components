import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resource from './index';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import * as distributionWithCustomTitle from "../../tests/fixtures/distributionWithTitle.json";

describe('<Resource />', () => {
  test("Renders correctly", () => {
    resource.setResource = jest.fn();
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
  test("Renders custom title and description if they exist", () => {
    resource.setResource = jest.fn();
    render(
      <Resource
        resource={resource}
        distributions={distributionWithCustomTitle.distribution}
        title={"Test title"}
        fileFormat={"csv"}
      />
    )
    expect(screen.getByText("Test Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Test Custom Description")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Download Test title csv"})).toBeInTheDocument();
  })
});