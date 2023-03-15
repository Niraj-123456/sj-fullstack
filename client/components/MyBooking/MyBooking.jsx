import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./mybooking.module.css";

import AddNewBooking from "../AddNewBooking/AddNewBooking";
import UpComingBookings from "../UpComingBookings/UpComingBookings";
import PastBookings from "../PastBookings/PastBookings";
import CircularLoading from "../Common/CircularLoading";
import {
  getBookingListFilterByStatus,
  getBookingListFilterByDate,
} from "../https/userPageData";
import {
  bookingTableData,
  tableMetaData,
  tableDataError,
} from "../../redux/features/clients/clientBookingSlice";

import { toggleClientLoadingState } from "../../redux/features/clients/loadingSlice";

import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const bookingDivision = [
  { key: "Upcoming", name: "Upcomings" },
  { key: "Past", name: "Past Booking" },
];

function MyBooking({ heading, currentUser, setServerResponse, pageSize }) {
  const dispatch = useDispatch();
  // get the reference to current filter value
  const currentFilterRef = useRef("ByDate");

  // store the reference to current status value
  const currentStatusRef = useRef("All");

  const initialDate = moment().subtract(1, "years").local().toDate();
  const finalDate = moment().local().toDate();
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [currentOption, setCurrentOption] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentFilterValue, setCurrentFilterValue] = useState({
    label: "Date",
    value: "ByDate",
  });
  const [currentStatus, setCurrentStatus] = useState({
    label: "All",
    value: "All",
  });

  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(finalDate);
  const [sortBy, setSortBy] = useState({ label: "By Latest", value: "DESC" });

  // convert date to YYYY-MM-DD format
  const startDateRef = useRef(moment(startDate).format("YYYY-MM-DD"));
  const endDateRef = useRef(moment(endDate).format("YYYY-MM-DD"));

  // get upcoming statuses
  const upComingStatusOptions = useSelector((state) =>
    state.clientReducer?.homeData?.userHomeData?.bookingStatusList?.upcomingBookingStatuses?.map(
      (status) => {
        return {
          label: status,
          value: status,
        };
      }
    )
  );

  // get past statuses
  const pastBookingStatusOptions = useSelector((state) =>
    state.clientReducer?.homeData?.userHomeData?.bookingStatusList?.pastBookingStatuses?.map(
      (status) => {
        return {
          label: status,
          value: status,
        };
      }
    )
  );

  // get the page loading state
  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleCurrentOptionChange = (index) => {
    setCurrentPageIndex(1);
    setCurrentOption(index);
    setCurrentStatus({ label: "All", value: "All" });
    currentStatusRef.current = "All";

    // initialize date back to initial state
    setStartDate(initialDate);
    setEndDate(finalDate);

    // initialize date ref back to initial state
    startDateRef.current = moment(startDate).format("YYYY-MM-DD");
    endDateRef.current = moment(finalDate).format("YYYY-MM-DD");
  };

  const handleFilterValueChange = (option) => {
    setCurrentPageIndex(1);
    setCurrentFilterValue(option);
    currentFilterRef.current = option.value;
  };

  const handleCurrentStatusChange = (option) => {
    setCurrentPageIndex(1);
    setCurrentStatus(option);
    currentStatusRef.current = option.value;
  };

  const handlePageChange = (page) => {
    setCurrentPageIndex(page);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    startDateRef.current = moment(date).format("YYYY-MM-DD");
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    endDateRef.current = moment(date).format("YYYY-MM-DD");
  };

  // current tab - upcoming or past
  const bookingDivisionOption = bookingDivision[currentOption].key;

  const handleBookingSearchByStatus = useCallback(async () => {
    try {
      dispatch(toggleClientLoadingState());
      const { data } = await getBookingListFilterByStatus(
        currentPageIndex,
        bookingDivisionOption,
        currentStatusRef.current,
        sortBy?.value
      );
      if (data) {
        dispatch(toggleClientLoadingState());
        dispatch(bookingTableData(data.items));
        dispatch(tableMetaData(data.meta));
      }
    } catch (ex) {
      dispatch(toggleClientLoadingState());
      dispatch(tableDataError(ex.response?.data?.message));
    }
  }, [dispatch, currentPageIndex, bookingDivisionOption, sortBy?.value]);

  const handleBookingSearchByDate = useCallback(async () => {
    try {
      dispatch(toggleClientLoadingState());
      const { data } = await getBookingListFilterByDate(
        currentPageIndex,
        bookingDivisionOption,
        startDateRef.current,
        endDateRef.current,
        sortBy?.value
      );
      if (data) {
        dispatch(toggleClientLoadingState());
        dispatch(bookingTableData(data.items));
        dispatch(tableMetaData(data.meta));
      }
    } catch (ex) {
      dispatch(toggleClientLoadingState());
      dispatch(tableDataError(ex.response));
    }
  }, [dispatch, bookingDivisionOption, currentPageIndex, sortBy?.value]);

  useEffect(() => {
    const handleSearch = () => {
      currentFilterRef.current === "ByDate"
        ? handleBookingSearchByDate()
        : handleBookingSearchByStatus();
    };
    handleSearch();
  }, [
    currentPageIndex,
    sortBy?.value,
    currentOption,
    handleBookingSearchByDate,
    handleBookingSearchByStatus,
  ]);

  if (isPageLoading)
    return (
      <CircularLoading
        size={50}
        thickness={5}
        progressStyles={{ color: "var(--color-blue)" }}
        boxStyles={{ padding: "100px" }}
      />
    );

  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.booking__details__heading}>
        <ul>
          {bookingDivision.map((options, index) => {
            return (
              <li
                key={index}
                className={currentOption === index ? styles.active : ""}
                onClick={() => handleCurrentOptionChange(index)}
              >
                {options.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/*display the current active booking page */}
      {currentOption === 0 && (
        <UpComingBookings
          upComingStatusOptions={upComingStatusOptions}
          currentPage={currentPageIndex}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
          currentStatusValue={currentStatus}
          handleStatusChange={handleCurrentStatusChange}
          currentFilterValue={currentFilterValue}
          handleFilterValueChange={handleFilterValueChange}
          startDate={startDate}
          endDate={endDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          handleSearchByStatus={handleBookingSearchByStatus}
          handleSearchByDate={handleBookingSearchByDate}
        />
      )}
      {currentOption === 1 && (
        <PastBookings
          pastBookingStatusOptions={pastBookingStatusOptions}
          currentPage={currentPageIndex}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
          currentStatusValue={currentStatus}
          handleStatusChange={handleCurrentStatusChange}
          currentFilterValue={currentFilterValue}
          handleFilterValueChange={handleFilterValueChange}
          handleSearchByStatus={handleBookingSearchByStatus}
          startDate={startDate}
          endDate={endDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          handleSearchByDate={handleBookingSearchByDate}
        />
      )}

      {/* add booking for responsive view */}
      <div className={styles.responsive__newbooking__btn}>
        <button disabled={isPageLoading} onClick={handleDrawerOpen}>
          Add new Booking
        </button>
      </div>

      {drawerOpen && (
        <AddNewBooking
          drawerOpen={drawerOpen}
          handleDrawerClose={handleDrawerClose}
          currentUser={currentUser}
          setServerResponse={setServerResponse}
        />
      )}
    </>
  );
}

export default MyBooking;
