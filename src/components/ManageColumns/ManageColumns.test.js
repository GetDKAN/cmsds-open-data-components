import React from 'react';
import { render, screen, within, act } from '@testing-library/react'
import ManageColumns from './ManageColumns'
import { ManageColumnsContext } from '../DatasetTableTab/DataTableStateWrapper';

// Rationale
// We shouldn't need to rest dnd-kit functionality as that should be handled downstream in their library
// What we are testing in this file is that the library interacts with our application as expected
// e.g. the correct handlers are called, state matches what we expect it to be when other buttons on the page
// are clicked, etc

// reactQuery Objects
// not same order as default column order for testing purposes
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
    "getIsVisible": () => true // mock
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
  {
    "id": "covered_recipient_type",
    "depth": 0,
    "columnDef": {
        "header": "Covered_Recipient_Type",
        "filterFn": "auto",
        "sortingFn": "auto",
        "sortUndefined": 1,
        "aggregationFn": "auto",
        "size": 150,
        "minSize": 20,
        "maxSize": 9007199254740991,
        "accessorKey": "covered_recipient_type"
    },
    "columns": [],
    "getIsVisible": () => true
  },
  {
    "id": "teaching_hospital_id",
    "depth": 0,
    "columnDef": {
        "header": "Teaching_Hospital_ID",
        "filterFn": "auto",
        "sortingFn": "auto",
        "sortUndefined": 1,
        "aggregationFn": "auto",
        "size": 150,
        "minSize": 20,
        "maxSize": 9007199254740991,
        "accessorKey": "teaching_hospital_id"
    },
    "columns": [],
    "getIsVisible": () => true
  }
]
const defaultColumnOrder = ["change_type", "teaching_hospital_ccn", "covered_recipient_type", "teaching_hospital_id"];

const setColumnOrder = jest.fn();
const setColumnVisibility = jest.fn();

window.scrollTo = jest.fn();

describe('ManageColumns component.', () => {
  const closeModal = jest.fn();
  beforeEach(async () => {
    // render component and open the dialog
    render(
      <ManageColumnsContext.Provider value={{
        columnOrder: [],
        setColumnOrder: setColumnOrder,
        setColumnVisibility: setColumnVisibility
      }}>
        <ManageColumns
          id={"test"}
          columns={columns}
          defaultColumnOrder={defaultColumnOrder}
          modalOpen={true}
          setModalOpen={closeModal}
        />
      </ManageColumnsContext.Provider>
    )
  })
  
  it('Renders correctly', async () => {
    await expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // expect 4 list items and 5 checkboxes
    expect(await screen.getByRole("list").querySelectorAll('li')).toHaveLength(4)
    expect(await screen.getAllByRole('checkbox')).toHaveLength(5)
    
    expect(await screen.getByRole('button', {name: "Save"}))
    expect(await screen.getByRole('button', {name: "Cancel"}))
    expect(await screen.getByRole('button', {name: "Reset Columns"}))
  })
  
  it('Closes the dialog when the close button is clicked', async () => {
    await act(async () => {
      await screen.getByRole('button', {name: "Close modal dialog"}).click()
    });
    expect(closeModal).toHaveBeenCalled();
  })

  it('Sets column order and column visibility when the Save button is clicked', async () => {
    await act(async () => {
      await screen.getByRole('button', {name: "Save"}).click()
    });
    expect(setColumnOrder).toHaveBeenCalled();
    expect(setColumnVisibility).toHaveBeenCalled();
  });

  it('Toggles all checkboxes when Select All is clicked', async () => {
    await act(async () => {
      await screen.getByRole('checkbox', {name: "Select all"}).click()
    });

    expect(await screen.getByText("4 columns hidden")).toBeInTheDocument();

    const checkBoxes = await screen.getAllByRole("checkbox");
    checkBoxes.map((c) => {
      expect(c).not.toBeChecked();
    })
    await act(async () => {
      await screen.getByRole('checkbox', {name: "Select all"}).click()
    });
    expect(await screen.queryByText("4 columns hidden")).not.toBeInTheDocument();
    checkBoxes.map((c) => {
      expect(c).toBeChecked();
    })
  })
  it("Resets column order when Reset Columns is clicked", async () => {
    function getListItemOrder(listItems) {
      let listItemOrder = [];
      listItems.forEach(li => {
        listItemOrder.push(li.name.replace("_visibility", ""));
      })
      return listItemOrder;
    }
    // check column order doesn't match default
    columns.map(c => {})
    const list = screen.getByRole('list');
    let listItems = within(list).queryAllByRole("checkbox");
    let listItemOrder = getListItemOrder(listItems);
    expect(listItemOrder).not.toEqual(defaultColumnOrder);
    // hit button
    await act(async () => {
      await screen.getByRole('button', {name: "Reset Columns"}).click();
    });
    // check column order matches default
    listItems = within(list).queryAllByRole("checkbox");
    listItemOrder = getListItemOrder(listItems);
    expect(listItemOrder).toEqual(defaultColumnOrder);
  })
})