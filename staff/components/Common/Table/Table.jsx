import React from "react";
import styles from "./table.module.css";

import TableFilterAndSearch from "../TableFilterAndSearch/TableFilterAndSearch";
import TableFilterAndSearchForReviews from "../TableFilterAndSearch/TableFilterAndSearchForReviews";
import Paginate from "../Paginate";

import {
  useGlobalFilter,
  useFilters,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function Table({
  tableTitle,
  columns,
  data,
  currentOption,
  customColumn,
  customStyles,
  bookingStatuses,
  currentPage,
  itemCounts,
  pageSize,
  handlePageChange,
  initialState,
  statusValue,
  handleStatusValueChange,
  selectedFilterValue,
  handleFilterValueChange,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  handleSearchByStatus,
  handleSearchByDate,
  handleSearchByName,
  sortBy,
  handleSortValueChange,
  userNameRef,
  bookingIdRef,
  handleSearchReviewsByBookingId,
  employeePhoneNumberRef,
  handleSearchReviewsByPhoneNumber,
}) {
  const isLoading = useSelector((state) => state.adminReducer?.loading);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    customColumn,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    page,
    prepareRow,
    // preGlobalFilteredRows,
    // setGlobalFilter,
    // setFilter,
    // state,
  } = tableInstance;

  return (
    <div className={styles.table__container}>
      <table
        {...getTableProps()}
        className={styles.records}
        style={customStyles?.table}
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
              {currentOption === 0 && (
                <TableFilterAndSearch
                  columns={columns}
                  title={tableTitle}
                  // useFilters={useFilters}
                  // preGlobalFilteredRows={preGlobalFilteredRows}
                  // setGlobalFilter={setGlobalFilter}
                  // globalFilter={state.globalFilter}
                  // setFilter={setFilter}
                  bookingStatuses={bookingStatuses}
                  selectedFilterValue={selectedFilterValue}
                  handleFilterValueChange={handleFilterValueChange}
                  statusValue={statusValue}
                  handleStatusValueChange={handleStatusValueChange}
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  handleSearchByStatus={handleSearchByStatus}
                  handleSearchByDate={handleSearchByDate}
                  handleSearchByName={handleSearchByName}
                  sortBy={sortBy}
                  handleSortValueChange={handleSortValueChange}
                  userNameRef={userNameRef}
                />
              )}
              {currentOption === 3 && (
                <TableFilterAndSearchForReviews
                  columns={columns}
                  title={tableTitle}
                  selectedFilterValue={selectedFilterValue}
                  handleFilterValueChange={handleFilterValueChange}
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  sortBy={sortBy}
                  handleSortValueChange={handleSortValueChange}
                  bookingIdRef={bookingIdRef}
                  employeePhoneNumberRef={employeePhoneNumberRef}
                  handleSearchByDate={handleSearchByDate}
                  handleSearchReviewsByBookingId={
                    handleSearchReviewsByBookingId
                  }
                  handleSearchReviewsByPhoneNumber={
                    handleSearchReviewsByPhoneNumber
                  }
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
                    {column.render("Header")}{" "}
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
                    {!column.disableSortBy && !column.isSorted && (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {isLoading ? (
          <tbody style={{ textAlign: "center" }}>
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  letterSpacing: "0.03em",
                  borderBottom: "none",
                  background: "#ffffff",
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
                      <td key={index} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}
              >
                <td
                  colSpan={columns.length + 1}
                  style={{ background: "#ffffff", border: "none" }}
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
            itemCounts={itemCounts}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default Table;
