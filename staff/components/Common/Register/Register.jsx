import React from "react";
import Image from "next/image";
import Router from "next/router";
import styles from "./register.module.css";

import { useSelector } from "react-redux";
import _ from "lodash";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import "react-datepicker/dist/react-datepicker.css";

import InputField from "../InputField";
import SelectField from "../SelectField";
import FormButton from "../FormButton";
import CircularLoading from "../CircularLoading";
import { staffBasePath } from "../../../utils/apiRoutes";

const GENDER = [
  {
    label: "Male",
    value: "MALE",
  },
  { label: "Female", value: "FEMALE" },
];

function Register({ handleSubmit }) {
  const registerValidation = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required."),
    dob: Yup.string().required("Date of Birth is required"),
    gender: Yup.string().required("Gender is required."),
    fullAddress: Yup.string().required("Address is required."),
    email: Yup.string().nullable(),
  });

  const isPartialLoading = useSelector(
    (state) => state.isLoading?.isPartialLoading
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.form__content}>
          <h1 className={styles.heading}>Create Account</h1>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              dob: "",
              gender: "",
              fullAddress: "",
              email: "",
              middleName: "",
              landlineNumber: "",
            }}
            validationSchema={registerValidation}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmit(values, resetForm);
              setSubmitting(false);
            }}
          >
            {({
              dirty,
              values,
              touched,
              errors,
              isValid,
              isSubmitting,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <div
                  style={{ display: "flex", gap: "20px", marginTop: "20px" }}
                >
                  <div>
                    <InputField
                      label="First Name"
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your first name"
                      style={{ fontSize: "0.9rem", width: "100%" }}
                      labelstyles={{ color: "var(--color-gray-2)" }}
                    />
                    {errors.firstName && touched.firstName ? (
                      <div className="error__message">{errors.firstName}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Last Name"
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your last name"
                      style={{ fontSize: "0.9rem", width: "100%" }}
                      labelstyles={{ color: "var(--color-gray-2)" }}
                    />
                    {errors.lastName && touched.lastName ? (
                      <div className="error__message">{errors.lastName}</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <CustomDatePicker
                      id="dob"
                      name="dob"
                      placeholderText="YYYY-MM-DD"
                      value={values.dob}
                      onChange={(date) => setFieldValue("dob", date)}
                      onBlur={() => handleBlur({ target: { name: "dob" } })}
                      labelstyles={{ color: "var(--color-gray-2)" }}
                    />

                    {errors.dob && touched.dob ? (
                      <div className="error__message">{errors.dob}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <SelectField
                      label="Gender"
                      labelstyles={{ color: "var(--color-gray-2)" }}
                      options={GENDER}
                      placeholder="Select Gender"
                      onChange={(option) =>
                        setFieldValue("gender", option.value)
                      }
                      onBlur={() => handleBlur({ target: { name: "gender" } })}
                      containerStyles={{ fontSize: "14px" }}
                      controlStyles={{
                        height: "44px !important",
                        width: "100%",
                      }}
                    />

                    {errors.gender && touched.gender ? (
                      <div className="error__message">{errors.gender}</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <InputField
                    label="Home/Default Location"
                    id="fullAddress"
                    type="text"
                    name="fullAddress"
                    value={values.fullAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your home location"
                    style={{
                      fontSize: "0.9rem",
                      width: "100%",
                    }}
                    labelstyles={{ color: "var(--color-gray-2)" }}
                  />
                  {errors.fullAddress && touched.fullAddress ? (
                    <div className="error__message">{errors.fullAddress}</div>
                  ) : (
                    ""
                  )}
                </div>
                <div style={{ marginTop: "20px" }}>
                  <InputField
                    label="Email Address (Optional)"
                    id="email"
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your home location"
                    style={{
                      fontSize: "0.9rem",
                      width: "100%",
                    }}
                    labelstyles={{ color: "var(--color-gray-2)" }}
                  />
                  {errors.email && touched.email ? (
                    <div className={styles.error_message}>{errors.email}</div>
                  ) : (
                    ""
                  )}
                </div>

                <div className={styles.register__button__container}>
                  <FormButton
                    label={
                      !isPartialLoading ? (
                        "Submit"
                      ) : (
                        <CircularLoading
                          progressStyles={{ color: "var(--color-white)" }}
                          size={30}
                          thickness={3}
                        />
                      )
                    }
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                    style={{ marginTop: "50px", width: "100%" }}
                  />

                  <p className={styles.have__account}>
                    Already have an account?
                  </p>
                  <FormButton
                    label="Login"
                    type="button"
                    style={{
                      background: "#E0E0E0",
                      color: "#000",
                      width: "100%",
                    }}
                    onClick={() => Router.push(`${staffBasePath}/login`)}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className={styles.register__bg__image}>
        <Image
          src="/images/login-register-images/register-bg.png"
          alt="RegisterBackground"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}

export default Register;
