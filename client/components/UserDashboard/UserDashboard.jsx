import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./userdashboard.module.css";

import Button from "../Common/Button";
import MyBooking from "../MyBooking/MyBooking";
import AddNewBooking from "../AddNewBooking/AddNewBooking";
import ResponsiveUserDashboardHeader from "../Common/ResponsiveUserDashBoardHeader/ResponsiveUserDashboardHeader";
import BenefitsTable from "../BenefitsTable/BenefitsTable";
import { getUserPageData, getBenefitsData } from "../https/userPageData";
import { logout } from "../https/loginServices";
import { userLogout } from "../../redux/features/user/userSlice";
import { fetchUserHomeData } from "../../redux/features/clients/homeDataSlice";
import { storePhoneNumber } from "../../redux/features/phoneNumber/phoneNumberSlice";
import { bookingDiscounts } from "../../redux/features/clients/clientBookingSlice";
import { clientBasePath } from "../../utils/apiRoutes";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faXmark,
  faCircleInfo,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const SIDEBAROPTIONS = [
  {
    linkName: "My Bookings",
    linkImage: "booking-icon.png",
  },
  {
    linkName: "Benefits",
    linkImage: "promotion-icon.png",
  },
];

const PAGESIZE = 5;

function UserDashboard({ loggedInUser }) {
  const userCardRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discount, setDiscount] = useState();
  const [serverResponse, setServerResponse] = useState("");

  const isPartialLoading = useSelector(
    (state) => state.isLoading?.isPartialLoading
  );
  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleCurrentOptionIndexChange = (index) => {
    setCurrentOptionIndex(index);

    // close the responsive side bar on side bar index change
    setIsOpenSidebarOpen(false);
  };

  const handleSideBarOpen = () => {
    setIsOpenSidebarOpen(!isSidebarOpen);
  };

  // logout user
  const handleSignOut = async () => {
    try {
      const { data } = await logout(loggedInUser?.phoneNumber);
      if (data.success) {
        localStorage.removeItem("bearer-token");
        dispatch(userLogout());
        dispatch(storePhoneNumber(null));
        router.replace(`${clientBasePath}`);
      }
    } catch (ex) {
      toast.error("Something went wrong. Please refresh the page.");
    }
  };

  // get the heading of the components
  const dashBoardHeading = SIDEBAROPTIONS.map((option, index) => {
    if (currentOptionIndex === index) return option.linkName;
  });

  // close the user dropdown when click outside the container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userCardRef.current && !userCardRef.current.contains(e.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const getPageData = useCallback(async () => {
    try {
      const { data } = await getUserPageData();
      dispatch(fetchUserHomeData(data));
      setDiscount(data?.discountFund);
    } catch (ex) {
      console.log(ex);
    }
  }, [dispatch]);

  const getDiscounts = useCallback(async () => {
    try {
      const { data } = await getBenefitsData(5, 1);
      const discounts = data.items
        ?.filter((item) => item.reusuableCountLeft > 0 && item.isDiscountUsable)
        .map((item) => item.id);
      dispatch(bookingDiscounts(discounts));
    } catch (ex) {
      console.log(ex);
    }
  }, [dispatch]);

  // get dashboard number of booking, reviews and other infos
  // get available user discounts on user dashboard mount
  useEffect(() => {
    if (loggedInUser) {
      getPageData();
      getDiscounts();
    }
  }, [loggedInUser, dispatch, getPageData, getDiscounts]);

  return (
    <div className={styles.container}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <Image
            src="/images/header-images/sahaj-logo-colored.svg"
            alt="Sahaj Nepal"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {drawerOpen && (
          <AddNewBooking
            drawerOpen={drawerOpen}
            handleDrawerClose={handleDrawerClose}
            setServerResponse={setServerResponse}
            currentUser={loggedInUser}
          />
        )}
        <div className={styles.user__navs}>
          <button
            type="button"
            onClick={handleDrawerOpen}
            disabled={isPartialLoading || isPageLoading}
          >
            Add New Booking
          </button>
          <div className={styles.current__user}>
            {/* <div className={styles.current__user__img}>
              <Image
                src="/images/user-card/profile.svg"
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
              <div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsDropDownOpen(true)}
                />
              </div>
            ) : (
              <div>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsDropDownOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
        {isDropDownOpen && (
          <div className={styles.drop__down} ref={userCardRef}>
            <div
              style={{
                borderBottom: "solid 1px var(--color-white-2)",
                padding: "20px",
              }}
            >
              <h1>
                {loggedInUser.firstName} {loggedInUser.lastName}
              </h1>
              <p>{loggedInUser.email}</p>
            </div>

            <ul>
              {/* <li>
                <div
                  style={{
                    position: "relative",
                    width: "15px",
                    height: "14px",
                  }}
                >
                  <Image
                    src="/images/user-card/profile.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <Link href="#">
                  <a>View Profile</a>
                </Link>
              </li>
              <li>
                <div
                  style={{
                    position: "relative",
                    width: "15px",
                    height: "14px",
                  }}
                >
                  <Image
                    src="/images/user-card/settings.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <Link href="#">
                  <a>Settings</a>
                </Link>
              </li> */}
              <li onClick={handleSignOut}>
                <div
                  style={{
                    position: "relative",
                    width: "15px",
                    height: "14px",
                  }}
                >
                  <Image
                    src="/images/user-card/logout.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <Link href="#">
                  <a onClick={handleSignOut}>Log Out</a>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.my__booking}>
          <div className={styles.booking__left__sidebar}>
            <div className={styles.options}>
              <ul className={styles.option__list}>
                {SIDEBAROPTIONS.map((option, index) => (
                  <li
                    key={index}
                    className={
                      currentOptionIndex === index ? styles.active : ""
                    }
                    onClick={() => handleCurrentOptionIndexChange(index)}
                  >
                    <div className={styles.icon}>
                      <Image
                        src={`/images/my-booking/${option.linkImage}`}
                        alt="booking"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    {option.linkName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.booking__details}>
            {serverResponse && (
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
            )}

            {/* when my booking tab is clicked open my booking table */}
            {currentOptionIndex === 0 && (
              <MyBooking
                heading="My Bookings"
                currentUser={loggedInUser}
                setServerResponse={setServerResponse}
                pageSize={PAGESIZE}
              />
            )}

            {/* when benefits tab is clicked open benefits table */}
            {currentOptionIndex === 1 && (
              <BenefitsTable
                heading="Referrals"
                currentUser={loggedInUser}
                setServerResponse={setServerResponse}
                pageSize={PAGESIZE}
                currentLeftSideBarTab={currentOptionIndex}
              />
            )}
          </div>
          {currentOptionIndex !== 1 && (
            <div className={styles.booking__right__sidebar}>
              <div className={styles.balance__and__redeem}>
                <div className={styles.available__funds}>
                  <p>
                    <span className={styles.icon}>
                      <Image
                        src="/images/my-booking/funds-icon.png"
                        alt="booking"
                        layout="fill"
                        objectFit="contain"
                      />
                    </span>
                    Available Funds
                  </p>
                  <h1>NPR. {discount?.flat}</h1>
                  <hr style={{ width: "100%" }} />
                  <p>% Percentage</p>
                  <h1>{discount?.percentage} OFF</h1>
                </div>
                <div className={styles.redeem}>
                  <Button
                    label="Redeem Discount"
                    style={{
                      width: "100%",
                      marginTop: "30px",
                      background: "#10B981",
                      letterSpacing: "0.5px",
                    }}
                    onClick={() => handleCurrentOptionIndexChange(1)}
                  />
                </div>
              </div>
            </div>
          )}
          {/*responsive view */}
          <ResponsiveUserDashboardHeader
            title={dashBoardHeading}
            handleSideBarOpen={handleSideBarOpen}
          />
        </div>
      </div>

      {/* responsive side bar */}
      <div
        className={styles.responsive__sidebar}
        style={isSidebarOpen ? { display: "block" } : { display: "none" }}
      >
        <div className={styles.responsive__sidebar__header}>
          <div className={styles.responsive__header__logo}>
            <Image
              src="/images/header-images/header-colored-logo.png"
              alt="Sajilo Jiwan"
              layout="fill"
              objectFit="contain"
            />
          </div>

          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "var(--color-gray)", fontSize: "1.5rem" }}
            onClick={handleSideBarOpen}
          />
        </div>
        <div className={styles.responsive__sidebar__menu}>
          <div className={styles.booking__lists}>
            <ul>
              {SIDEBAROPTIONS.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleCurrentOptionIndexChange(index)}
                  className={currentOptionIndex === index ? styles.active : ""}
                >
                  {option.linkName}
                  {""}
                  {currentOptionIndex === index && (
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{
                        fontSize: "1rem",
                        color: "var(--color-blue-2)",
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.user__settings}>
            <ul>
              {/* <li>
                <div
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <Image
                    src="/images/user-card/profile.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                View Profile
              </li>
              <li>
                <div
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <Image
                    src="/images/user-card/settings.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                Settings
              </li> */}
              <li onClick={handleSignOut}>
                <div
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <Image
                    src="/images/user-card/logout.svg"
                    alt="profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                Log Out
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
