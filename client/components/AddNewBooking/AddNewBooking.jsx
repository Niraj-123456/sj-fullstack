import React, { useState } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import AuthenticatedBookingForm from "../Common/AuthenticatedBookingForm/AuthenticatedBookingForm";
import { createBookingWithRecommedation } from "../https/bookingServices";
// import { getExistingClient } from "../https/adminServices";
import { addNewBooking } from "../../redux/features/clients/clientBookingSlice";
import { togglePageLoadingState } from "../../redux/features/loading/loadingSlice";

function AddNewBooking({
  currentUser,
  drawerOpen,
  discountId,
  handleDrawerClose,
}) {
  const dispatch = useDispatch();
  const [existingClient, setExistingClient] = useState();
  const unfilteredSource = useSelector(
    (state) =>
      state.persistedReducer.visitor?.visitorInfo?.deviceInfo
        ?.unfilteredSourceInfo
  );

  const services = useSelector(
    (state) =>
      state.persistedReducer.homePage?.homeData?.detailedBookingRow
        ?.serviceList || []
  );

  const bookingDiscounts = useSelector(
    (state) => state.clientReducer?.bookings?.discounts
  );

  const options = services?.map((service) => {
    return { id: service.id, value: service.name, label: service.label };
  });

  const discountOptions = bookingDiscounts?.map((discount) => {
    return { value: discount, label: discount };
  });

  const handleSubmit = async (values, resetForm) => {
    // setServerResponse("");
    if (currentUser) {
      handleDrawerClose();
      const newValues = "";
      for (const field in values) {
        if (
          values[field] === "" ||
          values[field] === null ||
          values[field] === undefined ||
          values[field] === []
        ) {
          delete values[field];
        }
        newValues = values;
      }
      try {
        dispatch(togglePageLoadingState());
        const { data } = await createBookingWithRecommedation(
          newValues,
          unfilteredSource
        );
        if (data.success) {
          dispatch(addNewBooking(data.data?.bookingDetails));
          dispatch(togglePageLoadingState());
          resetForm();
          // setServerResponse(data.message);
          toast.success(data.message);
        }
      } catch (ex) {
        dispatch(togglePageLoadingState());
        toast.error("An unexpected error occurred.");
      }
    } else return;
  };

  return (
    <DrawerContainer
      heading="Add New Booking"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <AuthenticatedBookingForm
        handleSubmit={handleSubmit}
        currentUser={currentUser}
        existingClient={existingClient}
        options={options}
        discountOptions={discountOptions}
        discountId={discountId}
        handleDrawerClose={handleDrawerClose}
      />
    </DrawerContainer>
  );
}

export default AddNewBooking;
