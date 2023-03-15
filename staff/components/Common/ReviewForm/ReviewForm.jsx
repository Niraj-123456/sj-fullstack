import React from "react";
import styles from "./reviewform.module.css";

import InputField from "../InputField";
import TextArea from "../TextArea";
import FormButton from "../FormButton";

import { Formik } from "formik";
import * as Yup from "yup";

function ReviewForm({
  heading,
  handleDrawerClose,
  handleSubmit,
  reviewData,
  addUpdateReviewData,
  viewReview,
  setViewReview,
  isEditable,
}) {
  const reviewValidationSchema = Yup.object().shape({
    serviceRating: Yup.number()
      .typeError("You must enter a number.")
      .min(1, "Booking Rating must not be less than 1.")
      .max(5, "Booking Rating must not be greate than 5.")
      .required("Booking Rating is required.")
      .test(
        "isMultipleOfPoint5Test",
        `Booking Rating must in the multiple of 0.5`,
        function (value) {
          return value % 0.5 === 0;
        }
      ),
    employeeRating:
      reviewData?.serviceProvider !== null
        ? Yup.number()
            .typeError("You must enter a number.")
            .min(1, "Employee Rating must not be less than 1.")
            .max(5, "Employee Rating must not be greate than 5.")
            .required("Employee Rating is required.")
            .test(
              "isMultipleOfPoint5Test",
              `Employee Rating must in the multiple of 0.5`,
              function (value) {
                return value % 0.5 === 0;
              }
            )
        : Yup.number(),
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.content}>
        <Formik
          initialValues={{
            status: addUpdateReviewData?.reviewedBooking?.status || "",
            reviewId: addUpdateReviewData?.id || "",
            bookingId:
              reviewData?.id || addUpdateReviewData?.reviewedBooking?.id,
            serviceRating:
              reviewData?.bookingReview?.serviceRating ||
              addUpdateReviewData?.serviceRating ||
              "",
            serviceRatingExplanation:
              reviewData?.bookingReview?.serviceRatingExplanation ||
              addUpdateReviewData?.serviceRatingExplanation ||
              "",
            ratedEmployeeId:
              reviewData?.serviceProvider?.id ||
              addUpdateReviewData?.ratedEmployee?.id ||
              "",
            ratedEmployeeName: reviewData?.serviceProvider
              ? reviewData?.serviceProvider?.firstName +
                " " +
                reviewData?.serviceProvider?.lastName
              : "" || addUpdateReviewData?.ratedEmployee
              ? addUpdateReviewData?.ratedEmployee?.firstName +
                " " +
                addUpdateReviewData?.ratedEmployee?.lastName
              : "",
            employeeRating:
              reviewData?.bookingReview?.employeeRating ||
              addUpdateReviewData?.employeeRating ||
              "",
            employeeRatingExplanation:
              reviewData?.bookingReview?.employeeFeedbackExplanation ||
              addUpdateReviewData?.employeeFeedbackExplanation ||
              "",
          }}
          validationSchema={reviewValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({
            dirty,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {viewReview && (
                <>
                  <div className={styles.form__input__group}>
                    <InputField
                      label="Review ID"
                      type="text"
                      name="reviewId"
                      id="reviewId"
                      value={values.reviewId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ width: "100%" }}
                      disabled={true}
                    />
                    {errors.reviewId && touched.reviewId && (
                      <div className="error__message">{errors.reviewId}</div>
                    )}
                  </div>
                </>
              )}
              <div className={styles.form__input__group}>
                <InputField
                  label="Booking ID"
                  type="text"
                  name="bookingId"
                  id="bookingId"
                  value={values.bookingId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ width: "100%" }}
                  disabled={true}
                />
                {errors.bookingId && touched.bookingId && (
                  <div className="error__message">{errors.bookingId}</div>
                )}
              </div>
              <div className={styles.form__input__group}>
                <InputField
                  label="Booking Rating"
                  type="text"
                  name="serviceRating"
                  id="serviceRating"
                  value={values.serviceRating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ width: "100%" }}
                  disabled={viewReview}
                />
                {errors.serviceRating && touched.serviceRating && (
                  <div className="error__message">{errors.serviceRating}</div>
                )}
              </div>
              <div className={styles.form__input__group}>
                <TextArea
                  label="Booking Explanation"
                  type="text"
                  name="serviceRatingExplanation"
                  id="serviceRatingExplanation"
                  value={values.serviceRatingExplanation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={viewReview}
                  style={{ fontWeight: "400" }}
                />
                {errors.serviceRatingExplanation &&
                  touched.serviceRatingExplanation && (
                    <div className="error__message">
                      {errors.serviceRatingExplanation}
                    </div>
                  )}
              </div>
              {reviewData?.serviceProvider !== null &&
                addUpdateReviewData?.ratedEmployee !== null && (
                  <>
                    <div className={styles.form__input__group}>
                      <InputField
                        label="Employee ID"
                        type="text"
                        name="ratedEmployeeId"
                        id="ratedEmployeeId"
                        value={values.ratedEmployeeId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ width: "100%" }}
                        disabled={true}
                      />
                      {errors.ratedEmployeeId && touched.ratedEmployeeId && (
                        <div className="error__message">
                          {errors.ratedEmployeeId}
                        </div>
                      )}
                    </div>
                    <div className={styles.form__input__group}>
                      <InputField
                        label="Employee Name"
                        type="text"
                        name="ratedEmployeeName"
                        id="ratedEmployeeName"
                        value={values.ratedEmployeeName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ width: "100%" }}
                        disabled={true}
                      />
                      {errors.ratedEmployeeName &&
                        touched.ratedEmployeeName && (
                          <div className="error__message">
                            {errors.ratedEmployeeName}
                          </div>
                        )}
                    </div>
                    <div className={styles.form__input__group}>
                      <InputField
                        label="Employee Rating"
                        type="text"
                        name="employeeRating"
                        id="employeeRating"
                        value={values.employeeRating}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ width: "100%" }}
                        disabled={viewReview}
                      />
                      {errors.employeeRating && touched.employeeRating && (
                        <div className="error__message">
                          {errors.employeeRating}
                        </div>
                      )}
                    </div>
                    <div className={styles.form__input__group}>
                      <TextArea
                        label="Employee Explanation"
                        type="text"
                        name="employeeRatingExplanation"
                        id="employeeRatingExplanation"
                        value={values.employeeRatingExplanation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={viewReview}
                        style={{ fontWeight: "400" }}
                      />
                      {errors.employeeRatingExplanation &&
                        touched.employeeRatingExplanation && (
                          <div className="error__message">
                            {errors.employeeRatingExplanation}
                          </div>
                        )}
                    </div>
                  </>
                )}
              {isEditable && (
                <div className={styles.form__button__group}>
                  <>
                    <FormButton
                      label={viewReview ? "Back" : "Cancel"}
                      type="button"
                      onClick={handleDrawerClose}
                      style={{
                        background: "var(--color-gray-2)",
                        width: "150px",
                        borderRadius: "4px",
                      }}
                    />
                    {viewReview ? (
                      <FormButton
                        label="Edit"
                        type="button"
                        onClick={() => setViewReview(false)}
                        style={{
                          width: "150px",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <FormButton
                        label={
                          reviewData?.bookingReview === null ? "Add" : "Update"
                        }
                        type="submit"
                        disabled={!dirty || !isValid || isSubmitting}
                        style={{
                          width: "150px",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </>
                </div>
              )}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ReviewForm;
