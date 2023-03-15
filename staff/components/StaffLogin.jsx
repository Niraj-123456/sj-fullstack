import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Login from "./Common/Login/Login";
import { loginStaff } from "./https/loginServices";
import { userLogin } from "../redux/features/user/userSlice";
import { storePhoneNumber } from "../redux/features/phoneNumber/phoneNumberSlice";
import { togglePartialLoadingState } from "../redux/features/loading/loadingSlice";
import { writeToLocalStorage } from "./https/localStorage";
import { staffBasePath } from "../utils/apiRoutes";

import _ from "lodash";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";

function StaffLogin() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state) => state.persistedReducer.user?.user);

  // get phone number from cookie
  const cookies = new Cookies();
  const cookiePhoneNumber = cookies.get("phoneNumber");

  const handleSubmit = async (values, resetForm) => {
    const filteredValues = _.omit(values, ["rememberMe"]);
    try {
      dispatch(togglePartialLoadingState());
      const data = await loginStaff(filteredValues);
      if (data.success === true) {
        dispatch(togglePartialLoadingState());
        if (values.rememberMe === true) {
          cookies.set("phoneNumber", values.phoneNumber);
        }
        dispatch(storePhoneNumber(values.phoneNumber));
        dispatch(userLogin(data.data?.user));
        resetForm();
        router.push(`${staffBasePath}/dashboard`);
      }
    } catch (ex) {
      dispatch(togglePartialLoadingState());
      toast.error(ex.response?.data?.message);
    }
  };

  useEffect(() => {
    if (currentUser) router.push(`${staffBasePath}/dashboard`);
  }, [currentUser, router]);

  return (
    !currentUser && (
      <Login
        isStaff={true}
        handleSubmit={handleSubmit}
        rememberedPhoneNumber={cookiePhoneNumber}
      />
    )
  );
}

export default StaffLogin;
