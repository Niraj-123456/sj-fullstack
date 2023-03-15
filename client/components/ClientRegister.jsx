import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Register from "./Common/Register/Register";
import { register } from "./https/registerServices";
import { storePhoneNumber } from "../redux/features/phoneNumber/phoneNumberSlice";
import { togglePartialLoadingState } from "../redux/features/loading/loadingSlice";
import { clientBasePath } from "../utils/apiRoutes";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function ClientRegister() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state) => state.persistedReducer.user?.user);

  const referralCode = useSelector((state) =>
    state.referralCode ? state.referralCode?.referralCode : ""
  );

  const handleSubmit = async (values, resetForm) => {
    const filteredValues = _.omit(values, ["isTermAgreed", "referralCode"]);
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await register(filteredValues, referralCode);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        dispatch(storePhoneNumber(values.phoneNumber));
        resetForm();
        router.push(`${clientBasePath}/submit-otp`);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  useEffect(() => {
    if (currentUser) router.push(`${clientBasePath}/mybooking`);
  }, [currentUser, router]);

  return !currentUser && <Register handleSubmit={handleSubmit} />;
}

export default ClientRegister;
