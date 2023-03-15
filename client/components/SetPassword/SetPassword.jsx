import React, { useEffect } from "react";
import { useRouter } from "next/router";

import EnterPassword from "../Common/EnterPassword/EnterPassword";
import { setPassword } from "../https/registerServices";
import { loginAfterRegister } from "../https/loginServices";
import { userLogin } from "../../redux/features/user/userSlice";
import { storePhoneNumber } from "../../redux/features/phoneNumber/phoneNumberSlice";
import { clearReferralCode } from "../../redux/features/referralCode/referralCodeSlice";
import { togglePartialLoadingState } from "../../redux/features/loading/loadingSlice";
import { clientBasePath } from "../../utils/apiRoutes";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function SetPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const phoneNumber = useSelector(
    (state) => state.persistedReducer.phoneNumber?.phoneNumber
  );

  const handleSubmit = async (password, resetForm) => {
    try {
      dispatch(togglePartialLoadingState());
      const { data } = await setPassword(phoneNumber, password);
      if (data.success) {
        const data = await loginAfterRegister(phoneNumber, password);
        if (data.success) {
          dispatch(togglePartialLoadingState());
          dispatch(storePhoneNumber(phoneNumber));
          dispatch(userLogin(data.data?.user));
          dispatch(clearReferralCode(null));
          resetForm();
          router.push(`${clientBasePath}/mybooking`);
        }
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
      router.push(`${clientBasePath}/register`);
    }
  }, [phoneNumber, router]);

  return (
    phoneNumber && (
      <EnterPassword heading="Set Password" handleSubmit={handleSubmit} />
    )
  );
}

export default SetPassword;
