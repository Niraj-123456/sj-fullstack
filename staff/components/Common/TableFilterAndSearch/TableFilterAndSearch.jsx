import React from "react";
import Link from "next/link";
import styles from "./tablefilterandsearch.module.css";

import CustomColumnFilter from "../CustomColumnFilter";
import CustomDateFilter from "../CustomDateFilter";
import SelectField from "../SelectField";
import Button from "../Button";

const SORTBYOPTIONS = [
  { label: "By Latest", value: "DESC" },
  { label: "By Oldest", value: "ASC" },
];

function TableFilterAndSearch({
  columns,
  title,
  bookingStatuses,
  selectedFilterValue,
  handleFilterValueChange,
  statusValue,
  handleStatusValueChange,
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
  // useFilters,
  // preGlobalFilteredRows,
  // globalFilter,
  // setGlobalFilter,
  // setFilter,
}) {
  // filter out the filter and search option to customer name, data and status
  const filterHeaders = columns.filter((column) => {
    if (
      column.Header === "Customer Name" ||
      column.Header === "Booking Date" ||
      column.Header === "Status"
    )
      return column;
  });

  // convert the filter and search option to the format : {label: label, value: value}
  const filterOptions = filterHeaders.map((column) => {
    const newValue = "";
    if (column.accessor === "createdDateTime") newValue = "ByDate";
    else if (column.accessor === "clientWhoUses") newValue = "ByName";
    else if (column.accessor === "status") newValue = "ByStatus";
    return { label: column.Header, value: newValue };
  });

  return (
    <>
      <div className={styles.table__heading}>
        {title && <p style={{ display: "flex" }}>{title}</p>}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          <h4 style={{ fontSize: "0.9rem" }}>Search By:</h4>
          <SelectField
            options={filterOptions}
            defaultValue={selectedFilterValue}
            onChange={(selectedOption) =>
              handleFilterValueChange(selectedOption)
            }
            controlStyles={{ width: "150px", height: "46px" }}
          />

          {selectedFilterValue.value === "ByStatus" && (
            <>
              <SelectField
                options={bookingStatuses}
                defaultValue={statusValue}
                onChange={(selectedStatus) =>
                  handleStatusValueChange(selectedStatus)
                }
                controlStyles={{ height: "46px" }}
              />
              <Button
                label="Search"
                onClick={handleSearchByStatus}
                style={{
                  height: "46px",
                  background: "var(--color-blue-2)",
                }}
              />
            </>
          )}

          {selectedFilterValue.value === "ByDate" && (
            <>
              <CustomDateFilter
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                placeholder1="Start Date"
                placeholder2="End Date"
                containerStyles={{ marginTop: "-5px" }}
              />
              <Button
                label="Search"
                onClick={handleSearchByDate}
                style={{
                  height: "46px",
                  background: "var(--color-blue-2)",
                }}
              />
            </>
          )}

          {selectedFilterValue.value === "ByName" && (
            <div>
              <CustomColumnFilter
                placeholder="Type to Search..."
                ref={userNameRef}
              />
              <Button
                label="Search"
                onClick={handleSearchByName}
                style={{
                  height: "46px",
                  marginLeft: "10px",
                  background: "var(--color-blue-2)",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginLeft: "10px",
          }}
        >
          Sort By:
          <SelectField
            options={SORTBYOPTIONS}
            defaultValue={sortBy}
            onChange={(option) => handleSortValueChange(option)}
            controlStyles={{ height: "46px" }}
          />
        </div>

        <Link href="#">
          <a
            style={{
              marginLeft: "10px",
              display: "flex",
              flex: "1",
              justifyContent: "flex-end",
            }}
          >
            View All
          </a>
        </Link>
      </div>
    </>
  );
}

export default TableFilterAndSearch;
