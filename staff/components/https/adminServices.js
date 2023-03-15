import { http } from "./httpServices";
import { getJwt } from "./loginServices";
import {
  staffDashboardDataUrl,
  dashboardTableDataUrl_1,
  dashboardTableDataUrl_2,
  dashboardTableDataUrl_3,
  dashboardTableDataUrl_4,
  dashboardTableDataUrl_5,
  dashboardTableDataUrl_6,
  dashboardTableDataUrl_7,
  dashboardTableDataUrl_8,
  updateBookingUrl,
  serviceProviderUrl,
  clientListUrl_1,
  clientListUrl_2,
  clientListUrl_3,
  checkExistingClientUrl,
  bookingReviewUrl,
  allBookingReviewUrl_1,
  allBookingReviewUrl_2,
  allBookingReviewUrl_3,
  allBookingReviewUrl_4,
  allBookingReviewUrl_5,
  allBookingReviewUrl_6,
  allBookingReviewUrl_7,
  allBookingReviewUrl_8,
} from "../../utils/apiRoutes";
import { readFromLocalStorage } from "./localStorage";

const token = readFromLocalStorage("bearer-token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// get all staff dashboard data
export async function getStaffDashboardData() {
  return await http.get(staffDashboardDataUrl);
}

// get service provider lists
export async function getServiceProvicerList() {
  return await http.get(serviceProviderUrl);
}

// get admin dashboard table booking data filter by date
export async function getDashboardTableDataByDate(
  pageSize,
  pageNumber,
  startDate,
  endDate,
  sortBy
) {
  return await http.get(
    `${dashboardTableDataUrl_1}${"ByDate"}${dashboardTableDataUrl_2}${pageSize}${dashboardTableDataUrl_3}${pageNumber}${dashboardTableDataUrl_4}${startDate}${dashboardTableDataUrl_5}${endDate}${dashboardTableDataUrl_8}${sortBy}`
  );
}

// get admin dashboard table booking data filter by booking status
export async function getDashboardTableDataByStatus(
  pageSize,
  pageNumber,
  status,
  sortBy
) {
  return await http.get(
    `${dashboardTableDataUrl_1}${"ByStatus"}${dashboardTableDataUrl_2}${pageSize}${dashboardTableDataUrl_3}${pageNumber}${dashboardTableDataUrl_6}${status}${dashboardTableDataUrl_8}${sortBy}`
  );
}

// get admin dashboard table booking data filter by User Name
export async function getDashboardTableDataByName(
  pageSize,
  pageNumber,
  userName,
  sortBy
) {
  return await http.get(
    `${dashboardTableDataUrl_1}${"ByName"}${dashboardTableDataUrl_2}${pageSize}${dashboardTableDataUrl_3}${pageNumber}${dashboardTableDataUrl_7}${userName}${dashboardTableDataUrl_8}${sortBy}`
  );
}

// update status of a booking
export async function updateBookingStatus(status, bookingId) {
  return await http.put(updateBookingUrl, {
    bookingId: bookingId,
    status: status,
  });
}

// update service provider for a booking
export async function updateBookingServiceProvider(
  serviceProviderId,
  bookingId
) {
  return await http.put(updateBookingUrl, {
    bookingId: bookingId,
    serviceProviderId: serviceProviderId,
  });
}

// update the existing booking
export async function updateBooking(data) {
  return await http.put(updateBookingUrl, {
    ...data,
  });
}

//get all booking reviews by filter type date
export async function getAllBookingReviewByDate(
  pageSize,
  pageNumber,
  startDate,
  endDate,
  sortBy
) {
  return await http.get(
    `${allBookingReviewUrl_1}${"ByDate"}${allBookingReviewUrl_3}${pageSize}${allBookingReviewUrl_4}${pageNumber}${allBookingReviewUrl_6}${startDate}${allBookingReviewUrl_7}${endDate}${allBookingReviewUrl_5}${sortBy}`
  );
}

//get all booking reviews by filter type booking Id
export async function getAllBookingReviewByBookingId(
  bookingId,
  pageSize,
  pageNumber,
  sortBy
) {
  return await http.get(
    `${allBookingReviewUrl_1}${"ByBookingId"}${allBookingReviewUrl_8}${bookingId}${allBookingReviewUrl_3}${pageSize}${allBookingReviewUrl_4}${pageNumber}${allBookingReviewUrl_5}${sortBy}`
  );
}

//get all booking reviews by filter type employee phone number
export async function getAllBookingReviewByEmployeePhoneNumber(
  phoneNumber,
  pageSize,
  pageNumber,
  sortBy
) {
  return await http.get(
    `${allBookingReviewUrl_1}${"ByEmployeePhoneNumber"}${allBookingReviewUrl_2}${phoneNumber}${allBookingReviewUrl_3}${pageSize}${allBookingReviewUrl_4}${pageNumber}${allBookingReviewUrl_5}${sortBy}`
  );
}

// create review for booking
export async function createBookingReview(data) {
  let newData = "";
  for (const field in data) {
    if (
      data[field] === "" ||
      data[field] === null ||
      data[field] === undefined ||
      data[field] === []
    ) {
      delete data[field];
    }
    newData = data;
  }
  return await http.put(bookingReviewUrl, {
    ...newData,
    serviceRating: parseFloat(newData.serviceRating),
    employeeRating: parseFloat(newData.employeeRating),
  });
}

// check if the user exist with the provided phone number
export async function getExistingClient(phoneNumber) {
  return await http.get(`${checkExistingClientUrl}${phoneNumber}`);
}

// get all clients
export async function getAllClients(role, noOfResultsPerPage, pageNumber) {
  return await http.get(
    `${clientListUrl_1}${role}${clientListUrl_2}${noOfResultsPerPage}${clientListUrl_3}${pageNumber}`
  );
}
