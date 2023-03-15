import React, { useState } from "react";
import styles from "./clienttable.module.css";

import ClientTableFilterAndSearch from "../ClientTableFilterAndSearch/ClientTableFilterAndSearch";
import Paginate from "../Paginate";

import { useSelector } from "react-redux";
import {
  useGlobalFilter,
  useFilters,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

function ClientTable({
  tableStyles,
  showFilters,
  columns,
  data,
  status,
  customColumn,
  totalItemsCount,
  currentPage,
  pageSize,
  handlePageChange,
  currentStatusValue,
  handleStatusChange,
  currentFilterValue,
  handleFilterValueChange,
  handleSearchByStatus,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  handleSearchByDate,
  sortBy,
  setSortBy,
}) {
  const isLoading = useSelector((state) => state.clientReducer?.isLoading);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: pageSize },
    },
    useFilters,
    useGlobalFilter,
    customColumn ? customColumn : "",
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    page,
    // previousPage,
    // nextPage,
    prepareRow,
    // preGlobalFilteredRows,
    // setGlobalFilter,
    // setFilter,
    // state,
  } = tableInstance;

  return (
    <>
      <table
        style={tableStyles?.table}
        className={styles.client__booking__records}
        {...getTableProps()}
      >
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                background: "white",
                padding: "0",
                color: "black",
              }}
            >
              {showFilters && (
                <ClientTableFilterAndSearch
                  columns={columns}
                  // useFilters={useFilters}
                  // globalFilter={state.globalFilter}
                  // setFilter={setFilter}
                  // setGlobalFilter={setGlobalFilter}
                  status={status}
                  startDate={startDate}
                  endDate={endDate}
                  currentStatusValue={currentStatusValue}
                  handleStatusChange={handleStatusChange}
                  currentFilterValue={currentFilterValue}
                  handleFilterValueChange={handleFilterValueChange}
                  handleSearchByStatus={handleSearchByStatus}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  handleSearchByDate={handleSearchByDate}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              )}
            </th>
          </tr>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <FontAwesomeIcon
                          icon={faSortUp}
                          style={{ marginLeft: "2px" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSortDown}
                          style={{ marginLeft: "2px" }}
                        />
                      ))}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {isLoading ? (
          <tbody>
            <tr style={{ textAlign: "center", background: "#ffffff" }}>
              <td
                colSpan={columns.length}
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  letterSpacing: "0.03em",
                }}
              >
                Loading...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr key={index} {...row.getRowProps()}>
                    {row.cells.map((cell, index) => (
                      <td
                        key={index}
                        style={tableStyles?.td}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                    textAlign: "center",
                    background: "#ffffff",
                  }}
                >
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {!isLoading && (
          <Paginate
            pageIndex={currentPage}
            pageSize={pageSize}
            itemCounts={totalItemsCount}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}

export default ClientTable;
