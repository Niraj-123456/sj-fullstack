import { http } from "./httpServices";
import {
  referralTokenUrl,
  registerUrl,
  submitOtpUrl,
  setPasswordUrl,
  forgotPasswordUrl,
  submitForgotPasswordOtpUrl,
  resetPasswordUrl,
} from "../../utils/apiRoutes";

export async function checkReferralToken(referralToken) {
  return await http.get(`${referralTokenUrl}${referralToken}`);
}

export async function register(data, referralCode) {
  if (
    referralCode === null ||
    referralCode === "" ||
    referralCode === undefined
  ) {
    return await http.post(registerUrl, data);
  } else
    return await http.post(registerUrl, {
      ...data,
      referralCode: referralCode,
    });
}

export async function submitOtp(phoneNumber, value) {
  return await http.post(submitOtpUrl, {
    phoneNumber: phoneNumber,
    otp: value,
  });
}

export async function setPassword(phoneNumber, password) {
  return await http.put(setPasswordUrl, {
    phoneNumber: phoneNumber,
    password: password,
  });
}

export async function forgotPassword(phoneNumber) {
  return await http.put(forgotPasswordUrl, phoneNumber);
}

export async function submitForgotPasswordOtp(phoneNumber, otp) {
  return await http.post(submitForgotPasswordOtpUrl, {
    phoneNumber: phoneNumber,
    forgotPasswordOtp: otp,
  });
}

export async function resetPassword(phoneNumber, password) {
  return await http.put(resetPasswordUrl, {
    phoneNumber: phoneNumber,
    newPassword: password,
  });
}
