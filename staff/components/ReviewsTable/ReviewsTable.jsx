import React, { useMemo, useState, useEffect, useRef } from "react";

import Table from "../Common/Table/Table";
import UserReviewAndRating from "../UserReview&Rating/UserReview&Rating";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import moment from "moment";

function ReviewsTable({
  currentOption,
  pageSize,
  currentPage,
  handlePageChange,
  selectedFilterValue,
  handleFilterValueChange,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  sortBy,
  handleSortValueChange,
  bookingIdRef,
  employeePhoneNumberRef,
  handleSearchByDate,
  handleSearchReviewsByBookingId,
  handleSearchReviewsByPhoneNumber,
}) {
  const currentFilterReviewRef = useRef(selectedFilterValue?.value);
  const [openReviewDrawer, setOpenReviewDrawer] = useState(false);
  const [addUpdateReviewData, setAddUpdateReviewData] = useState("");

  const handleReviewClose = () => {
    setOpenReviewDrawer(false);
  };

  const handleViewUpdateReview = (values) => {
    setOpenReviewDrawer(true);
    setAddUpdateReviewData(values);
  };

  const reviewData = useSelector(
    (state) => state.adminReducer?.reviews?.bookingReviews
  );

  const metaData = useSelector(
    (state) => state.adminReducer?.reviews?.metaData
  );

  // get reviews table data on initial render
  useEffect(() => {
    if (currentFilterReviewRef.current === "ByDate") handleSearchByDate();
    if (currentFilterReviewRef.current === "ByBookingId")
      handleSearchReviewsByBookingId();
    if (currentFilterReviewRef.current === "ByEmployeePhoneNumber")
      handleSearchReviewsByPhoneNumber();
  }, [
    currentPage,
    handleSearchByDate,
    handleSearchReviewsByBookingId,
    handleSearchReviewsByPhoneNumber,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "createdDateTime",
        Cell: ({ value }) => (
          <span>{moment(value).format("DD MMM YYYY, h:mm A")}</span>
        ),
      },
      {
        Header: "Review ID",
        accessor: "id",
        disableSortBy: true,
      },
      {
        Header: "Booking ID",
        accessor: "reviewedBooking.id",
        disableSortBy: true,
      },
      {
        Header: "Booking Rate",
        accessor: "serviceRating",
        disableSortBy: true,
      },
      {
        Header: "Employee ID",
        accessor: "ratedEmployee.id",
        disableSortBy: true,
      },
      {
        Header: "Employee Name",
        accessor: "ratedEmployee",
        disableSortBy: true,
        Cell: ({ value }) => {
          return value !== null ? (
            <div
              style={{ display: "flex", gap: "3px", flexDirection: "column" }}
            >
              <span>
                {value.firstName} {value.lastName}
              </span>
              <span style={{ color: "#2599F9" }}>{value.phoneNumber}</span>
            </div>
          ) : (
            "-"
          );
        },
      },
      {
        Header: "Employee Rating",
        accessor: "employeeRating",
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "reviewedBooking.status",
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
        Cell: ({ row: { original } }) => {
          return (
            <span
              onClick={() => handleViewUpdateReview(original)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                color: "var(--color-blue)",
                border: "solid 1px var(--color-blue)",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              <FontAwesomeIcon
                icon={faEye}
                style={{ color: "var(--color-blue" }}
              />{" "}
              View
            </span>
          );
        },
      },
    ]);
  };

  const data = useMemo(() => reviewData, [reviewData]);

  const initialState = { pageSize: pageSize };

  return (
    <>
      {openReviewDrawer && (
        <UserReviewAndRating
          openDrawer={openReviewDrawer}
          onDrawerClose={handleReviewClose}
          addUpdateReviewData={addUpdateReviewData}
        />
      )}
      <Table
        tableTitle="Reviews"
        columns={columns}
        data={data}
        initialState={initialState}
        customColumn={customColumn}
        currentOption={currentOption}
        pageSize={pageSize}
        currentPage={currentPage}
        itemCounts={metaData?.totalItemsCount}
        handlePageChange={handlePageChange}
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
        handleSearchReviewsByBookingId={handleSearchReviewsByBookingId}
        handleSearchReviewsByPhoneNumber={handleSearchReviewsByPhoneNumber}
      />
    </>
  );
}

export default ReviewsTable;
