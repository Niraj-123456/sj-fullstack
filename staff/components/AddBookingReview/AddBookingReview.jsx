import React from "react";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import ReviewForm from "../Common/ReviewForm/ReviewForm";
import { createBookingReview } from "../https/adminServices";
import { updateBookingReview } from "../../redux/features/admin/bookingSlice";
import { togglePageLoadingState } from "../../redux/features/loading/loadingSlice";

import _ from "lodash";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

function AddBookingReview({ drawerOpen, handleDrawerClose, reviewData }) {
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    handleDrawerClose();
    try {
      dispatch(togglePageLoadingState());
      const { data } = await createBookingReview(values);
      console.log(data);
      if (data.success) {
        const { savedBookingReview } = data?.data;
        dispatch(togglePageLoadingState());
        dispatch(updateBookingReview(savedBookingReview));
        toast.success(data.message);
      }
    } catch (ex) {
      dispatch(togglePageLoadingState());
      console.log(ex.response);
      toast.error(
        "An Unexpected error while submitting review. Please try again later"
      );
    }
  };

  return (
    <DrawerContainer
      heading={
        reviewData?.bookingReview === null
          ? "Add Review & Rating"
          : "Edit Review & Rating"
      }
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <ReviewForm
        reviewData={reviewData}
        handleDrawerClose={handleDrawerClose}
        handleSubmit={handleSubmit}
        isEditable={true}
      />
    </DrawerContainer>
  );
}

export default AddBookingReview;
