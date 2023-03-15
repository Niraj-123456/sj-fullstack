import axios from "axios";
import { toast } from "react-toastify";

import jwtDecode from "jwt-decode";

import {
  readFromLocalStorage,
  writeToLocalStorage,
} from "../https/localStorage";
import { staffBasePath, updateAccessToken } from "../../utils/apiRoutes";
import { getRefreshToken } from "../https/loginServices";

axios.defaults.headers.common["sj-client-api-key"] =
  process.env.NEXT_PUBLIC_STAFF_ADMIN_KEY;

axios.interceptors.request.use(function (config) {
  if (config.url !== updateAccessToken) {
    const token = readFromLocalStorage("bearer-token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  }
  return config;
});

let loop = 0;
axios.interceptors.request.use(async (req) => {
  const token = readFromLocalStorage("bearer-token");
  if (token) {
    const now = Math.floor(Date.now() / 1000);
    const expiryTime = jwtDecode(token)?.exp;
    const isExpired = expiryTime <= now;
    if (!isExpired) {
      return req;
    } else if (isExpired && loop < 1) {
      loop++;
      const { data } = await getRefreshToken();
      if (data?.success) {
        loop = 0;
        writeToLocalStorage("bearer-token", data?.data?.accessUserToken);
      }
    }
  } else return req;
  return req;
});

let loop2 = 0;
axios.interceptors.response.use(null, async (error) => {
  const token = readFromLocalStorage("refresh-token");
  const now = Math.floor(Date.now() / 1000);
  const expiryTime = jwtDecode(token)?.exp;
  const isExpired = expiryTime <= now;
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError && error.message === "Network Error") {
    toast.error("Something went wrong. Please try again later.");
    return Promise.reject(error);
  }
  if (error.response.status === 401 && isExpired && loop2 < 1) {
    loop2++;
    localStorage.clear();
    window.location.href = `${staffBasePath}`;
    toast.error("Session Expired");
  }
  return Promise.reject(error);
});

export const http = {
  post: axios.post,
  get: axios.get,
  delete: axios.delete,
  put: axios.put,
};
