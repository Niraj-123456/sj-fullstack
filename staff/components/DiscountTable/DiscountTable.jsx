import React, { useMemo } from "react";

import Table from "../Common/Table/Table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function DiscountTable() {
  const data = useMemo(
    () => [
      {
        id: "0001",
        handyman_name: { name: "Jenny Wilson", phone: "9851857724" },
        offering_type: "Flat - Rs. 200",
        user_association: { name: "Guy Hawkins", phone: "9853473329" },
        rating: "N/A",
        discount_exp: "TimePeriod",
      },
      {
        id: "0004",
        handyman_name: { name: "Wade Warren", phone: "9877543389" },
        offering_type: "Percentage  - 20%",
        user_association: { name: "Brooklyn Simmons", phone: "9806645274" },
        rating: "2",
        discount_exp: "ResuableCount",
      },
      {
        id: "00078",
        handyman_name: { name: "Kristin Watson", phone: "9851857724" },
        offering_type: "Percentage - 20%",
        user_association: { name: "Robert Fox", phone: "9864729984" },
        rating: "4",
        discount_exp: "BothTimeAndCount",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "HandyMan Name",
        accessor: "handyman_name",
        Cell: ({ row }) => {
          const { name, phone } = row.values.handyman_name;
          return (
            <div
              style={{
                display: "flex",
                gap: "3px",
                flexDirection: "column",
              }}
            >
              <span>{name}</span>
              <span style={{ color: "#2599F9" }}>{phone}</span>
            </div>
          );
        },
      },
      {
        Header: "Offering Type",
        accessor: "offering_type",
      },
      {
        Header: "User Association",
        accessor: "user_association",
        Cell: ({ row }) => {
          const { name, phone } = row.values.user_association;
          return (
            <div
              style={{
                display: "flex",
                gap: "3px",
                flexDirection: "column",
              }}
            >
              <span>{name}</span>
              <span style={{ color: "#2599F9" }}>{phone}</span>
            </div>
          );
        },
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Discount Exp. Type",
        accessor: "discount_exp",
      },
    ],
    []
  );

  const customColumn = (hooks) => {
    hooks.visibleColumns.push((column) => [
      ...column,
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </span>
        ),
      },
    ]);
  };
  return (
    <Table
      tableTitle="Discount"
      columns={columns}
      data={data}
      customColumn={customColumn}
    />
  );
}

export default DiscountTable;
