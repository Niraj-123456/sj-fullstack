import React, { useState } from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import AuthenticatedBookingForm from "../Common/AuthenticatedBookingForm/AuthenticatedBookingForm";
import { createBookingWithRecommedation } from "../https/bookingServices";
import { getExistingClient } from "../https/adminServices";
import { addBookingByStaff } from "../../redux/features/admin/bookingSlice";
import {
  togglePartialLoadingState,
  togglePageLoadingState,
} from "../../redux/features/loading/loadingSlice";

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
    (state) => state.adminReducer?.dashboard?.serviceLists || []
  );

  const bookingDiscounts = useSelector(
    (state) => state.clientReducer?.bookings?.discounts
  );

  const options = services?.map((service) => {
    return { id: service.id, value: service.value, label: service.label };
  });

  const discountOptions = bookingDiscounts?.map((discount) => {
    return { value: discount, label: discount };
  });

  // get the client's details if the phone number provided exist in database
  const handleCheckClientExists = async (phoneNumber) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await getExistingClient(phoneNumber);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        setExistingClient(data.data?.user);
        toast.success(data.message);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      console.log(ex);
      toast.error(ex.response?.data?.message);
    }
  };

  const handleSubmit = async (values) => {
    // setServerResponse("");
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
        dispatch(addBookingByStaff(data.data?.bookingDetails));
        dispatch(togglePageLoadingState());
        toast.success(data.message);
      }
    } catch (ex) {
      dispatch(togglePageLoadingState());
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <DrawerContainer
      heading="Add New Booking"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <AuthenticatedBookingForm
        handleCheckClientExists={handleCheckClientExists}
        handleSubmit={handleSubmit}
        currentUser={currentUser}
        existingClient={existingClient}
        options={options}
        handleDrawerClose={handleDrawerClose}
      />
    </DrawerContainer>
  );
}

export default AddNewBooking;
