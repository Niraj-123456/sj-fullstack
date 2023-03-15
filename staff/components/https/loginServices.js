import { http } from "./httpServices";
import axios from "axios";
import { loginUrl, logoutUrl, updateAccessToken } from "../../utils/apiRoutes";
import {
  readFromLocalStorage,
  writeToLocalStorage,
} from "../https/localStorage";

export async function loginStaff(credentials) {
  const { data } = await http.post(loginUrl, { ...credentials });
  if (data.success) {
    writeToLocalStorage(
      "bearer-token",
      data.data?.authUserToken.accessUserToken
    );
    writeToLocalStorage(
      "refresh-token",
      data.data?.authUserToken.refreshUserToken
    );
  }
  return data;
}

export async function loginAfterRegisterStaff(phoneNumber, password) {
  const { data } = await http.post(loginUrl, {
    phoneNumber: phoneNumber,
    password: password,
  });
  if (data.success) {
    writeToLocalStorage(
      "bearer-token",
      data.data?.authUserToken?.accessUserToken
    );
    writeToLocalStorage(
      "refresh-token",
      data.data?.authUserToken?.refreshUserToken
    );
  }
  return data;
}

export async function logout(phoneNumber) {
  return await http.delete(logoutUrl, { data: { phoneNumber } });
}

export async function getRefreshToken() {
  const res = await axios({
    method: "put",
    url: updateAccessToken,
    data: null,
    headers: {
      Authorization: `Bearer ${readFromLocalStorage("refresh-token")}`,
    },
  });
  return res;
}
