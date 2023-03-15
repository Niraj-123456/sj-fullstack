import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./admindashboard.module.css";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { toast } from "react-toastify";

import AddNewBooking from "../AddNewBooking/AddNewBooking";
import BookingDetailsTable from "../BookingDetailsTable/BookingDetailsTable";
import UserDetailsTable from "../UserDetailsTable/UserDetailsTable";
import ReviewsTable from "../ReviewsTable/ReviewsTable";
import DiscountTable from "../DiscountTable/DiscountTable";
import CircularLoading from "../Common/CircularLoading";
import { userLogout } from "../../redux/features/user/userSlice";
import { storePhoneNumber } from "../../redux/features/phoneNumber/phoneNumberSlice";
import { logout } from "../https/loginServices";
import { staffBasePath } from "../../utils/apiRoutes";
import {
  getStaffDashboardData,
  getDashboardTableDataByDate,
  getDashboardTableDataByStatus,
  getDashboardTableDataByName,
  getServiceProvicerList,
  getAllClients,
  getAllBookingReviewByDate,
  getAllBookingReviewByBookingId,
  getAllBookingReviewByEmployeePhoneNumber,
} from "../https/adminServices";
import {
  dashBoardData,
  tableMetaData,
  tableError,
} from "../../redux/features/admin/bookingSlice";
import {
  allClients,
  clientMetaData,
  clientError,
} from "../../redux/features/admin/clientSlice";
import {
  allBookingReviews,
  reviewMetaData,
  reviewError,
} from "../../redux/features/admin/reviewSlice";
import {
  staffDataBar,
  staffBookingStatusLists,
  staffServiceLists,
  allServiceProviders,
} from "../../redux/features/admin/dashboardSlice";
import { toggleStaffLoadingState } from "../../redux/features/admin/loadingSlice";

const PAGESIZE = 5;

