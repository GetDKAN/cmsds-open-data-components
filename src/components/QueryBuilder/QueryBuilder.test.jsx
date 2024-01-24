import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QueryBuilder from './index';
import * as resource from "../../tests/fixtures/resource.json";

describe('<QueryBuilder />', () => {
  beforeEach(() => {
    resource.setConditions = jest.fn();
  })
  test("Renders correctly", () => {
    render(
      <QueryBuilder
        resource={resource}
        id={"d60b31aa-bfa8-527e-9b50-6c3f972ee9a9"}
      />);

    expect(screen.getByText("Add a filter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Add another filter" })).toBeInTheDocument();
  });
  test("Adds and removes a row when the buttons are clicked", async () => {
    render(
      <QueryBuilder
        resource={resource}
        id={"d60b31aa-bfa8-527e-9b50-6c3f972ee9a9"}
      />);

    await act(() => {
      screen.getByRole("button", { name: "+ Add another filter" }).click();
    });
    expect(screen.getByRole("group")).toBeInTheDocument();

    await act(() => {
      screen.getByRole("button", { name: "Delete filter" }).click();
    });
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});