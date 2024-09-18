import React from "react";
import { render, screen } from "@testing-library/react";
import DataTableControls from ".";
import ManageColumnsContext from '../ManageColumns/ManageColumnsContext';
import DataTableContext from "../../templates/Dataset/DataTableContext";
import * as resource from "../../tests/fixtures/resource.json";
import * as distribution from "../../tests/fixtures/distribution.json";

describe('DataTableControls', () => {
  resource.setSort = jest.fn();
  it('Renders correctly', () => {
    render(
      <DataTableContext.Provider value={{
        resource: resource,
        distribution: distribution.distribution[0],
        rootUrl: "test/api/",
      }}>
        <ManageColumnsContext.Provider value={{
          columnOrder: [],
          setColumnOrder: jest.fn(),
          setColumnVisibility: jest.fn()
        }}>
          <DataTableControls
            id={"test"}
            columns={[]}
            defaultColumnOrder={[]}
            isModal={false}
            closeFullScreenModal={jest.fn()}
          />
        </ManageColumnsContext.Provider>
      </DataTableContext.Provider>
    )
    expect(screen.getByRole("button", {name: "Manage columns - Opens in a dialog"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Full Screen mode - Opens in a dialog"})).toBeInTheDocument();
  });
  it('Renders hidden columns', () => {
    const columns = [
      {
        "id": "teaching_hospital_ccn",
        "depth": 0,
        "columnDef": {
            "header": "Teaching_Hospital_CCN",
            "filterFn": "auto",
            "sortingFn": "auto",
            "sortUndefined": 1,
            "aggregationFn": "auto",
            "size": 150,
            "minSize": 20,
            "maxSize": 9007199254740991,
            "accessorKey": "teaching_hospital_ccn"
        },
        "columns": [],
        "getIsVisible": () => false // mock not visible
      },
      {
        "id": "change_type",
        "depth": 0,
        "columnDef": {
            "header": "Change_Type",
            "filterFn": "auto",
            "sortingFn": "auto",
            "sortUndefined": 1,
            "aggregationFn": "auto",
            "size": 150,
            "minSize": 20,
            "maxSize": 9007199254740991,
            "accessorKey": "change_type"
        },
        "columns": [],
        "getIsVisible": () => true
      },
    ];
    render(
      <ManageColumnsContext.Provider value={{
        columnOrder: [],
        setColumnOrder: jest.fn(),
        setColumnVisibility: jest.fn()
      }}>
        <DataTableControls
          id={"test"}
          columns={columns}
          defaultColumnOrder={[]}
          isModal={true}
          closeFullScreenModal={jest.fn()}
        />
      </ManageColumnsContext.Provider>
    );
    expect(screen.getByText("1 Columns Hidden")).toBeInTheDocument();
  })
  it('Does not render the full screen dialog if we are already in a dialog', () => {
    render(
      <ManageColumnsContext.Provider value={{
        columnOrder: [],
        setColumnOrder: jest.fn(),
        setColumnVisibility: jest.fn()
      }}>
        <DataTableControls
          id={"test"}
          columns={[]}
          defaultColumnOrder={[]}
          isModal={true}
          closeFullScreenModal={jest.fn()}
        />
      </ManageColumnsContext.Provider>
    );
    expect(screen.queryByRole("button", {name: "Full Screen mode - Opens in a dialog"})).not.toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Close Full Screen dialog"})).toBeInTheDocument();
  })
})