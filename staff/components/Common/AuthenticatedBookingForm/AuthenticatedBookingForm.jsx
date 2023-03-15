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
  existingClient,
  handleCheckClientExists,
  handleSubmit,
  options,
  handleDrawerClose,
}) {
  const [newService, setNewService] = useState("");
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
    fullName: Yup.string().required("Name is required."),
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

  // get the discounts of the existing users
  const EXISTINGCLIENTDISCOUNTS =
    existingClient?.associatedSingleDiscounts.filter((discount) => {
      return (
        discount.expirationType === "ResuableCount" &&
        discount.isDiscountUsable &&
        discount.reusuableCountLeft > 0
      );
    });

  const EXISTINGCLIENTDISCOUNTOPTIONS = EXISTINGCLIENTDISCOUNTS?.map(
    (discount) => {
      return { label: discount.id, value: discount.id };
    }
  );

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          fullName: existingClient?.fullName || "",
          contactNumber: existingClient?.phoneNumber || "",
          explanation: "",
          servicesIds: [],
          discountId: "",
          newRequestedServices: [],
          bookingSourceForm: getBookingSourceForm(),
          isForSelf: false,
        }}
        enableReinitialize={true}
        validationSchema={addBookingValidation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values);
          setSubmitting(false);
          resetForm();
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

                  <FormButton
                    disabled={
                      errors.contactNumber ||
                      values.contactNumber === "" ||
                      values.contactNumber === null ||
                      values.contactNumber === undefined
                    }
                    type="button"
                    label={
                      !isPartialLoading ? (
                        "Check"
                      ) : (
                        <CircularLoading
                          progressStyles={{ color: "var(--color-white)" }}
                          size={30}
                          thickness={3}
                        />
                      )
                    }
                    style={{
                      alignItems: "flex-end",
                    }}
                    onClick={() =>
                      handleCheckClientExists(values.contactNumber)
                    }
                  />
                </div>
                {errors.contactNumber && touched.contactNumber && (
                  <div className="error__message">{errors.contactNumber}</div>
                )}
              </div>
            </>

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
                style={{ fontWeight: "400" }}
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
                options={EXISTINGCLIENTDISCOUNTOPTIONS || []}
                value={values.discountId}
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
                    label={
                      <>
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: "5px" }}
                        />
                        <span>Add</span>
                      </>
                    }
                    type="button"
                    disabled={
                      newService === "" ||
                      newService === null ||
                      newService === undefined
                    }
                    onClick={() => {
                      setNewService("");
                      setFieldValue("newRequestedServices", [
                        ...values.newRequestedServices,
                        newService,
                      ]);
                    }}
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
