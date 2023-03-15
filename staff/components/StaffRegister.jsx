import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Register from "./Common/Register/Register";
import { registerStaff } from "./https/registerServices";
import { loginAfterRegisterStaff } from "./https/loginServices";
import { userLogin } from "../redux/features/user/userSlice";
import { togglePartialLoadingState } from "../redux/features/loading/loadingSlice";
import { storePhoneNumber } from "../redux/features/phoneNumber/phoneNumberSlice";
import { staffBasePath } from "../utils/apiRoutes";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

function StaffRegister() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.persistedReducer.user?.user);

  const handleSubmit = async (values, resetForm) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await registerStaff(values);
      if (data.success) {
        dispatch(togglePartialLoadingState());
        await loginAfterRegisterStaff(
          data.data?.user?.phoneNumber,
          data.data?.user?.password
        );
        dispatch(storePhoneNumber(data.data?.user?.phoneNumber));
        dispatch(userLogin(data?.data?.user));
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
  }, [router, currentUser]);

  return !currentUser && <Register handleSubmit={handleSubmit} />;
}

export default StaffRegister;
