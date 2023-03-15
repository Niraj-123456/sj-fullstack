import React, { useMemo, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import moment from "moment";

import Table from "../Common/Table/Table";
import AdminDashboardInsights from "../AdminDashboardInsights/AdminDashboardInsights";
import ViewBooking from "../ViewBooking/ViewBooking";
import EditBooking from "../EditBooking/EditBooking";
import AddBookingReview from "../AddBookingReview/AddBookingReview";
import ViewBookingReview from "../ViewBookingReview/ViewBookingReview";
import AdminActionOptions from "../Common/AdminActionOptions/AdminActionOptions";
import SelectField from "../Common/SelectField";
import {
  updateBookingStatus,
  updateBookingServiceProvider,
} from "../https/adminServices";
import { updateBookingByStaff } from "../../redux/features/admin/bookingSlice";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { useEffect } from "react";

function BookingDetailsTable({
  currentOption,
  bookingData,
  currentPage,
  pageSize,
  handlePageChange,
  selectedFilterValue,
  handleFilterValueChange,
  currentFilterDBRef,
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
}) {
  const dispatch = useDispatch();
  const [openViewDrawer, setOpenViewDrawer] = useState(false); // state to open or close view booking drawer
  const [openEditDrawer, setOpenEditDrawer] = useState(false); // state to open or close edit booking drawer
  const [openReviewDrawer, setOpenReviewDrawer] = useState(false); // state to open or close review booking drawer
  const [openViewReviewDrawer, setOpenViewReviewDrawer] = useState(false); // state to open or close view review drawer
  const [values, setValues] = useState();

  const tableData = useSelector(
    (state) => state.adminReducer?.bookings?.dashboardBookingTableData
  );
  const metaData = useSelector(
    (state) => state.adminReducer?.bookings?.metaData
  );

  // get booking statuses list
  const bookingStatuses = useSelector(
    (state) => state.adminReducer?.dashboard?.bookingStatusLists
  );

  // get service providers list
  const serviceProvidersList = useSelector(
    (state) => state.adminReducer?.dashboard?.serviceProviders
  );

  //close the view booking drawer
  const handleViewDrawerClose = () => {
    setOpenViewDrawer(false);
  };

  // close the edit booking drawer
  const handleEditDrawerClose = () => {
    setOpenEditDrawer(false);
  };

  // close the review booking drawer
  const handleReviewDrawerClose = () => {
    setOpenReviewDrawer(false);
  };

  // close the view review booking drawer
  const handleViewReviewDrawerClose = () => {
    setOpenViewReviewDrawer(false);
  };

  // handle booking view
  const handleBookingView = (data) => {
    setOpenViewDrawer(true);
    setValues(data);
  };

  // edit booking form by staff
  const handleBookingEdit = (data) => {
    setOpenEditDrawer(true);
    setValues(data);
  };

  // handle booking review
  const handleBookingReview = (data) => {
    setOpenReviewDrawer(true);
    setValues(data);
  };

  const handleStatusChange = useCallback(
    async (selectedOption, bookingId) => {
      try {
        dispatch(togglePartialLoadingState(true));
        const { data } = await updateBookingStatus(
          selectedOption?.value,
          bookingId
        );
        console.log(data);
        if (data.success) {
          dispatch(togglePartialLoadingState(false));
          dispatch(updateBookingByStaff(data.data?.bookingDetails));
          await handleSearchByStatus();
          toast.success(data.message);
        }
      } catch (ex) {
        dispatch(togglePartialLoadingState(false));
        console.log(ex);
        toast.error("An error occured while updating booking details.");
      }
    },
    [dispatch, handleSearchByStatus]
  );

  // render dashboard booking data on value changes
  useEffect(() => {
    if (currentFilterDBRef?.current === "ByStatus") handleSearchByStatus();
    if (currentFilterDBRef?.current === "ByDate") handleSearchByDate();
    if (currentFilterDBRef?.current === "ByName") handleSearchByName();
  }, [
    currentFilterDBRef,
    currentPage,
    sortBy?.value,
    handleSearchByStatus,
    handleSearchByDate,
    handleSearchByName,
  ]);

  const handleServiceProviderChange = useCallback(
    async (selectedServiceProvider, bookingId) => {
      try {
        dispatch(togglePartialLoadingState(true));
        const { data } = await updateBookingServiceProvider(
          selectedServiceProvider.id,
          bookingId
        );
        console.log(data);
        if (data.success) {
          dispatch(togglePartialLoadingState(false));
          dispatch(updateBookingByStaff(data.data?.bookingDetails));
          toast.success(data.message);
        }
      } catch (ex) {
        dispatch(togglePartialLoadingState(false));
        console.log(ex);
        toast.error("An error occured while updating booking details.");
      }
    },
    [dispatch]
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableSortBy: true,
      },
      {
        Header: "Customer Name",
        accessor: "clientWhoUses",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => {
          return (
            <div
              style={{ display: "flex", gap: "3px", flexDirection: "column" }}
            >
              <span>{value?.fullName || "-"}</span>
              <span style={{ color: "var(--color-blue)" }}>
                {value?.phoneNumber || "-"}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Explanation",
        accessor: "explanation",
        disableSortBy: true,
      },
      {
        Header: "Booking Date",
        accessor: "createdDateTime",
        Cell: ({ cell: { value } }) => (
          <span>{moment(value).format("DD MMM YYYY, h:mm A")}</span>
        ),
      },
      {
        Header: "Associated Services",
        accessor: "associatedServices",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: "2px",
            }}
          >
            {value?.slice(0, 2).map((v) => (
              <span
                key={v.id}
                style={{
                  background: "#CBD5E1",
                  borderRadius: "99px",
                  padding: "4px 10px",
                  marginRight: "2px",
                  width: "max-content",
                }}
              >
                {v.name}
              </span>
            ))}
            {value?.length > 2 && (
              <span
                style={{
                  background: "#CBD5E1",
                  borderRadius: "99px",
                  padding: "4px 5px",
                  display: "flex",
                  alignItems: "center",
                  width: "max-content",
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ fontSize: "10px", marginRight: "2px" }}
                />
                {value?.length - 2}
              </span>
            )}
          </div>
        ),
      },

      {
        Header: "Service Provider",
        accessor: "serviceProvider",
        disableSortBy: true,
        Cell: ({ row: { original } }) => {
          const serviceProviders = original?.serviceProvider;
          return (
            <SelectField
              options={serviceProvidersList}
              defaultValue={
                serviceProviders && {
                  id: serviceProviders?.id,
                  label:
                    serviceProviders?.firstName +
                    " " +
                    serviceProviders?.lastName,
                  value:
                    serviceProviders?.firstName +
                    " " +
                    serviceProviders?.lastName,
                }
              }
              onChange={(option) =>
                handleServiceProviderChange(option, original.id)
              }
              placeholder="Assign SP"
            />
          );
        },
      },
      {
        Header: "Discount Applied",
        accessor: "discounts",
        disableSortBy: true,
        Cell: ({ value }) => {
          return value?.length > 0
            ? value?.map((v) => <span key={v.id}>{v.id}</span>)
            : "-";
        },
      },
      {
        Header: "Rating",
        accessor: "bookingReview",
        disableSortBy: true,
        Cell: ({ value }) => (
          <span>
            {value
              ? "S:" +
                value?.serviceRating +
                " | " +
                "E:" +
                value?.employeeRating
              : "-"}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <SelectField
              options={bookingStatuses}
              defaultValue={{
                label: row.values.status,
                value: row.values.status,
              }}
              onChange={(option) => handleStatusChange(option, row.values.id)}
              controlStyles={{ border: "1px solid #E2E8F0" }}
              dropdownIndicatorStyles={{ color: "var(--color-black)" }}
            />
          );
        },
      },
    ],
    [
      bookingStatuses,
      serviceProvidersList,
      handleServiceProviderChange,
      handleStatusChange,
    ]
  );

  const customColumn = (hooks) => {
    hooks.visibleColumns.push((column) => [
      ...column,
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row: { original } }) => {
          const [openActionOptions, setOpenActionOptions] = useState(false);
          const [showReviewOption, setShowReviewOption] = useState(true);

          const handleActionOptions = () => {
            setOpenActionOptions(!openActionOptions);
            if (
              original.status === "Completed" ||
              original.status === "Declined"
            ) {
              setShowReviewOption(false);
            } else setShowReviewOption(true);
          };

          return (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "22px",
                  padding: "10px 15px",
                }}
                icon={faEllipsisVertical}
                onClick={handleActionOptions}
              />
              {openActionOptions && (
                <AdminActionOptions
                  handleBookingView={() => handleBookingView(original)}
                  handleBookingEdit={() => handleBookingEdit(original)}
                  handleBookingViewReview={() => handleBookingReview(original)}
                  handleBookingReview={() => handleBookingReview(original)}
                  setOpenActionOptions={setOpenActionOptions}
                  showReviewOption={showReviewOption}
                  hasBookingReview={original.bookingReview}
                />
              )}
            </span>
          );
        },
      },
    ]);
  };

  const data = useMemo(() => tableData, [tableData]);

  const initialState = { hiddenColumns: ["explanation"], pageSize: pageSize };

  return (
    <>
      {openViewDrawer && (
        <ViewBooking
          drawerOpen={openViewDrawer}
          handleDrawerClose={handleViewDrawerClose}
          bookingValues={values}
        />
      )}
      {openEditDrawer && (
        <EditBooking
          drawerOpen={openEditDrawer}
          handleDrawerClose={handleEditDrawerClose}
          editValues={values}
        />
      )}
      {openReviewDrawer && (
        <AddBookingReview
          reviewData={values}
          drawerOpen={openReviewDrawer}
          handleDrawerClose={handleReviewDrawerClose}
        />
      )}
      {openViewReviewDrawer && (
        <ViewBookingReview
          reviewData={values}
          drawerOpen={openViewReviewDrawer}
          handleDrawerClose={handleViewReviewDrawerClose}
        />
      )}
      <AdminDashboardInsights bookingData={bookingData} />
      <Table
        tableTitle="Booking Details"
        columns={columns}
        data={data}
        currentOption={currentOption}
        customColumn={customColumn}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        pageSize={pageSize}
        itemCounts={metaData?.totalItemsCount}
        initialState={initialState}
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
    </>
  );
}

export default BookingDetailsTable;
