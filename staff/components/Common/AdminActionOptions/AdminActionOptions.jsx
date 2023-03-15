import React, { useState } from "react";
import styles from "./adminactionoptions.module.css";

function AdminActionOptions({
  handleBookingView,
  handleBookingEdit,
  handleBookingReview,
  setOpenActionOptions,
  showReviewOption,
  hasBookingReview,
}) {
  const handleBookingViewByAdmin = () => {
    handleBookingView();
    setOpenActionOptions(false);
  };

  const handleBookingEditByAdmin = () => {
    handleBookingEdit();
    setOpenActionOptions(false);
  };

  const handleBookingReviewByAdmin = () => {
    handleBookingReview();
    setOpenActionOptions(false);
  };
  return (
    <div className={styles.container}>
      <ul className={styles.action__lists}>
        <li onClick={handleBookingViewByAdmin}>View</li>
        <li onClick={handleBookingEditByAdmin}>Edit</li>
        <li>Delete</li>
        {hasBookingReview && (
          <li onClick={handleBookingReviewByAdmin}>View Review</li>
        )}
        <li
          style={!showReviewOption ? { display: "block" } : { display: "none" }}
          onClick={handleBookingReviewByAdmin}
        >
          {hasBookingReview !== null ? "Edit Review" : "Add Review"}
        </li>
      </ul>
    </div>
  );
}

export default AdminActionOptions;
