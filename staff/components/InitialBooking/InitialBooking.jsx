import React from "react";
import Link from "next/link";
import styles from "./initialbooking.module.css";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Form from "../Common/Form/Form";
import ImageSlider from "../Common/ImageSlider/ImageSlider";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { createDetailedBooking } from "../https/bookingServices";
import { staffBasePath } from "../../utils/apiRoutes";

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
      console.log(data);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        resetForm();
        handleModalOpen();
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      console.log(ex);
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
            <h1>Some Header</h1>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia
              sequi, temporibus hic recusandae praesentium magni veritatis
              adipisci atque molestias et minus aspernatur enim, quasi
              dignissimos, eum libero quae nam totam.
            </p>
            <div className={styles.initial__form__booknow}>
              <Link href={`${staffBasePath}/mybooking`}>
                <a>Book Now</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InitialBooking;
