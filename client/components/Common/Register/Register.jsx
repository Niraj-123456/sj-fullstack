import React from "react";
import Image from "next/image";
import Router from "next/router";
import styles from "./register.module.css";

import _ from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import "react-datepicker/dist/react-datepicker.css";

import PhoneNumberInput from "../PhoneNumberInput";
import ReferCodeForm from "../../ReferCodeForm/ReferCodeForm";
import InputField from "../InputField";
import CustomDatePicker from "../CustomDatePicker";
import SelectField from "../SelectField";
import FormButton from "../FormButton";
import CircularLoading from "../CircularLoading";
import { clientBasePath } from "../../../utils/apiRoutes";

const GENDER = [
  {
    label: "Male",
    value: "MALE",
  },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

function Register({ handleSubmit }) {
  const isLoading = useSelector((state) => state.isLoading?.isPartialLoading);

  const loginValidation = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string().required("Last name is required."),
    dob: Yup.string()
      .required("Date of Birth is required.")
      .test(
        "DOB",
        "Age must be greater than or equal to 15.",
        (value, field) => {
          return moment().diff(moment(value), "years") >= 15;
        }
      ),
    gender: Yup.string().required("Gender is required."),
    phoneNumber: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be at least 10 digits.")
      .max(10, "Phone number must not exceed 10 digits.")
      .phone("NP", true, "Phone number must be valid."),
    fullAddress: Yup.string().required("Address is required."),
    email: Yup.string().nullable(),
    isTermAgreed: Yup.boolean().oneOf(
      [true],
      "You must agree to our terms and condition."
    ),
  });

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
              phoneNumber: "",
              fullAddress: "",
              email: "",
              middleName: "",
              landlineNumber: "",
              referralCode: "",
              isTermAgreed: false,
            }}
            validationSchema={loginValidation}
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
              setFieldValue,
              setFieldTouched,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
              isSubmitting,
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
                      labelstyle={{ color: "var(--color-gray-2)" }}
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
                      labelstyle={{ color: "var(--color-gray-2)" }}
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
                    flexShrink: 1,
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <CustomDatePicker
                      id="dob"
                      name="dob"
                      value={values.dob}
                      placeholderText="YYYY-MM-DD"
                      onChange={(date) => {
                        setFieldValue("dob", date);
                      }}
                      onBlur={() => handleBlur({ target: { name: "dob" } })}
                      setFieldTouched={setFieldTouched}
                    />

                    {errors.dob && touched.dob ? (
                      <div className="error__message">{errors.dob}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ width: "100%" }}>
                    <SelectField
                      isMulti={false}
                      label="Gender"
                      name="gender"
                      id="gender"
                      placeholder="Select Gender"
                      options={GENDER}
                      value={values.gender}
                      onChange={(option) =>
                        setFieldValue("gender", option.value)
                      }
                      onBlur={() => handleBlur({ target: { name: "gender" } })}
                      labelStyles={{ color: "var(--color-gray-2)" }}
                      containerStyles={{
                        fontSize: "14px",
                      }}
                      controlStyles={{
                        height: "42px !important",
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

                <div className={styles.phone__number__field}>
                  <div className={styles.phone__number}>
                    <PhoneNumberInput
                      label="Phone Number"
                      id="phoneNumber"
                      type="text"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter phone number"
                      style={{
                        fontSize: "0.9rem",
                        width: "100%",
                      }}
                      icon="+977 - "
                      inputicon={styles.input__icon}
                      input={styles.input}
                      labelstyle={{ color: "var(--color-gray-2)" }}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <div className="error__message">{errors.phoneNumber}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <InputField
                      label="Landline Number (Optional)"
                      style={{ fontSize: "0.9rem", width: "100%" }}
                      placeholder="Enter Landline number"
                      labelstyle={{ color: "var(--color-gray-2)" }}
                    />
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
                    labelstyle={{ color: "var(--color-gray-2)" }}
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
                    labelstyle={{ color: "var(--color-gray-2)" }}
                  />
                  {errors.email && touched.email ? (
                    <div className={styles.error_message}>{errors.email}</div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Referral Code field */}

                <ReferCodeForm
                  name="referralCode"
                  id="referralCode"
                  value={values.referralCode}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />

                <div className={styles.terms__agreement__field}>
                  <input
                    type="checkbox"
                    id="isTermAgreed"
                    name="isTermAgreed"
                    checked={values.isTermAgreed}
                    value={values.isTermAgreed}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label
                    htmlFor="isTermAgreed"
                    className={styles.terms__agreement__label}
                  >
                    By creating an account, you agree to our{" "}
                    <span>Terms and Conditions</span>.
                  </label>
                </div>

                {errors.isTermAgreed && touched.isTermAgreed ? (
                  <div className="error__message">{errors.isTermAgreed}</div>
                ) : (
                  ""
                )}

                <div className={styles.register__btn__container}>
                  <FormButton
                    label={
                      !isLoading ? (
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
                    style={{ width: "100%" }}
                    disabled={!dirty || !isValid || isSubmitting}
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
                    onClick={() => Router.push(`${clientBasePath}/login`)}
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
          alt="Login Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}

export default Register;
