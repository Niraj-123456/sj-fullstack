import React, { useState } from "react";
import styles from "./enterpassword.module.css";

import InputField from "../InputField";
import CircularLoading from "../CircularLoading";
import FormButton from "../FormButton";

import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";

function EnterPassword({ heading, handleSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPartialLoading = useSelector(
    (state) => state.isLoading?.isPartialLoading
  );

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const setPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be atleast 6 characters long.")
      .oneOf([Yup.ref("password"), null])
      .matches(
        /^(?=.*[a-z])(?=.*[0-9])/,
        "Password must contain atleast one numeric value"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .when("password", {
        is: (val) => ((val && val.length) > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password must match"
        ),
      })
      .required("Confirm Password is required"),
  });
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{heading}</h1>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={setPasswordValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleSubmit(values.password, resetForm);
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              dirty,
              isValid,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px", position: "relative" }}>
                  <InputField
                    label="Password"
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: "100%" }}
                    labelstyle={{ color: "var(--color-gray-2)" }}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    style={{
                      color: "#979797",
                      fontSize: "18px",
                      position: "absolute",
                      top: "50%",
                      right: "5%",
                      transform: "translate(50%, 30%)",
                      cursor: "pointer",
                    }}
                    onClick={handleShowPassword}
                  />
                  {touched.password && errors.password && (
                    <div className="error__message">{errors.password}</div>
                  )}
                </div>
                <div style={{ marginBottom: "20px", position: "relative" }}>
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: "100%" }}
                    labelstyle={{ color: "var(--color-gray-2)" }}
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                    style={{
                      color: "#979797",
                      fontSize: "18px",
                      position: "absolute",
                      top: "50%",
                      right: "5%",
                      transform: "translate(50%, 30%)",
                      cursor: "pointer",
                    }}
                    onClick={handleShowConfirmPassword}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="error__message">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <FormButton
                  type="submit"
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
                  disabled={!dirty || !isValid || isSubmitting}
                />
              </form>
            )}
          </Formik>
          <div className={styles.password__instruction}>
            <div className={styles.password__instruction__content}>
              <h6>Password Instruction</h6>
              <div className={styles.instruction__with__icon}>
                <FontAwesomeIcon icon={faCircleExclamation} />

                <p>
                  The password must contain atleast one numeric value (e.g:
                  1,2,3).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterPassword;
