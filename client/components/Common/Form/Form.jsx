import React from "react";
import styles from "./form.module.css";

import PhoneNumberInput from "../PhoneNumberInput";
import InputField from "../InputField";
import Button from "../Button";
import TextArea from "../TextArea";
import SelectField from "../SelectField";
import CircularLoading from "../CircularLoading";
import { useSelector } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";

function Form({ services, handleDetailedBooking }) {
  const isPartialLoading = useSelector(
    (state) => state?.isLoading?.isPartialLoading
  );

  const SERVICEOPTIONS =
    services.length > 0
      ? services.map((service) => {
          return { id: service.id, label: service.label, value: service.name };
        })
      : [];

  const SERVICEOPTIONSGROUP = [
    {
      label: "Available Services",
      options: SERVICEOPTIONS,
    },
  ];

  const validation = Yup.object().shape({
    fullName: Yup.string().required("Name is required."),
    phone: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .phone("NP", true, "Phone number must be valid"),
    availableServices: Yup.array()
      .min(1, "At least one option is required.")
      .required("Service field is required."),
    message: Yup.string().required("Message is required."),
  });

  return (
    <div className={styles.booking__form}>
      <h1>{services?.heading}</h1>
      <Formik
        initialValues={{
          fullName: "",
          phone: "",
          availableServices: "",
          message: "",
          bookingSourceForm: "WebAppInitialUserForm",
          isForSelf: true,
        }}
        validationSchema={validation}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          handleDetailedBooking(values, resetForm);
          setSubmitting(false);
          // resetForm();
        }}
      >
        {({
          values,
          touched,
          errors,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <InputField
                label="Name"
                id="fullName"
                name="fullName"
                value={values.fullName}
                placeholder="Enter your full name"
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: "100%",
                }}
                labelstyle={{ fontWeight: "600" }}
              />
              {errors.fullName && touched.fullName && (
                <div className="error__message">{errors.fullName}</div>
              )}
            </div>
            <div>
              <PhoneNumberInput
                label="Phone"
                id="phone"
                name="phone"
                value={values.phone}
                placeholder="Enter your phone number"
                onChange={handleChange}
                onBlur={handleBlur}
                icon="+977 -"
                inputicon={styles.input__icon}
                input={styles.input}
                labelstyle={{ fontWeight: "600" }}
                style={{
                  width: "100%",
                }}
              />
              {errors.phone && touched.phone && (
                <div className="error__message">{errors.phone}</div>
              )}
            </div>
            <div>
              <SelectField
                isMulti
                label="How can we assist you?"
                name="availableServices"
                id="availableServices"
                value={values.availableServices}
                placeholder="Select Services"
                options={SERVICEOPTIONSGROUP}
                onChange={(option) =>
                  setFieldValue(
                    "availableServices",
                    option.map((o) => o.id)
                  )
                }
                onBlur={() =>
                  handleBlur({ target: { name: "availableServices" } })
                }
                controlStyles={{ minHeight: "46px" }}
                labelStyles={{ fontWeight: "600" }}
              />
              {errors.availableServices && touched.availableServices && (
                <div className="error__message">{errors.availableServices}</div>
              )}
            </div>
            <div>
              <TextArea
                label="Type Your Message"
                id="message"
                name="message"
                value={values.message}
                placeholder="Type here..."
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.message && touched.message && (
                <div className="error__message">{errors.message}</div>
              )}
            </div>
            <Button
              type="submit"
              label={
                !isPartialLoading ? (
                  "Submit"
                ) : (
                  <CircularLoading
                    progressStyles={{ color: "#fff" }}
                    size={30}
                    thickness={4}
                  />
                )
              }
              className={styles.submit__btn}
              style={{ width: "100%", marginTop: "20px" }}
            />
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Form;
