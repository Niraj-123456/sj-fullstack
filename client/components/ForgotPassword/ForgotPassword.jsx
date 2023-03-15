import React from "react";
import { useRouter } from "next/router";
import styles from "./forgotpassword.module.css";

import PhoneNumberInput from "../Common/PhoneNumberInput";
import CircularLoading from "../Common/CircularLoading";
import FormButton from "../Common/FormButton";
import { forgotPassword } from "../https/registerServices";
import { storePhoneNumber } from "../../redux/features/phoneNumber/phoneNumberSlice";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { clientBasePath } from "../../utils/apiRoutes";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

function ForgotPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector((state) => state.isLoading?.isPartialLoading);

  const phoneSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .min(10, "Phone number must be at lease 10 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .required("Phone number is required"),
  });

  const handleSubmit = async (values) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await forgotPassword(values);
      if (data.success === true) {
        dispatch(togglePartialLoadingState());
        dispatch(storePhoneNumber(values.phoneNumber));
        router.push(`${clientBasePath}/reset-password-otp`);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Forgot Password</h1>
          <Formik
            initialValues={{
              phoneNumber: "",
            }}
            validationSchema={phoneSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
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
            }) => (
              <Form className={styles.form}>
                <div style={{ marginTop: "20px" }}>
                  <PhoneNumberInput
                    type="text"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    label="Phone Number"
                    placeholder="Enter a valid Number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="+977 - "
                    inputicon={styles.input__icon}
                    input={styles.input}
                    style={{ width: "100%" }}
                    labelstyle={{ color: "var(--color-gray-2)" }}
                  />

                  {errors.phoneNumber && touched.phoneNumber ? (
                    <div className="error__message">{errors.phoneNumber}</div>
                  ) : (
                    ""
                  )}
                </div>

                <FormButton
                  label={
                    !isLoading ? (
                      "Send Verification OTP"
                    ) : (
                      <CircularLoading
                        progressStyles={{ color: "var(--color-white)" }}
                        size={30}
                        thickness={3}
                      />
                    )
                  }
                  type="submit"
                  style={{ width: "100%", marginTop: "30px" }}
                  disabled={!isValid || !dirty || isSubmitting}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
