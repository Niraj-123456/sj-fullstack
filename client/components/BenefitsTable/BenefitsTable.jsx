import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import styles from "./benefitstable.module.css";

import ClientTable from "../Common/ClientTable/ClientTable";
import AddNewBooking from "../AddNewBooking/AddNewBooking";
import CircularLoading from "../Common/CircularLoading";
import {
  benefitsTableData,
  benefitsMetaData,
  benefitsError,
} from "../../redux/features/clients/clientBenefitSlice";
import { getBenefitsData } from "../https/userPageData";
import { toggleClientLoadingState } from "../../redux/features/clients/loadingSlice";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

function BenefitsTable({
  heading,
  currentUser,
  pageSize,
  currentLeftSideBarTab,
  setServerResponse,
}) {
  //custom styles for client table
  const customTableStyles = {
    table: { borderCollaspe: "collaspe", borderSpacing: "0px 0px" },
    td: {
      borderRadius: "0px",
      borderBottom: "solid 1px var(--color-gray-4)",
    },
  };

  const dispatch = useDispatch();
  const referralTokenRef = useRef(); // reference for referral token
  const [copied, setCopied] = useState(false); // check if referral token copied
  const [open, setOpen] = useState(false); // state to open or close the add booking drawer
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [discountId, setDiscountId] = useState({});

  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  const benefitsData = useSelector(
    (state) => state.clientReducer?.benefits?.benefitsData
  );

  const metaData = useSelector(
    (state) => state.clientReducer?.benefits?.metaData
  );

  const handlePageChange = (page) => {
    setCurrentPageIndex(page);
  };

  // close the add booking drawer
  const handleClose = () => {
    setOpen(false);
  };

  //copy referral code to clipboard
  const copyReferralCode = (e) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralTokenRef.current?.value);
      setCopied(true);
    }
  };

  useEffect(() => {
    const disappear = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(disappear);
  }, [copied]);

  //get benefits table data
  const handleFetchBenefitsTableData = useCallback(async () => {
    try {
      dispatch(toggleClientLoadingState());
      const { data } = await getBenefitsData(pageSize, currentPageIndex);
      const benefits = data.items.map((item) => {
        return item;
      });
      if (data) {
        dispatch(benefitsTableData(benefits));
        dispatch(benefitsMetaData(data.meta));
        dispatch(toggleClientLoadingState());
      }
    } catch (ex) {
      dispatch(toggleClientLoadingState());
      dispatch(benefitsError(ex.response));
    }
  }, [currentPageIndex, dispatch, pageSize]);

  useEffect(() => {
    if (currentLeftSideBarTab === 1) {
      handleFetchBenefitsTableData();
    }
  }, [currentPageIndex, currentLeftSideBarTab, handleFetchBenefitsTableData]);

  const data = useMemo(() => benefitsData, [benefitsData]);

  // const initialState = { pageSize: pageSize };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableSortBy: true,
      },
      {
        Header: "Referrer | Referee Name",
        accessor: "linkedDiscount.associatedSingleUser",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => {
          return (
            <div
              style={{
                display: "flex",
                gap: "3px",
                flexDirection: "column",
              }}
            >
              <span>{value?.firstName + " " + value?.lastName}</span>
              <span style={{ color: "#2599F9" }}>{value?.phoneNumber}</span>
            </div>
          );
        },
      },
      {
        Header: "Registration Date",
        accessor: "createdDateTime",

        Cell: ({ cell: { value } }) => (
          <span>{moment(value).format("DD MMM YYYY, h:mm A")}</span>
        ),
      },
      {
        Header: "Offering Type",
        accessor: "offeringType",
        disableSortBy: true,
      },
      {
        Header: "Discount",
        accessor: (column) =>
          column.offeringType === "Percentage"
            ? column.discountedPercentage
            : column.discountedFlatAmount,
        disableSortBy: true,
        Cell: ({ row: { original } }) => {
          return (
            <span>
              {original.offeringType === "Percentage"
                ? `${original.discountedPercentage}% Off`
                : `Rs.${original.discountedFlatAmount} Off`}
            </span>
          );
        },
      },
      {
        Header: "Is Discount Usable",
        accessor: "isDiscountUsable",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => (
          <span>{value === true ? "Yes" : "No"}</span>
        ),
      },
      {
        Header: "Resuable Count Left",
        accessor: "reusuableCountLeft",
        disableSortBy: true,
      },
      {
        Header: "Expiration Date & Time",
        accessor: "expiryDateTime",
        disableSortBy: true,
        Cell: ({ cell: { value } }) => {
          return <span>{value === null ? "-" : value}</span>;
        },
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
          const [showAction, setShowAction] = useState(false);
          const handleShowAction = () => {
            setShowAction(!showAction);
          };

          // open add booking drawer when clicked on Book a service button
          const handleActionClick = (id) => {
            setOpen(true);
            setShowAction(false);
            setDiscountId({ label: id.toString(), value: id.toString() });
          };

          return (
            <span style={{ position: "relative" }}>
              <FontAwesomeIcon
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "10px",
                }}
                icon={faEllipsisVertical}
                onClick={handleShowAction}
              />
              {showAction && (
                <button
                  disabled={
                    original.reusuableCountLeft === 0 ||
                    !original.isDiscountUsable
                  }
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "20px",
                    background: "#ffffff",
                    width: "140px",
                    height: "40px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0px 4px 12px rgba(38, 38, 38, 0.08)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleActionClick(original.id)}
                >
                  Book a Service
                </button>
              )}
            </span>
          );
        },
      },
    ]);
  };

  if (isPageLoading) {
    return (
      <CircularLoading
        progressStyles={{ color: "var(--color-blue)" }}
        size={50}
        thickness={5}
      />
    );
  }

  return (
    <>
      {open && (
        <AddNewBooking
          drawerOpen={open}
          discountId={discountId}
          currentUser={currentUser}
          setServerResponse={setServerResponse}
          handleDrawerClose={handleClose}
        />
      )}
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.referral__code__container}>
        <div className={styles.referral__icon}>
          <Image
            src="/images/referral-icon.svg"
            alt="Referral Icon"
            height="21px"
            width="19px"
            objectFit="contain"
          />
        </div>
        <div className={styles.referral__description}>
          <h3>Your referral Code</h3>
          <p>
            Ask your friends to enter your code inorder to claim discount on
            their next service booking.
          </p>
        </div>

        {/* input field for referral code */}
        <div className={styles.referral__code}>
          <input
            value={currentUser?.referralToken}
            ref={referralTokenRef}
            disabled
            style={{ position: "relative", fontSize: "16px" }}
          />

          <div
            style={{
              position: "absolute",
              right: "10%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <FontAwesomeIcon
              icon={faCopy}
              style={{
                fontSize: "24px",
                color: "var(--color-blue)",
                cursor: "pointer",
              }}
              onClick={copyReferralCode}
            />
          </div>
        </div>
        {copied && (
          <span
            style={{
              marginLeft: "10px",
              color: "var(--color-blue)",
              transition: "all 350ms ease-in-out",
            }}
          >
            Copied!
          </span>
        )}
      </div>

      {/*referral table */}
      <ClientTable
        tableStyles={customTableStyles}
        showFilters={false}
        tableTitle="Referral Details"
        columns={columns}
        data={data}
        customColumn={customColumn}
        currentPage={currentPageIndex}
        pageSize={pageSize}
        itemCounts={metaData?.totalItemsCount}
        handlePageChange={handlePageChange}
        // initialState={initialState}
      />
    </>
  );
}

export default BenefitsTable;
