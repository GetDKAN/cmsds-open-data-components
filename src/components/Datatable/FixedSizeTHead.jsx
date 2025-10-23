import React from "react";
import { flexRender } from "@tanstack/react-table";

const FixedSizeTHead = ({ table, sortElement }) => {
  return (
    <thead className="dc-thead--fixed-size">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortState = header.column.getIsSorted();
            return (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
                title={
                  typeof header.column.columnDef.header === "string"
                    ? header.column.columnDef.header
                    : ""
                }
                className="ds-u-border-y--2 ds-u-padding--2 ds-u-border--dark ds-u-font-weight--bold"
                {...(canSort && {
                  "aria-sort":
                    sortState === "asc"
                      ? "ascending"
                      : sortState === "desc"
                      ? "descending"
                      : "none",
                })}
              >
                <div className="ds-u-display--flex ds-u-align-items--center ds-u-gap--1">
                  <span>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </span>
                  {canSort && (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={
                        "cursor-pointer select-none ds-u-focus-visible " +
                        (sortElement ? sortElement(sortState) : "")
                      }
                      aria-label={`${
                        typeof header.column.columnDef.header === "string"
                          ? header.column.columnDef.header
                          : header.column.id
                      } sort order`}
                    />
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

export default FixedSizeTHead;
