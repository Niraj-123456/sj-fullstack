import { toast } from "react-toastify";

// get base URL
const getApiBaseUrl = () => {
  if (
    process.env.NEXT_PUBLIC_NODE_API_BASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_NODE_API_VERSION !== undefined
  ) {
    return (
      process.env.NEXT_PUBLIC_NODE_API_BASE_URL +
      "/api/v" +
      process.env.NEXT_PUBLIC_NODE_API_VERSION
    );
  } else {
    // new Error();
    console.log("Something went wrong.");
  }
};

const apiBasePath = getApiBaseUrl();

const getClientBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_FRONTEND_HOST !== undefined) {
    return process.env.NEXT_PUBLIC_FRONTEND_HOST;
  } else {
    // new Error();
    console.log("Something went wrong.");
  }
};

export const clientBasePath = getClientBaseUrl();

//homepage routes
export const geoLocationUrl = "https://geolocation-db.com/json/";
export const homePageUrl = `${apiBasePath}/pages/client-web-app/home-page/get-data`;
export const bookingUrl = `${apiBasePath}/booking/register-booking`;
export const newsletterUrl = `${apiBasePath}/auth/subscribe-to-email-newsletter`;

//auth routes
export const referralTokenUrl = `${apiBasePath}/token/check-referral-code?referralToken=`;
export const registerUrl = `${apiBasePath}/auth/register-phonenumber`;
export const submitOtpUrl = `${apiBasePath}/auth/submit-otp`;
export const setPasswordUrl = `${apiBasePath}/auth/set-password`;
export const loginUrl = `${apiBasePath}/auth/login`;
export const forgotPasswordUrl = `${apiBasePath}/auth/send-otp-for-forgot-password`;
export const submitForgotPasswordOtpUrl = `${apiBasePath}/auth/submit-otp-for-forgot-password`;
export const resetPasswordUrl = `${apiBasePath}/auth/set-new-password`;
export const updateAccessToken = `${apiBasePath}/auth/update-access-token`;
export const logoutUrl = `${apiBasePath}/auth/logout`;

//user booking routes
export const bookingDataUrl = `${apiBasePath}/pages/client-web-app/my-booking/get-page-data`;
export const referralDataUrl_1 = `${apiBasePath}/pages/client-web-app/benefit/get-user-discounts-by-filter?`;
export const referralDataUrl_2 = `numberOfMaxResultsInEachPage=`;
export const referralDataUrl_3 = `&pageNumber=`;
export const referralDataUrl_4 = `&bookingSortCriteria=ByDate&sortValue=DESC`;
export const bookingListUrl_1 = `${apiBasePath}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=5`;
export const bookingListUrl_2 = `&pageNumber=`;
export const bookingListUrl_3 = `&bookingsDivision=`;
export const bookingListUrl_4 = `&filterType=`;
export const bookingListUrl_5 = `&status=`;
export const bookingListUrl_6 = `&bookingSortCriteria=ByDate&sortValue=`;
export const bookingListUrl_7 = `&bookingSortCriteria=ByDate`;
export const bookingListUrl_8 = `&startingDate=`;
export const bookingListUrl_9 = `&endingDate=`;
export const bookingListUrl_10 = `&sortValue=`;
