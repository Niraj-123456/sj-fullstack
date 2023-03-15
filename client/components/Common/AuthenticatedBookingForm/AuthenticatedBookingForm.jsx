import React, { useState } from "react";
import styles from "./authenticatedbookingform.module.css";

import InputField from "../InputField";
import PhoneNumberInput from "../PhoneNumberInput";
import SelectField from "../SelectField";
import TextArea from "../TextArea";
import FormButton from "../FormButton";
import CircularLoading from "../CircularLoading";

import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";

function AuthenticatedBookingForm({
  currentUser,
  handleSubmit,
  options,
  discountOptions,
  discountId,
  handleDrawerClose,
}) {
  const [newService, setNewService] = useState("");
  const [isBookingForSelf, setBookingForSelf] = useState(true);

  const isPageLoading = useSelector((state) => state.isLoading?.isPageLoading);
  const isPartialLoading = useSelector(
    (state) => state.isLoading?.isPartialLoading
  );

  const serviceGroup = [
    {
      label: "Available Services",
      options: options,
    },
  ];

  const addBookingValidation = Yup.object().shape({
    fullName: !isBookingForSelf
      ? Yup.string().required("Name is required.")
      : Yup.string(),
    contactNumber: Yup.string()
      .min(10, "Phone number must be 10 digits.")
      .max(10, "Phone number should not exceed 10 digits.")
      .required("Phone number is required.")
      .phone("NP", true, "Invalid Phone number format."),
    servicesIds: Yup.array()
      .min(1, "At least one service should be selected.")
      .required(),
    explanation: Yup.string().required("Message is required."),
  });

  // get the booking Source
  const getBookingSourceForm = () => {
    if (currentUser && currentUser?.userRole?.name === "DEFAULTCLIENT")
      return "WebAppLoggedInUserForm";
    if (currentUser && currentUser?.userRole?.name === "DEFAULTSTAFF")
      return "WebAppLoggedInStaffForm";
    else return "WebAppInitialUserForm";
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          fullName: currentUser?.firstName + " " + currentUser?.lastName || "",
          contactNumber: currentUser?.phoneNumber || "",
          explanation: "",
          servicesIds: [],
          discountId: discountId ? discountId.value : "",
          newRequestedServices: [],
          bookingSourceForm: getBookingSourceForm(),
          isForSelf: true,
        }}
        validationSchema={addBookingValidation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({
          dirty,
          errors,
          values,
          touched,
          isValid,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                id="isForSelf"
                name="isForSelf"
                checked={values.isForSelf}
                onChange={() => {
                  setFieldValue("isForSelf", !values.isForSelf);
                  setBookingForSelf(!isBookingForSelf);
                }}
              />
              <label
                id="is-booker"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Are you booking for yourself?
              </label>
            </div>

            {!values.isForSelf && (
              <>
                <div className={styles.input__group}>
                  <InputField
                    label="Name"
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={values.fullName}
                    placeholder="Enter your name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: "100%" }}
                  />
                  {errors.fullName && touched.fullName && (
                    <div className="error__message">{errors.fullName}</div>
                  )}
                </div>
                <div className={styles.input__group}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <PhoneNumberInput
                      label="Phone"
                      name="contactNumber"
                      type="text"
                      id="contactNumber"
                      icon="+977 - "
                      value={values.contactNumber}
                      placeholder="Enter phone number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ width: "100%" }}
                    />
                  </div>
                  {errors.contactNumber && touched.contactNumber && (
                    <div className="error__message">{errors.contactNumber}</div>
                  )}
                </div>
              </>
            )}
            <div className={styles.input__group}>
              <SelectField
                isMulti
                name="servicesIds"
                id="servicesIds"
                options={serviceGroup}
                value={values.servicesIds}
                label="How can we assist you?"
                placeholder="Select Services"
                onChange={(option) => {
                  setFieldValue(
                    "servicesIds",
                    option.map((o) => o.id)
                  );
                }}
                onBlur={() => handleBlur({ target: { name: "servicesIds" } })}
                controlStyles={{ minHeight: "46px" }}
              />
              {errors.servicesIds && touched.servicesIds && (
                <div className="error__message">{errors.servicesIds}</div>
              )}
            </div>
            <div className={styles.input__group}>
              <TextArea
                label="Type Your Message"
                type="text"
                id="explanation"
                name="explanation"
                value={values.explanation}
                placeholder="Type here..."
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.explanation && touched.explanation && (
                <div className="error__message">{errors.explanation}</div>
              )}
            </div>
            <div className={styles.input__group}>
              <SelectField
                isMulti={false}
                isClearable={true}
                label="Available Discounts"
                id="discountId"
                name="discountId"
                placeholder="Select Discounts"
                options={discountOptions}
                value={values.discountId}
                defaultValue={discountId}
                onChange={(option) =>
                  setFieldValue("discountId", option?.value.toString())
                }
                onBlur={() => handleBlur({ target: { name: "discountId" } })}
                controlStyles={{ height: "46px" }}
              />
            </div>

            <div className={styles.input__group}>
              <div style={{ display: "flex", gap: "5px" }}>
                <InputField
                  label="Request new Service"
                  type="text"
                  name="newService"
                  id="newService"
                  value={newService}
                  placeholder="Enter new Service"
                  onChange={(e) => setNewService(e.target.value)}
                  onBlur={handleBlur}
                  style={{ width: "100%" }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100px",
                  }}
                >
                  <FormButton
                    label="Add"
                    type="button"
                    icon={
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginRight: "5px" }}
                      />
                    }
                    onClick={() => {
                      setNewService("");
                      setFieldValue("newRequestedServices", [
                        ...values.newRequestedServices,
                        newService,
                      ]);
                    }}
                    disabled={
                      newService === "" ||
                      newService === "undefined" ||
                      newService === null
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
              {values.newRequestedServices.length > 0 &&
                values.newRequestedServices.map(
                  (newRequestedService, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        background: "#10B981",
                        borderRadius: "999px",
                        padding: "5px 10px",
                        color: "var(--color-white)",
                      }}
                    >
                      {newRequestedService}{" "}
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFieldValue(
                            "newRequestedServices",
                            values.newRequestedServices.filter(
                              (value) => value !== newRequestedService
                            )
                          );
                        }}
                      />
                    </div>
                  )
                )}
            </div>

            <div className={styles.button__group}>
              <FormButton
                type="button"
                label="Cancel"
                disabled={isPageLoading}
                style={{
                  background: "var(--color-gray-3)",
                  borderRadius: "3px",
                  width: "150px",
                }}
                onClick={handleDrawerClose}
              />
              <FormButton
                type="submit"
                label={
                  !isPageLoading ? (
                    "Add"
                  ) : (
                    <CircularLoading
                      progressStyles={{
                        color: "var(--color-white)",
                      }}
                      size={30}
                      thickness={3}
                    />
                  )
                }
                disabled={!dirty || !isValid || isSubmitting}
                style={{
                  borderRadius: "3px",
                  width: "150px",
                }}
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default AuthenticatedBookingForm;
