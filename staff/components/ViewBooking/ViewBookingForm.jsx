import React, { useState } from "react";

import InputField from "../Common/InputField";
import SelectField from "../Common/SelectField";
import TextArea from "../Common/TextArea";

const styles = {
  input__field: {
    marginTop: "20px",
  },
};

function ViewBookingForm({ bookingValues, options }) {
  const defaultServices = bookingValues.associatedServices?.map((services) => {
    return { id: services.id, label: services.label, value: services.name };
  });

  return (
    <div>
      <div style={styles.input__field}>
        <InputField
          name="bookingId"
          label="Booking ID"
          defaultValue={bookingValues.id}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
      <div style={styles.input__field}>
        <InputField
          name="customerName"
          label="Name"
          defaultValue={bookingValues.clientWhoUses?.fullName}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
      <div style={styles.input__field}>
        <SelectField
          isMulti
          label="Associated Services"
          name="associatedServices"
          options={options}
          value={defaultServices.map((service) => {
            return service.id;
          })}
          defaultValue={defaultServices}
          style={{ width: "100%" }}
          isDisabled
          controlStyles={{ minHeight: "46px" }}
          dropdownIndicatorStyles={{ display: "none" }}
        />
      </div>
      <div style={styles.input__field}>
        <InputField
          label="Status"
          name="status"
          defaultValue={bookingValues.status}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
      <div style={styles.input__field}>
        <InputField
          label="Discount Applied"
          name="discountApplied"
          defaultValue={bookingValues.discounts?.map((discount) => {
            return discount.id;
          })}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
      <div style={styles.input__field}>
        <InputField
          label="Service Provider"
          name="serviceProvider"
          defaultValue={
            bookingValues.serviceProvider?.firstName +
              bookingValues.serviceProvider?.lastName || ""
          }
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
      <div style={styles.input__field}>
        <InputField
          label="Employee Rating"
          name="employeeRating"
          defaultValue={bookingValues.bookingReview?.employeeRating}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>

      <div style={styles.input__field}>
        <InputField
          label="Service Rating"
          name="serviceRating"
          defaultValue={bookingValues.bookingReview?.serviceRating}
          style={{ width: "100%" }}
          disabled={true}
        />
      </div>
    </div>
  );
}

export default ViewBookingForm;
