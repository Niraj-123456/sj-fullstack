import React, { useState } from "react";
import styles from "./userreview&rating.module.css";

import ReviewForm from "../Common/ReviewForm/ReviewForm";
import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import { createBookingReview } from "../https/adminServices";
import { updateBookingReview } from "../../redux/features/admin/reviewSlice";
import { togglePageLoadingState } from "../../redux/features/loading/loadingSlice";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function UserReviewAndRating({
  openDrawer,
  onDrawerClose,
  addUpdateReviewData,
}) {
  const dispatch = useDispatch();
  const [viewReview, setViewReview] = useState(true);

  const handleSubmit = async (values) => {
    onDrawerClose();
    try {
      dispatch(togglePageLoadingState());
      const { data } = await createBookingReview(values);

      if (data.success) {
        dispatch(togglePageLoadingState());
        dispatch(updateBookingReview(data.data?.savedBookingReview));
        toast.success(data.message);
      }
    } catch (ex) {
      dispatch(togglePageLoadingState());
      toast.error(
        "An Unexpected error while submitting review. Please try again later"
      );
    }
  };

  return (
    <DrawerContainer
      heading="View Review & Rating"
      anchor="left"
      open={openDrawer}
      onClose={onDrawerClose}
    >
      <ReviewForm
        addUpdateReviewData={addUpdateReviewData}
        viewReview={viewReview}
        setViewReview={setViewReview}
        handleSubmit={handleSubmit}
        handleDrawerClose={onDrawerClose}
      />
    </DrawerContainer>
  );
}

export default UserReviewAndRating;
