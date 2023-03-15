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
    new Error();
    toast.error("Something went wrong.");
  }
};

const apiBasePath = getApiBaseUrl();

const getStaffBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_STAFF_FRONTEND_HOST !== undefined) {
    return process.env.NEXT_PUBLIC_STAFF_FRONTEND_HOST;
  } else {
    // new Error();
    toast.error("Something went wrong.");
  }
};

export const staffBasePath = getStaffBaseUrl();

//homepage routes
export const geoLocationUrl = "https://geolocation-db.com/json/";
export const homePageUrl = `${apiBasePath}/pages/client-web-app/home-page/get-data`;
export const bookingUrl = `${apiBasePath}/booking/register-booking`;
export const newsletterUrl = `${apiBasePath}/auth/subscribe-to-email-newsletter`;

//auth routes
export const referralTokenUrl = `${apiBasePath}/token/check-referral-code?referralToken=`;
export const registerUrl = `${apiBasePath}/auth/register-staff`;
export const loginUrl = `${apiBasePath}/auth/login`;
export const logoutUrl = `${apiBasePath}/auth/logout`;
export const updateAccessToken = `${apiBasePath}/auth/update-access-token`;

//user booking routes
export const bookingDataUrl = `${apiBasePath}/pages/client-web-app/my-booking/get-page-data`;

// admin routes
export const staffDashboardDataUrl = `${apiBasePath}/pages/staff-web-app/dashboard/get-page-data`;
export const dashboardTableDataUrl_1 = `${apiBasePath}/booking/get-booking-list-by-filter?filterType=`;
export const dashboardTableDataUrl_2 = `&numberOfMaxResultsInEachPage=`;
export const dashboardTableDataUrl_3 = `&pageNumber=`;
export const dashboardTableDataUrl_4 = `&startingDate=`;
export const dashboardTableDataUrl_5 = `&endingDate=`;
export const dashboardTableDataUrl_6 = `&status=`;
export const dashboardTableDataUrl_7 = `&bookingUserName=`;
export const dashboardTableDataUrl_8 = `&bookingSortCriteria=ByDate&sortValue=`;
export const updateBookingUrl = `${apiBasePath}/booking/update-booking`;
export const serviceProviderUrl = `${apiBasePath}/user/get-active-users?role=ServiceProvider`;
export const clientListUrl_1 = `${apiBasePath}/user/get-active-users?role=`;
export const clientListUrl_2 = `&numberOfMaxResultsInEachPage=`;
export const clientListUrl_3 = `&pageNumber=`;

// fetch exisiting client details for booking
export const checkExistingClientUrl = `${apiBasePath}/user/get-single-user?phoneNumber=`;

//booking review by staff
export const bookingReviewUrl = `${apiBasePath}/booking-review/add-service-and-employee-ratings`;
export const allBookingReviewUrl_1 = `${apiBasePath}/booking-review/get-booking-reviews-list-by-filter?filterType=`;
export const allBookingReviewUrl_3 = `&numberOfMaxResultsInEachPage=`;
export const allBookingReviewUrl_4 = `&pageNumber=`;
export const allBookingReviewUrl_5 = `&bookingSortCriteria=ByDate&sortValue=`;

//booking review by staff by filter type date
export const allBookingReviewUrl_6 = `&startingDate=`;
export const allBookingReviewUrl_7 = `&endingDate=`;

//booking review by staff by filter type booking Id
export const allBookingReviewUrl_8 = `&bookingId=`;

//booking review by staff by filter type employee phone number
export const allBookingReviewUrl_2 = `&ratedEmployeeNumber=`;
