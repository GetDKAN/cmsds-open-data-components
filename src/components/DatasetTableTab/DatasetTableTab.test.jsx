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

  describe("error UI", () => {
    const renderWithError = (errorOverrides = {}, contextOverrides = {}) =>
      render(
        <DataTableContext.Provider
          value={{
            resource: {
              ...resource,
              loading: false,
              error: { status: 400, message: 'bad', stack: '', ...errorOverrides },
            },
            distribution: distribution.distribution[0],
            rootUrl: "test/api/",
            relativeHomeUrlPrepend: "/site",
            ...contextOverrides,
          }}
        >
          <DataTableStateWrapper />
        </DataTableContext.Provider>
      );

    test("status 400 shows the 'Data unavailable' UI", () => {
      renderWithError({ status: 400 });
      expect(screen.getByRole('heading', { name: 'Data unavailable' })).toBeInTheDocument();
      expect(
        screen.getByText('This data is not available for preview at this time. Please try again later.')
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/site/');
    });

    test("status 500 shows the 'Something went wrong' UI", () => {
      renderWithError({ status: 500 });
      expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
      expect(
        screen.getByText('Something went wrong on our end. Please try again later.')
      ).toBeInTheDocument();
    });

    test("unmapped status (403) falls back to the 500 messages", () => {
      renderWithError({ status: 403 });
      expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    });

    test("loading wins over error — spinner shows when both are set", () => {
      render(
        <DataTableContext.Provider
          value={{
            resource: {
              ...resource,
              loading: true,
              error: { status: 400, message: 'bad', stack: '' },
            },
            distribution: distribution.distribution[0],
            rootUrl: "test/api/",
          }}
        >
          <DataTableStateWrapper />
        </DataTableContext.Provider>
      );
      expect(screen.queryByRole('heading', { name: 'Data unavailable' })).not.toBeInTheDocument();
      expect(document.querySelector('.ds-c-spinner')).toBeInTheDocument();
    });
  });
});