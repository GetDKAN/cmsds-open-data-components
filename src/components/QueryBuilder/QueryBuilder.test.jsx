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

    expect(screen.getByText("Data filters: none")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Add filter" })).toBeInTheDocument();
  });
  test("Adds and removes a row when the buttons are clicked", async () => {
    render(
      <QueryBuilder
        resource={resource}
        id={"d60b31aa-bfa8-527e-9b50-6c3f972ee9a9"}
      />);

    await act(() => {
      screen.getByRole("button", { name: "+ Add filter" }).click();
    });
    expect(screen.queryAllByRole("group")).toHaveLength(2);

    await act(() => {
      screen.getAllByRole("button", { name: "Delete filter" })[0].click();
    });
    expect(screen.queryAllByRole("group")).toHaveLength(1);
  });
});