import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import OTP from "../Common/OTP/OTP";
import { submitOtp } from "../https/registerServices";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { clientBasePath } from "../../utils/apiRoutes";

function OtpAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const phoneNumber = useSelector(
    (state) => state.persistedReducer.phoneNumber?.phoneNumber
  );

  const handleSubmit = async (otp, resetForm) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await submitOtp(phoneNumber, otp);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        resetForm();
        router.push(`${clientBasePath}/set-password`);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  useEffect(() => {
    if (
      phoneNumber === "" ||
      phoneNumber === null ||
      phoneNumber === undefined
    ) {
      router.push(`${clientBasePath}/login`);
    }
  }, [phoneNumber, router]);

  return (
    phoneNumber && <OTP phoneNumber={phoneNumber} handleSubmit={handleSubmit} />
  );
}

export default OtpAuth;
