import React, { useState } from "react";
import Link from "next/link";
import styles from "./clienttablefilterandsearch.module.css";
import { useAsyncDebounce } from "react-table";

import CustomColumnFilter from "../CustomColumnFilter";
import CustomDateFilter from "../CustomDateFilter";
import SelectField from "../SelectField";
import Button from "../Button";

function ClientTableFilterAndSearch({
  columns,
  // useFilters,
  // preGlobalFilteredRows,
  // globalFilter,
  // setGlobalFilter,
  // setFilter,
  status,
  currentFilterValue,
  handleFilterValueChange,
  currentStatusValue,
  handleStatusChange,
  handleSearchByStatus,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  handleSearchByDate,
  sortBy,
  setSortBy,
}) {
  // remove service from the filter options
  const FILTEROPTIONS = columns.filter((column) => {
    return column.Header !== "Service";
  });

  const OPTIONS = FILTEROPTIONS.map((column) => {
    const newValue = "";
    if (column.accessor === "createdDateTime") newValue = "ByDate";
    else if (column.accessor === "status") newValue = "ByStatus";
    return { label: column.Header, value: newValue };
  });

  const SORTOPTIONS = [
    { label: "By Latest", value: "DESC" },
    { label: "By Oldest", value: "ASC" },
  ];

  return (
    <div className={styles.table__filter__heading}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <h4 style={{ fontSize: "0.9rem" }}>Search By:</h4>
        <SelectField
          isMulti={false}
          options={OPTIONS}
          defaultValue={currentFilterValue}
          value={currentFilterValue}
          controlStyles={{ height: "46px !important", marginTop: "5px" }}
          onChange={(option) => handleFilterValueChange(option)}
        />
      </div>

      <div className={styles.table__filter__input}>
        {currentFilterValue.label === "Status" && (
          <>
            <div style={{ width: "150px" }}>
              <SelectField
                isMulti={false}
                options={status}
                value={currentStatusValue}
                defaultValue={currentStatusValue}
                onChange={(option) => handleStatusChange(option)}
                controlStyles={{
                  height: "46px !important",
                  marginTop: "5px",
                  border: "solid 1px black",
                }}
              />
            </div>
            <Button
              label="Search"
              style={{
                background: "var(--color-blue-2)",
                padding: "10px 20px",
                marginTop: "4px",
                marginLeft: "10px",
              }}
              onClick={handleSearchByStatus}
            />
          </>
        )}

        {currentFilterValue.label === "Date" && (
          <>
            <CustomDateFilter
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              placeholder1="Start Date"
              placeholder2="End Date"
            />
            <Button
              label="Search"
              style={{
                background: "var(--color-blue-2)",
                padding: "10px 20px",
                marginTop: "4px",
                marginLeft: "10px",
              }}
              onClick={handleSearchByDate}
            />
          </>
        )}
      </div>

      <div style={{ display: "flex", flex: "1", justifyContent: "flex-end" }}>
        <SelectField
          options={SORTOPTIONS}
          onChange={setSortBy}
          value={sortBy}
          defaultValue={sortBy}
          controlStyles={{
            height: "44px !important",
            marginTop: "5px",
          }}
          placeholder="Sort By"
        />
      </div>
    </div>
  );
}

export default ClientTableFilterAndSearch;