function AdminDashboard() {
  const leftSideBarOptions = [
    "Dashboard",
    "Bookings",
    "Users",
    "Reviews",
    "Discount",
  ];

  const dispatch = useDispatch();
  const router = useRouter();
  const adminCardRef = useRef(null);
  const userNameRef = useRef(null);
  const bookingIdRef = useRef(null);
  const employeePhoneNumberRef = useRef(null);
  const currentFilterDBRef = useRef("ByStatus");
  const currentFilterReviewRef = useRef("ByDate");
  const currentStatusRef = useRef("Submitted");
  const initialDate = moment().subtract(1, "years").local().toDate();
  const finalDate = moment().local().toDate();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedFilterValueForDB, setSelectedFilterValueForDB] = useState({
    label: "Status",
    value: "ByStatus",
  });
  const [selectedFilterValueForReview, setSelectedFilterValueForReview] =
    useState({
      label: "Date",
      value: "ByDate",
    });
  const [statusValue, setStatusValue] = useState({
    label: "Submitted",
    value: "Submitted",
  });
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(finalDate);
  const [sortBy, setSortBy] = useState({ label: "By Latest", value: "DESC" });

  // format start and end date to YYYY-MM-DD
  const startDateRef = useRef(moment(startDate).format("YYYY-MM-DD"));
  const endDateRef = useRef(moment(endDate).format("YYYY-MM-DD"));

  const currentStaff = useSelector(
    (state) => state.persistedReducer.user?.user
  );

  // loading state for table body component
  const isLoading = useSelector((state) => state.isLoading?.isPartialLoading);

  //loading state for a component
  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleFilterValueChangeForDB = (option) => {
    setCurrentPageIndex(1);
    setSelectedFilterValueForDB(option);
    currentFilterDBRef.current = option.value;
    userNameRef.current = null;
  };

  // handle filter value for reviews
  const handleFilterValueChangeForReview = (option) => {
    setCurrentPageIndex(1);
    bookingIdRef.current = null;
    setSelectedFilterValueForReview(option);
    currentFilterReviewRef.current = option;
  };

  const handleOptionChange = (index) => {
    setCurrentOption(index);
    setCurrentPageIndex(1);
    setSortBy({ label: "By Latest", value: "DESC" });
    setSelectedFilterValueForReview({ label: "Date", value: "ByDate" });

    currentFilterReviewRef.current = "ByDate";

    // initialize date back to initial state
    setStartDate(initialDate);
    setEndDate(finalDate);

    // initialize date ref back to initial state
    startDateRef.current = moment(startDate).format("YYYY-MM-DD");
    endDateRef.current = moment(finalDate).format("YYYY-MM-DD");
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

  const handleStatusValueChange = (option) => {
    setCurrentPageIndex(1);
    setStatusValue(option);
    currentStatusRef.current = option.value;
  };

  const handleSortValueChange = (option) => {
    setSortBy(option);
  };

  // get the list of service providers
  const getServiceProviders = useCallback(async () => {
    if (currentStaff) {
      try {
        const { data } = await getServiceProvicerList();
        dispatch(
          allServiceProviders(
            data.items?.map((serviceProvider) => {
              return {
                id: serviceProvider.id,
                label:
                  serviceProvider.firstName + " " + serviceProvider.lastName,
                value:
                  serviceProvider.firstName + " " + serviceProvider.lastName,
              };
            })
          )
        );
      } catch (ex) {
        console.log(ex);
      }
    }
  }, [dispatch, currentStaff]);

  // get booking status list, service provides and dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (currentStaff) {
      try {
        const { data } = await getStaffDashboardData();
        if (data) {
          dispatch(staffDataBar(data?.dataBar));
          dispatch(
            staffServiceLists(
              data?.serviceList.map((service) => {
                return {
                  id: service?.id,
                  label: service?.label,
                  value: service?.name,
                };
              })
            )
          );
          dispatch(
            staffBookingStatusLists(
              data?.bookingStatusList?.allBookingStatuses.map((status) => {
                return {
                  label: status,
                  value: status,
                };
              })
            )
          );
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }, [dispatch, currentStaff]);

  // get the booking list, serviceproviders and dashboard data on page mount
  useEffect(() => {
    getServiceProviders();
    fetchDashboardData();
  }, [getServiceProviders, fetchDashboardData]);

  // get admin dashboard table data by filter type date
  const fetchBookingTableDataByDate = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getDashboardTableDataByDate(
        PAGESIZE,
        currentPageIndex,
        startDateRef.current,
        endDateRef.current,
        sortBy?.value
      );
      dispatch(dashBoardData(data.items));
      dispatch(tableMetaData(data.meta));
      dispatch(toggleStaffLoadingState());
    } catch (ex) {
      console.log(ex);
      dispatch(toggleStaffLoadingState());
      tableError(ex.response);
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // get dashboard table data by filter type status
  const fetchBookingTableDataByStatus = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getDashboardTableDataByStatus(
        PAGESIZE,
        currentPageIndex,
        currentStatusRef.current,
        sortBy?.value
      );
      dispatch(toggleStaffLoadingState());
      dispatch(dashBoardData(data.items));
      dispatch(tableMetaData(data.meta));
    } catch (ex) {
      console.log(ex);
      dispatch(toggleStaffLoadingState());
      tableError(ex.response);
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // get dashboard table data by filter type UserName
  const fetchBookingTableDataByName = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getDashboardTableDataByName(
        PAGESIZE,
        currentPageIndex,
        userNameRef.current?.value,
        sortBy?.value
      );
      dispatch(toggleStaffLoadingState());
      dispatch(dashBoardData(data.items));
      dispatch(tableMetaData(data.meta));
    } catch (ex) {
      console.log(ex);
      dispatch(toggleStaffLoadingState());
      tableError(ex.response);
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // reviews table data
  // handle get reviews data by filter type date
  const fetchReviewsByDate = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getAllBookingReviewByDate(
        PAGESIZE,
        currentPageIndex,
        startDateRef.current,
        endDateRef.current,
        sortBy?.value
      );
      if (data) {
        dispatch(toggleStaffLoadingState());
        dispatch(allBookingReviews(data?.items));
        dispatch(reviewMetaData(data?.meta));
      }
    } catch (ex) {
      console.log(ex.response);
      dispatch(toggleStaffLoadingState());
      dispatch(reviewError("An Unexpected error occured"));
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // handle get reviews data by filter type bookingId
  const fetchReviewsByBookingId = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getAllBookingReviewByBookingId(
        bookingIdRef.current?.value,
        PAGESIZE,
        currentPageIndex,
        sortBy?.value
      );
      if (data) {
        dispatch(toggleStaffLoadingState());
        dispatch(allBookingReviews(data?.items));
        dispatch(reviewMetaData(data?.meta));
      }
    } catch (ex) {
      console.log(ex.response);
      dispatch(toggleStaffLoadingState());
      dispatch(reviewError("An Unexpected error occured"));
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // handle fetch reviews data by filter type employee phone number
  const fetchReviewsByEmployeePhoneNumber = useCallback(async () => {
    try {
      dispatch(toggleStaffLoadingState());
      const { data } = await getAllBookingReviewByEmployeePhoneNumber(
        employeePhoneNumberRef.current?.value,
        PAGESIZE,
        currentPageIndex,
        sortBy?.value
      );
      console.log(data);
      if (data) {
        dispatch(toggleStaffLoadingState());
        dispatch(allBookingReviews(data?.items));
        dispatch(reviewMetaData(data?.meta));
      }
    } catch (ex) {
      dispatch(toggleStaffLoadingState());
      dispatch(reviewError("An Unexpected error occured"));
      console.log(ex.response);
    }
  }, [dispatch, currentPageIndex, sortBy?.value]);

  // users table
  // get list of clients on Users Tab click
  useEffect(() => {
    if (currentOption === 2) {
      try {
        dispatch(toggleStaffLoadingState());
        async function getAllUsers() {
          const { data } = await getAllClients(
            "Client",
            PAGESIZE,
            currentPageIndex
          );
          dispatch(toggleStaffLoadingState());
          dispatch(allClients(data.items));
          dispatch(clientMetaData(data.meta));
        }
        getAllUsers();
      } catch (ex) {
        console.log(ex.response);
        dispatch(toggleStaffLoadingState());
        dispatch(clientError(ex.response.data.message));
      }
    }
  }, [dispatch, currentOption, currentPageIndex]);

  // close the user dropdown when click outside the container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminCardRef.current && !adminCardRef.current.contains(e.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  // log out the current staff
  const handleLogout = async () => {
    try {
      const { data } = await logout(currentStaff?.phoneNumber);
      if (data.success) {
        dispatch(userLogout());
        dispatch(storePhoneNumber(null));
        localStorage.clear();
        router.push(`${staffBasePath}/login`);
      }
    } catch (ex) {
      toast.error("Something went wrong. Please refresh the page.");
    }
  };

  // redirect the client to login page if unauthorized
  useEffect(() => {
    if (!currentStaff) router.push(`${staffBasePath}/login`);
  }, [currentStaff, router]);

  if (isPageLoading) {
    return (
      <CircularLoading
        boxStyles={{ height: "100vh" }}
        progressStyles={{ color: "var(--color-blue)" }}
        size={50}
        thickness={5}
      />
    );
  }

  return (
    currentStaff && (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/images/admin/sahaj-logo-colored.svg"
              alt="Sahaj Nepal"
              layout="fill"
              objectFit="contain"
            />
          </div>
          {drawerOpen && (
            <AddNewBooking
              drawerOpen={drawerOpen}
              currentUser={currentStaff}
              handleDrawerClose={handleDrawerClose}
            />
          )}
          <div className={styles.right__navbar}>
            <button
              disabled={isLoading || isPageLoading}
              onClick={handleDrawerOpen}
            >
              Add New Booking
            </button>

            <div className={styles.admin__user}>
              {/* <div className={styles.admin__user__img}>
                <Image
                  src="/images/admin/admin1.png"
                  alt="admin1"
                  layout="fill"
                  objectFit="contain"
                />
              </div> */}
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{ width: "48px", height: "48px", color: "#F58634" }}
              />
              {!isDropDownOpen ? (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsDropDownOpen(true)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsDropDownOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
        {isDropDownOpen && (
          <div className={styles.drop__down} ref={adminCardRef}>
            <h1>
              {currentStaff?.firstName} {currentStaff.lastName}
            </h1>
            <Link href="#">
              <a>View Profile</a>
            </Link>
            <ul>
              <li>Dashboard</li>
              <li>My Profile</li>
              <li onClick={handleLogout}>Log out</li>
            </ul>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.left__content}>
            <ul>
              {leftSideBarOptions.map((option, index) => (
                <li
                  key={index}
                  className={index === currentOption ? styles.active : ""}
                  onClick={() => handleOptionChange(index)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.right__content}>
            {/* {serverResponse && (
              <div
                style={{
                  width: "100%",
                  padding: "8px 20px",
                  background: "#10B981",
                  color: "var(--color-white)",
                  borderRadius: "3px",
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    style={{ marginRight: "10px", fontSize: "20px" }}
                  />
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      lineHeight: "19px",
                    }}
                  >
                    {serverResponse}
                  </p>
                </div>
                <a
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    lineHeight: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => setServerResponse("")}
                >
                  Dismiss
                </a>
              </div>
            )} */}
            <div className={styles.content__heading}>
              <p
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  lineHeight: "29px",
                  color: "#7B7575",
                }}
              >
                Welcome Back,
                <br />
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--color-black)",
                    textTransform: "capitalize",
                  }}
                >
                  {currentStaff?.firstName} {currentStaff?.lastName}
                </span>
              </p>
            </div>

            <div className={styles.record__table}>
              {/*record table */}
              {currentOption === 0 && (
                <BookingDetailsTable
                  currentOption={currentOption}
                  pageSize={PAGESIZE}
                  currentPage={currentPageIndex}
                  handlePageChange={handlePageChange}
                  selectedFilterValue={selectedFilterValueForDB}
                  currentFilterDBRef={currentFilterDBRef}
                  handleFilterValueChange={handleFilterValueChangeForDB}
                  statusValue={statusValue}
                  handleStatusValueChange={handleStatusValueChange}
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  handleSearchByStatus={fetchBookingTableDataByStatus}
                  handleSearchByDate={fetchBookingTableDataByDate}
                  handleSearchByName={fetchBookingTableDataByName}
                  sortBy={sortBy}
                  handleSortValueChange={handleSortValueChange}
                  userNameRef={userNameRef}
                />
              )}

              {/* user details table */}
              {currentOption === 2 && (
                <UserDetailsTable
                  pageSize={PAGESIZE}
                  currentPage={currentPageIndex}
                  handlePageChange={handlePageChange}
                />
              )}

              {/*booking reviews table */}
              {currentOption === 3 && (
                <ReviewsTable
                  currentOption={currentOption}
                  pageSize={PAGESIZE}
                  currentPage={currentPageIndex}
                  handlePageChange={handlePageChange}
                  selectedFilterValue={selectedFilterValueForReview}
                  handleFilterValueChange={handleFilterValueChangeForReview}
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  sortBy={sortBy}
                  handleSortValueChange={handleSortValueChange}
                  bookingIdRef={bookingIdRef}
                  employeePhoneNumberRef={employeePhoneNumberRef}
                  handleSearchByDate={fetchReviewsByDate}
                  handleSearchReviewsByPhoneNumber={
                    fetchReviewsByEmployeePhoneNumber
                  }
                  handleSearchReviewsByBookingId={fetchReviewsByBookingId}
                />
              )}
              {currentOption === 4 && <DiscountTable />}

              <div
                style={{
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default AdminDashboard;
