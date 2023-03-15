import React from "react";
import styles from "./custombookingeditform.module.css";

import InputField from "../InputField";
import PhoneNumberInput from "../PhoneNumberInput";
import SelectField from "../SelectField";
import TextArea from "../TextArea";
import FormButton from "../FormButton";
import CircularLoading from "../CircularLoading";

import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";

function CustomBookingEditForm({
  serviceOptions,
  bookingStatusOptions,
  handleDrawerClose,
  editData,
  handleSubmit,
}) {
  const validation = Yup.object().shape({
    fullName: Yup.string().required("Name is required."),
    contactNumber: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .phone("NP", true, "Phone number must be valid"),
    servicesIds: Yup.array()
      .min(1, "At least one option is required.")
      .required("Service is required"),
    explanation: Yup.string().required("Message is required."),
  });

  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);

  const serviceList = editData.associatedServices?.map((service) => {
    return { id: service.id, label: service.label, value: service.name };
  });

  const discountId = editData.discounts.map((discount) => {
    return discount.id;
  });

  return (
    <Formik
      initialValues={{
        bookingId: editData.id,
        status: editData.status,
        fullName: editData.clientWhoUses?.fullName,
        contactNumber: editData.clientWhoUses?.phoneNumber,
        servicesIds:
          serviceList.map((service) => {
            return service.id;
          }) || [],
        explanation: editData.explanation || "",
        clientWhoUsesId: editData.clientWhoUses?.id,
        discountId: discountId.toString() || "",
      }}
      validationSchema={validation}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleSubmit(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({
        dirty,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        setFieldValue,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className={styles.input__container}>
            <SelectField
              id="status"
              name="status"
              options={bookingStatusOptions}
              value={values.status}
              onChange={(selectedOption) =>
                setFieldValue("status", selectedOption.value)
              }
              onBlur={() => handleBlur({ target: { name: "status" } })}
              defaultValue={{ value: editData.status, label: editData.status }}
              controlStyles={{
                width: "160px",
              }}
              menuStyles={{ width: "160px" }}
              singleValueStyles={{
                color: "var(--color-black)",
              }}
              dropdownIndicatorStyles={{
                color: "var(--color-black)",
              }}
            />
          </div>
          <div className={styles.input__container}>
            <InputField
              label="Name"
              name="fullName"
              id="fullName"
              value={values.fullName || ""}
              placeholder="Enter your name"
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: "100%" }}
            />
            {errors.fullName && touched.fullName && (
              <div className="error__message">{errors.fullName}</div>
            )}
          </div>
          <div className={styles.input__container}>
            <PhoneNumberInput
              label="Phone"
              name="contactNumber"
              id="contactNumber"
              value={values.contactNumber || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              icon="+977 - "
              style={{ width: "100%" }}
            />
            {errors.contactNumber && touched.contactNumber && (
              <div className="error__message">{errors.contactNumber}</div>
            )}
          </div>
          <div className={styles.input__container}>
            <label htmlFor="services" className={styles.select__label}>
              How can we assist you?
            </label>
            <SelectField
              isMulti
              name="servicesIds"
              options={serviceOptions}
              value={values.servicesIds}
              defaultValue={serviceList}
              onChange={(selectedOption) =>
                setFieldValue(
                  "servicesIds",
                  selectedOption.map((option) => option.id)
                )
              }
              onBlur={() => handleBlur({ target: { name: "servicesIds" } })}
              placeholder="Select Services"
              controlStyles={{ minHeight: "46px" }}
              dropdownIndicatorStyles={{ color: "var(--color-black)" }}
            />
            {errors.servicesIds && touched.servicesIds && (
              <div className="error__message">{errors.servicesIds}</div>
            )}
          </div>
          <div className={styles.input__container}>
            <TextArea
              label="Type Your Message"
              name="explanation"
              id="explanation"
              value={values.explanation || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Type message here..."
              style={{ fontWeight: "400" }}
            />
            {errors.explanation && touched.explanation && (
              <div className="error__message">{errors.explanation}</div>
            )}
          </div>
          <div className={styles.input__container}>
            <InputField
              label="Selected Discounts"
              id="discountId"
              name="discountId"
              value={values.discountId || ""}
              disabled={true}
              style={{ width: "100%" }}
            />
          </div>
          <div className={styles.btn__container}>
            <FormButton
              disabled={isPageLoading}
              onClick={handleDrawerClose}
              type="button"
              label="Cancel"
              style={{
                background: "#DBDBDB",
                color: "var(--color-black)",
                borderRadius: "3px",
                width: "150px",
              }}
            />
            <FormButton
              label={
                !isPageLoading ? (
                  "Update"
                ) : (
                  <CircularLoading
                    progressStyles={{ color: "var(--color-white)" }}
                    size={40}
                    thickness={3}
                  />
                )
              }
              disabled={!dirty || !isValid || isSubmitting}
              type="submit"
              style={{
                borderRadius: "3px",
                width: "150px",
              }}
            />
          </div>
        </form>
      )}
    </Formik>
  );
}

export default CustomBookingEditForm;
