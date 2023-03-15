import React from "react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import CustomBookingEditForm from "../Common/CustomBookingEditForm/CustomBookingEditForm";
import { updateBooking } from "../https/adminServices";
import { updateBookingByStaff } from "../../redux/features/admin/bookingSlice";
import { togglePageLoadingState } from "../../redux/features/loading/loadingSlice";

function EditBooking({ drawerOpen, handleDrawerClose, editValues }) {
  const dispatch = useDispatch();

  // get list of services
  const services = useSelector(
    (state) => state.adminReducer?.dashboard?.serviceLists || []
  );

  const serviceOptions = services?.map((service) => {
    return { id: service?.id, value: service?.value, label: service?.label };
  });

  const SERVICELISTGROUP = [
    { label: "Available Services", options: serviceOptions },
  ];

  // booking status list
  const bookingStatuses = useSelector(
    (state) => state.persistedReducer.bookingOptionLists?.bookingStatuses
  );

  const handleSubmit = async (values) => {
    const newValues = "";
    for (const field in values) {
      if (
        values[field] === "" ||
        values[field] === null ||
        values[field] === undefined ||
        field === "discountId"
      ) {
        delete values[field];
      }
      newValues = values;
    }
    handleDrawerClose();
    try {
      dispatch(togglePageLoadingState(true));
      const { data } = await updateBooking(newValues);
      if (data.success) {
        dispatch(updateBookingByStaff(data.data.bookingDetails));
        dispatch(togglePageLoadingState(false));
        toast.success(data.message);
      }
    } catch (ex) {
      dispatch(togglePageLoadingState(false));
      toast.error("An error occured when updating booking.");
    }
  };

  return (
    <DrawerContainer
      heading="Edit Booking"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <CustomBookingEditForm
        handleSubmit={handleSubmit}
        serviceOptions={SERVICELISTGROUP}
        bookingStatusOptions={bookingStatuses}
        handleDrawerClose={handleDrawerClose}
        editData={editValues}
      />
    </DrawerContainer>
  );
}

export default EditBooking;
