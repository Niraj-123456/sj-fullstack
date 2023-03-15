import React from "react";
import Link from "next/link";
import styles from "./otp.module.css";

import OtpInput from "../OtpInput/OtpInput";
import CircularLoading from "../CircularLoading";
import FormButton from "../FormButton";

import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

function OTP({ phoneNumber, handleSubmit }) {
  const isLoading = useSelector((state) => state.isLoading?.isPartialLoading);

  const inputValidation = Yup.object().shape({
    otp: Yup.string().min(6, "Enter a valid OTP.").required("OTP is required."),
  });

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>OPT Authentication</h1>
          {phoneNumber && (
            <h6>
              An authentication code has been sent to +977 - {phoneNumber}.
              Please wait.
            </h6>
          )}
          <div className={styles.otp__code__input__container}>
            <Formik
              initialValues={{
                otp: "",
              }}
              validationSchema={inputValidation}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                handleSubmit(values.otp, resetForm);
                setSubmitting(false);
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
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  {/* otp input field */}
                  <OtpInput
                    name="otp"
                    id="otp"
                    value={values.otp.trim("")}
                    valueLength={6}
                    onChange={(value) => setFieldValue("otp", value)}
                    onBlur={() => handleBlur({ target: { name: "otp" } })}
                  />
                  {touched.otp && errors.otp && (
                    <div className="error__message">{errors.otp}</div>
                  )}

                  <div className={styles.resend__code}>
                    If you didn’t receive code.{" "}
                    <Link href="/">
                      <a
                        style={{
                          color: "#f50100",
                        }}
                      >
                        Resend
                      </a>
                    </Link>
                  </div>
                  <div className={styles.otp__button__container}>
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
                      disabled={!dirty || !isValid || isSubmitting}
                    />
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTP;
