import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./herosection.module.css";

import PhoneNumberInput from "../Common/PhoneNumberInput";
import Button from "../Common/Button";
import CircularLoading from "../Common/CircularLoading";
import { createBooking } from "../https/bookingServices";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";

import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";

function HeroSection({ handleModalOpen, currentUser }) {
  const dispatch = useDispatch();

  const heroContent = useSelector((state) =>
    state.persistedReducer.homePage?.homeData?.mainRow
      ? state.persistedReducer.homePage?.homeData?.mainRow
      : state.persistedReducer.homePage?.homeData?.heroRow
  );

  const unfilteredSourceInfo = useSelector(
    (state) =>
      state.persistedReducer.visitor?.visitorInfo?.deviceInfo
        ?.unfilteredSourceInfo
  );

  const isPartialLoading = useSelector(
    (state) => state.isLoading?.isPartialLoading
  );

  const handleBooking = async ({ phoneNumber: contactNumber }, resetForm) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await createBooking(contactNumber, unfilteredSourceInfo);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        handleModalOpen();
        // reset form on successful form submit
        resetForm();
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      console.log(ex);
      toast.error(ex.response?.data?.message);
    }
  };

  const phoneNumberSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .nullable()
      .min(10, "Phone number must be at least 10 digits.")
      .max(10, "Phone number must not exceed 10 digits.")
      .phone("NP", true, "Phone number must be valid."),
  });

  return (
    <div className={styles.container}>
      <Image src="/images/hero-image.png" alt="Hero" layout="fill" />

      <div className={styles.content}>
        <div className={styles.hero__content}>
          <h1 className={styles.hero__text__header}>
            {heroContent?.mainTitle}
          </h1>
          <p className={styles.hero__text__description}>
            {heroContent?.subText}
          </p>
          <div className={styles.cta}>
            {!currentUser ? (
              <Formik
                initialValues={{
                  phoneNumber: "",
                }}
                validationSchema={phoneNumberSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  handleBooking(values, resetForm);
                  setSubmitting(false);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <PhoneNumberInput
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        icon="+977 - "
                        placeholder="Enter Phone Number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inputdiv={styles.phonenumber__input__div}
                        inputicon={styles.phonenumber__input__icon}
                        input={styles.phonenumber__input}
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <div className="error__message">
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      label={
                        !isPartialLoading ? (
                          "Book Now"
                        ) : (
                          <CircularLoading
                            progressStyles={{ color: "#fff" }}
                            size={30}
                            thickness={4}
                          />
                        )
                      }
                      style={{ marginTop: "8px" }}
                    />
                  </form>
                )}
              </Formik>
            ) : (
              <div className={styles.responsive__cta__btn}>
                <Link href="/mybooking">
                  <a>Book Now</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
