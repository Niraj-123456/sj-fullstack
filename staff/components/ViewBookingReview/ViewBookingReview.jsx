import React from "react";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import ReviewForm from "../Common/ReviewForm/ReviewForm";

function ViewBookingReview({ drawerOpen, handleDrawerClose, reviewData }) {
  console.log("Hello");
  return (
    <DrawerContainer
      heading="View Review"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <ReviewForm
        reviewData={reviewData}
        handleDrawerClose={handleDrawerClose}
        isEditable={false}
      />
    </DrawerContainer>
  );
}

export default ViewBookingReview;
