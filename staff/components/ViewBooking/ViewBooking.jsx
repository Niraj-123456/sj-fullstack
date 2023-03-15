import React from "react";

import { useSelector } from "react-redux";

import DrawerContainer from "../Common/DrawerContainer/DrawerContainer";
import ViewBookingForm from "./ViewBookingForm";

function ViewBooking({ drawerOpen, handleDrawerClose, bookingValues }) {
  // get list of services
  const services = useSelector(
    (state) => state.adminReducer?.dashboard?.serviceLists || []
  );

  const serviceOptions = services?.map((service) => {
    return { id: service.id, value: service.name, label: service.label };
  });

  const SERVICELISTGROUP = [
    { label: "Available Services", options: serviceOptions },
  ];

  return (
    <DrawerContainer
      heading="View Booking"
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <ViewBookingForm
        bookingValues={bookingValues}
        options={SERVICELISTGROUP}
      />
    </DrawerContainer>
  );
}

export default ViewBooking;
