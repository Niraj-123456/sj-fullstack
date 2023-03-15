import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./pastbookings.module.css";

import ClientTable from "../Common/ClientTable/ClientTable";

import { useSelector } from "react-redux";
import moment from "moment";

const BOOKEDTIME = "";

function PastBookings(props) {
  const {
    pastBookingStatusOptions,
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
    sortBy,
    setSortBy,
    handleSearchByDate,
  } = props;

  const pastBookingData = useSelector(
    (state) => state.clientReducer?.bookings?.bookingData
  );

  const metaData = useSelector(
    (state) => state.clientReducer?.bookings?.metaData
  );

  // get the booking statues color
  const bookingStatuesColor = useSelector(
    (state) =>
      state.clientReducer?.homeData?.userHomeData?.bookingStatusList
        ?.allBookingStatuesWithColor
  );

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "createdDateTime",
        Cell: ({ cell: { value } }) => {
          BOOKEDTIME = moment(value).fromNow();
          const formattedDate = moment(value).format("ddd D MMM ").split(" ");
          return (
            <div
              style={{
                width: "max-content",
                display: "flex",
                gap: "5px",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              <span>{formattedDate[0]}</span>
              <span style={{ fontSize: "1.4rem" }}>{formattedDate[1]}</span>
              <span>{formattedDate[2]}</span>
            </div>
          );
        },
      },
      {
        Header: "Service",
        accessor: "associatedServices",
        Cell: ({ cell: { value } }) => {
          return (
            <div>
              <div className={styles.services__container}>
                {value.map((service) => (
                  <span key={service.id} className={styles.services}>
                    {service.name}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-gray-2)",
                }}
              >
                {BOOKEDTIME}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "15px",
              }}
            >
              <div
                style={{
                  padding: "5px 10px",
                  borderRadius: "999px",
                  background: "#" + bookingStatuesColor[value],
                  color: "var(--color-white)",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                {value}
              </div>
              <div
                style={{ position: "relative", height: "20px", width: "20px" }}
              >
                <Image
                  src="/images/my-booking/user-booking1.png"
                  alt="User-Profile"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          );
        },
      },
    ],
    [bookingStatuesColor]
  );

  const data = useMemo(() => pastBookingData, [pastBookingData]);

  return (
    <ClientTable
      showFilters={true}
      columns={columns}
      data={data}
      totalItemsCount={metaData?.totalItemsCount}
      status={pastBookingStatusOptions}
      currentPage={currentPage}
      pageSize={pageSize}
      handlePageChange={handlePageChange}
      currentStatusValue={currentStatusValue}
      handleStatusChange={handleStatusChange}
      currentFilterValue={currentFilterValue}
      handleFilterValueChange={handleFilterValueChange}
      handleSearchByStatus={handleSearchByStatus}
      startDate={startDate}
      endDate={endDate}
      handleStartDateChange={handleStartDateChange}
      handleEndDateChange={handleEndDateChange}
      sortBy={sortBy}
      setSortBy={setSortBy}
      handleSearchByDate={handleSearchByDate}
    />
  );
}

export default PastBookings;
