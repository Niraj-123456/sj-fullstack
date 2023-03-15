import React, { useState } from "react";
import Image from "next/image";
import Router from "next/router";
import styles from "./login.module.css";

import PhoneNumberInput from "../PhoneNumberInput";
import InputField from "../InputField";
import FormButton from "../FormButton";
import CircularLoading from "../CircularLoading";
import { staffBasePath } from "../../../utils/apiRoutes";

import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";

function Login({ handleSubmit, isStaff, rememberedPhoneNumber }) {
  const isLoading = useSelector((state) => state.isLoading?.isPartialLoading);

  const [showPassword, setShowPassword] = useState(false);

  const validateLoginForm = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .min(6, "Phone number must be at least 6 digits")
      .max(6, "Phone number must must not exceed 6 digits"),

    password: Yup.string().required("Password is required."),
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.form__content}>
          <h1 className={styles.heading}>Login</h1>
          <Formik
            initialValues={{
              phoneNumber: rememberedPhoneNumber || "",
              password: "",
              rememberMe: false || rememberedPhoneNumber !== undefined,
            }}
            validationSchema={validateLoginForm}
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
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles.phone__number__field}>
                  <PhoneNumberInput
                    label="Phone Number"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    icon={!isStaff ? "+977 - " : ""}
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    style={{ width: "100%" }}
                    input={styles.phonenumber__input}
                    inputicon={styles.phonenumber__icon}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="error__message">{errors.phoneNumber}</div>
                  )}
                </div>

                <div className={styles.password__field}>
                  <div style={{ position: "relative" }}>
                    <InputField
                      label="Password"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                    <div className={styles.password__toggle__icon}>
                      <FontAwesomeIcon
                        onClick={handleShowPassword}
                        icon={showPassword ? faEye : faEyeSlash}
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#979797",
                        }}
                      />
                    </div>
                  </div>
                  {errors.password && touched.password && (
                    <div className="error__message">{errors.password}</div>
                  )}
                </div>
                <div className={styles.remember__and__forgot__password__field}>
                  <div className={styles.remember__phone__field}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor="rememberPhone"
                      className={styles.remember__phone__label}
                    >
                      Remember my phone number.
                    </label>
                  </div>
                  {/* <div>
                    <a
                      href={`${basePath}/forgotpassword`}
                      className={styles.forgot__password__link}
                    >
                      Forgot Password?
                    </a>
                  </div> */}
                </div>
                <div className={styles.login__button__container}>
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

                  <p className={styles.no__account__link}>
                    Don&apos;t have an account yet?{" "}
                  </p>

                  <FormButton
                    type="button"
                    label="Create Account"
                    style={{
                      background: "#E0E0E0",
                      color: "#000",
                      width: "100%",
                    }}
                    onClick={() => Router.push(`${staffBasePath}/register`)}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className={styles.login__bg__image}>
        <Image
          src="/images/login-register-images/login-bg.png"
          alt="login background"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}

export default Login;
