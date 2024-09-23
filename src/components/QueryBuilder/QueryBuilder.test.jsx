import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
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
  test("Updates the browser URL params when a filter is added", async () => {
    // Actual window object doesn't seem to be working well in jest, so we are mocking
    // the window.history.pushstate function to see that it has been called
    window.history.pushState = jest.fn()
    render(
      <QueryBuilder
        resource={resource}
        id={"d60b31aa-bfa8-527e-9b50-6c3f972ee9a9"}
        setPage={jest.fn()}
        setOffset={jest.fn()}
      />);
    
    // Update text input
    const valueInput = screen.getByRole('textbox');
    await act(async () => {
      await userEvent.type(valueInput, "test");
    });
    expect(valueInput).toHaveValue('test');
    // Apply the filter
    await act(() => {
      screen.getByRole("button", { name: "Apply filters" }).click();
    });
    // Check that the URL params were updated
    expect(window.history.pushState).toHaveBeenNthCalledWith(1, {}, "", expect.stringContaining("conditions[0][property]=ndc1&conditions[0][value]=test&conditions[0][operator]=%3D"))
  });
});