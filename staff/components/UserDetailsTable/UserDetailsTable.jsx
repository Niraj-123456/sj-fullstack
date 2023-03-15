import React, { useMemo } from "react";

import Table from "../Common/Table/Table";

import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

function UserDetailsTable({ pageSize, currentPage, handlePageChange }) {
  const clients = useSelector((state) => state.adminReducer?.clients?.clients);
  const metaData = useSelector(
    (state) => state.adminReducer?.clients?.metaData
  );

  const data = useMemo(() => clients, [clients]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableSortBy: true,
      },
      {
        Header: "Customer Name",
        accessor: "fullName",
        disableSortBy: true,
        Cell: ({ row: { original } }) => {
          return (
            <div
              style={{ display: "flex", gap: "3px", flexDirection: "column" }}
            >
              <span>{original.fullName}</span>
              <span style={{ color: "#2599F9" }}>{original.phoneNumber}</span>
            </div>
          );
        },
      },
      {
        Header: "Booking Date",
        accessor: "createdDateTime",
        Cell: ({ cell: { value } }) => (
          <span>{moment(value).format("DD MMM YYYY, h:mm A")}</span>
        ),
      },
      {
        Header: "Address",
        accessor: "fullAddress",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => <span>{value || "-"}</span>,
      },
      {
        Header: "D.O.B",
        accessor: "dob",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => (
          <span>{value ? moment(value).format("MM-DD-YYYY") : "-"}</span>
        ),
      },
      {
        Header: "User Type",
        accessor: "userType",
        disableSortBy: true,
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
        disableSortBy: true,
        Cell: ({ row }) => (
          <span style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faEye} />
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={() => console.log("Editing", +row.values.id)}
            />
            <FontAwesomeIcon icon={faTrash} />
          </span>
        ),
      },
    ]);
  };

  const initialState = { pageSize: pageSize };

  return (
    <>
      <Table
        tableTitle="Users"
        columns={columns}
        data={data}
        initialState={initialState}
        customColumn={customColumn}
        currentPage={currentPage}
        pageSize={pageSize}
        itemCounts={metaData?.totalItemsCount}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

export default UserDetailsTable;
