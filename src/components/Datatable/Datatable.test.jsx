import React from "react";
import { render, screen, act } from "@testing-library/react";
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

const getLoadingRegion = () =>
  screen.getByTestId("loading-announcement");

const getNoResultsRegion = () =>
  screen.getByTestId("no-results-announcement");

describe("Datatable live regions", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("loading announcement", () => {
    it("is always in the DOM and empty when not loading", () => {
      renderDataTable({ loading: false });
      const region = getLoadingRegion();
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-live", "polite");
      expect(region).toHaveAttribute("aria-atomic", "true");
      expect(region).toHaveClass("ds-u-visibility--screen-reader");
      expect(region).toHaveTextContent("");
    });

    it("contains announcement text when loading", () => {
      renderDataTable({ loading: true });
      const region = getLoadingRegion();
      expect(region).toHaveTextContent("Dataset loading");
    });

    it("keeps announcement text after loading completes until delay elapses", () => {
      const { rerender } = renderDataTable({ loading: true });

      expect(getLoadingRegion()).toHaveTextContent("Dataset loading");

      // Re-render with loading=false
      rerender(
        <DataTableContext.Provider value={{ id: "test", resource: resource }}>
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
            />
          </MockDataTableActionsProvider>
        </DataTableContext.Provider>
      );

      // Text persists immediately after loading stops
      expect(getLoadingRegion()).toHaveTextContent("Dataset loading");

      // Text clears after delay
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      expect(getLoadingRegion()).toHaveTextContent("");
    });

    it("renders visible Spinner component when loading", () => {
      renderDataTable({ loading: true });
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("no results announcement", () => {
    it("is always in the DOM and empty when results exist", () => {
      renderDataTable({ loading: false });
      const region = getNoResultsRegion();
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-live", "assertive");
      expect(region).toHaveAttribute("aria-atomic", "true");
      expect(region).toHaveClass("ds-u-visibility--screen-reader");
      expect(region).toHaveTextContent("");
    });

    it("contains announcement text with Warning prefix when no results", () => {
      renderDataTable({ loading: false }, { values: [] });
      const region = getNoResultsRegion();
      expect(region).toHaveTextContent("Warning: No results found for the current filters");
    });

    it("renders visible Alert component when no results", () => {
      renderDataTable({ loading: false }, { values: [] });
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("loading with no data", () => {
    it("announces loading and keeps no-results silent when loading with empty data", () => {
      renderDataTable({ loading: true }, { values: [] });
      expect(getLoadingRegion()).toHaveTextContent("Dataset loading");
      expect(getNoResultsRegion()).toHaveTextContent("");
    });
  });
});
