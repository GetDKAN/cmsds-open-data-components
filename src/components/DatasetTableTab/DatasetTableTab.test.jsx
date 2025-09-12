import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTableStateWrapper from './DataTableStateWrapper';
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";
import DataTableContext from "../../templates/Dataset/DataTableContext";

describe('<DatasetTableTab />', () => {
  window.scrollTo = jest.fn();
  beforeEach(() => {
    resource.setSort = jest.fn();
  })
  test("Renders correctly", () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/"
      }} >
        <DataTableStateWrapper />
      </DataTableContext.Provider>
    )

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("ds-c-pagination");
  });
  test("Renders data dictionary info banner if prop is provided", () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/",
        dataDictionaryBanner: true
      }} >
        <DataTableStateWrapper />
      </DataTableContext.Provider>
      )
    expect(screen.getByText('Click on the "Data Dictionary" tab above for full column definitions')).toBeInTheDocument();
  });
  test("Does not render data dictionary info banner if prop is not provided", () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/"
      }} >
        <DataTableStateWrapper />
      </DataTableContext.Provider>
    )
    expect(screen.queryByText('Click on the "Data Dictionary" tab above for full column definitions')).not.toBeInTheDocument();
  });
  test("Renders controls if prop is provided", () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/",
        datasetTableControls: true
      }} >
        <DataTableStateWrapper />
      </DataTableContext.Provider>
    )

    expect(screen.queryAllByText("Manage Columns")).toHaveLength(2);
    expect(screen.queryByText("Full Screen")).toBeInTheDocument();
  })
  test("State is synchronized between regular and full screen mode", async () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/",
        datasetTableControls: true
      }} >
        <DataTableStateWrapper />
      </DataTableContext.Provider>
    )
    // Is there a better way to do this test because every step seems to need an act
    await act(async () => {
      await screen.queryAllByText("Manage Columns")[0].click();
    });
    await act(async() => {
      await screen.getByRole('checkbox', {name: "Select all"}).click()
    })
    await act(async() => {
      await screen.getByRole('button', {name: 'Save'}).click();
    })
    await act(async() => {
      await screen.getByRole('button', {name: 'Full Screen'}).click();
    })
    await act(async () => {
      await screen.queryAllByText("Manage Columns")[1].click();
    });
    expect(screen.getByRole('checkbox', {name: "Select all"})).not.toBeChecked();
  }, 10000)
  
  test("Renders correctly without Query Builder", () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/"
      }} >
        <DataTableStateWrapper 
          showQueryBuilder={false}
          showCopyLinkButton={false}
          showDownloadFilteredDataButton={false}
          showDownloadFullDataButton={false}
        />
      </DataTableContext.Provider>
    )

    expect(screen.queryByText("Data filters: none")).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("ds-c-pagination");
  });
});