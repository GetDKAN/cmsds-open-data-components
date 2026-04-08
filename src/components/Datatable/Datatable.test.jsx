import React from "react";
import { render, screen } from "@testing-library/react";
import DataTable from "./Datatable";
import { MockDataTableActionsProvider } from "../DatasetTableTab/DataTableActionsContext";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import * as resource from "../../tests/fixtures/resource.json";

resource.setSort = jest.fn();

const columns = Object.keys(resource.values[0]).map((key) => ({
  accessor: key,
  header: key,
}));

const renderDataTable = (props = {}, resourceOverrides = {}) => {
  const testResource = { ...resource, ...resourceOverrides };
  return render(
    <DataTableContext.Provider value={{
      id: "test",
      resource: testResource,
    }}>
      <MockDataTableActionsProvider value={{
        columnOrder: [],
        setColumnOrder: jest.fn(),
        columnVisibility: {},
        setColumnVisibility: jest.fn(),
        page: 1,
        setPage: jest.fn(),
        tableDensity: "normal",
        setTableDensity: jest.fn(),
      }}>
        <DataTable
          columns={columns}
          tablePadding="ds-u-padding-y--1"
          canResize={false}
          loading={false}
          showDataTableToolbar={false}
          {...props}
        />
      </MockDataTableActionsProvider>
    </DataTableContext.Provider>
  );
};

const getStatusRegion = () =>
  document.querySelector('[role="status"][aria-live="polite"]');

const getAlertRegion = () =>
  document.querySelector('[role="alert"][aria-live="assertive"]');

describe("Datatable live regions", () => {
  describe("status live region (spinner)", () => {
    it("is always in the DOM and hidden when not loading", () => {
      renderDataTable({ loading: false });
      const statusRegion = getStatusRegion();
      expect(statusRegion).toBeInTheDocument();
      expect(statusRegion).toHaveAttribute("aria-live", "polite");
      expect(statusRegion).toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.queryByText("Dataset loading")).not.toBeInTheDocument();
    });

    it("is visible and shows spinner when loading", () => {
      renderDataTable({ loading: true });
      const statusRegion = getStatusRegion();
      expect(statusRegion).toBeInTheDocument();
      expect(statusRegion).not.toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.getByText("Dataset loading")).toBeInTheDocument();
    });
  });

  describe("alert live region (no results)", () => {
    it("is always in the DOM and hidden when results exist", () => {
      renderDataTable({ loading: false });
      const alertRegion = getAlertRegion();
      expect(alertRegion).toBeInTheDocument();
      expect(alertRegion).toHaveAttribute("aria-live", "assertive");
      expect(alertRegion).toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.queryByText("No results found for the current filters")).not.toBeInTheDocument();
    });

    it("is visible and shows warning when no results", () => {
      renderDataTable({ loading: false }, { values: [] });
      const alertRegion = getAlertRegion();
      expect(alertRegion).toBeInTheDocument();
      expect(alertRegion).not.toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.getByText("No results found for the current filters")).toBeInTheDocument();
    });
  });

  describe("loading with no data", () => {
    it("shows spinner and hides alert when loading with empty data", () => {
      renderDataTable({ loading: true }, { values: [] });
      const statusRegion = getStatusRegion();
      expect(statusRegion).not.toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.getByText("Dataset loading")).toBeInTheDocument();

      const alertRegion = getAlertRegion();
      expect(alertRegion).toHaveClass("ds-u-visibility--screen-reader");
      expect(screen.queryByText("No results found for the current filters")).not.toBeInTheDocument();
    });
  });
});
