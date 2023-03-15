import React from "react";
import Link from "next/link";
import styles from "./initialbooking.module.css";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Form from "../Common/Form/Form";
import ImageSlider from "../Common/ImageSlider/ImageSlider";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { createDetailedBooking } from "../https/bookingServices";
import { clientBasePath } from "../../utils/apiRoutes";

function InitialBooking({ handleModalOpen, currentUser }) {
  const dispatch = useDispatch();

  const services = useSelector(
    (state) =>
      state.persistedReducer.homePage?.homeData?.detailedBookingRow
        ?.serviceList ||
      state.persistedReducer.homePage?.homeData?.detailedBooking?.serviceList ||
      ""
  );

  const unfilteredSourceInfo = useSelector(
    (state) =>
      state.persistedReducer.visitor?.visitorInfo?.deviceInfo
        ?.unfilteredSourceInfo
  );

  const handleDetailedBooking = async (values, resetForm) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await createDetailedBooking(
        values,
        unfilteredSourceInfo
      );
      if (data.success) {
        dispatch(togglePartialLoadingState());
        handleModalOpen();
        resetForm();
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ImageSlider />
        {!currentUser ? (
          <Form
            services={services}
            handleDetailedBooking={handleDetailedBooking}
          />
        ) : (
          <div className={styles.initial__form__loggedIn__content}>
            <h1>Monitor Your Booking</h1>
            <p>
              Go to dashboard and see the actual status of your booking whether
              it is confirmed or in progress. See the actual discounts and
              benefits you can get per booking.
            </p>
            <div className={styles.initial__form__booknow}>
              <Link href={`${clientBasePath}/mybooking`}>
                <a>Go To Dashboard</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InitialBooking;
