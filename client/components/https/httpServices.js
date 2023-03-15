import axios from "axios";
import { clientBasePath } from "../../utils/apiRoutes";
import { updateAccessToken } from "../../utils/apiRoutes";
import { getRefreshToken } from "../https/loginServices";
import {
  readFromLocalStorage,
  writeToLocalStorage,
} from "../https/localStorage";

import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

// fetch the api key according to the device info
const getApiKey = () => {
  var key = process.env.NEXT_PUBLIC_PC_BROWSER_KEY_CLIENT_KEY;
  try {
    if (typeof navigator !== "undefined") {
      var sUsrAg = navigator?.userAgent;
      if (sUsrAg.includes("Windows"))
        key = process.env.NEXT_PUBLIC_PC_BROWSER_KEY_CLIENT_KEY;
      if (sUsrAg.includes("Android"))
        key = process.env.NEXT_PUBLIC_ANDROID_APP_CLIENT_KEY;
      if (sUsrAg.includes("iPhone"))
        key = process.env.NEXT_PUBLIC_IOS_APP_CLIENT_KEY;

      return key;
    }
  } catch (ex) {
    return ex;
  }
};

axios.defaults.headers.common["sj-client-api-key"] = getApiKey();

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
  }
  if (error.response.status === 401 && isExpired && loop2 < 1) {
    loop2++;
    localStorage.clear();
    window.location.href = `${clientBasePath}`;
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
