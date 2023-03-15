import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Login from "./Common/Login/Login";
import { login } from "./https/loginServices";
import { clientBasePath } from "../utils/apiRoutes";
import { userLogin } from "../redux/features/user/userSlice";
import { storePhoneNumber } from "../redux/features/phoneNumber/phoneNumberSlice";
import { togglePartialLoadingState } from "../redux/features/loading/loadingSlice";

import _ from "lodash";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";

function ClientLogin() {
  const dispatch = useDispatch();
  const router = useRouter();

  // get phonenumber from cookie
  const cookies = new Cookies();
  const cookiePhoneNumber = cookies.get("phoneNumber");

  const currentUser = useSelector((state) => state.persistedReducer.user?.user);

  const handleSubmit = async (values, resetForm) => {
    const filteredValues = _.omit(values, ["rememberMe"]);
    try {
      dispatch(togglePartialLoadingState());
      const data = await login(filteredValues);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        if (values.rememberMe === true) {
          cookies.set("phoneNumber", values.phoneNumber);
        }
        dispatch(storePhoneNumber(values.phoneNumber));
        dispatch(userLogin(data.data.user));
        resetForm();
        router.push(`${clientBasePath}/mybooking`);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  useEffect(() => {
    if (currentUser) router.push(`${clientBasePath}/mybooking`);
  }, [currentUser, router]);

  return (
    !currentUser && (
      <Login
        handleSubmit={handleSubmit}
        rememberedPhoneNumber={cookiePhoneNumber}
      />
    )
  );
}

export default ClientLogin;
