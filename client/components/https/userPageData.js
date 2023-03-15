import { http } from "./httpServices";
import {
  bookingDataUrl,
  referralDataUrl_1,
  referralDataUrl_2,
  referralDataUrl_3,
  referralDataUrl_4,
  bookingListUrl_1,
  bookingListUrl_2,
  bookingListUrl_3,
  bookingListUrl_4,
  bookingListUrl_5,
  bookingListUrl_6,
  bookingListUrl_7,
  bookingListUrl_8,
  bookingListUrl_9,
  bookingListUrl_10,
} from "../../utils/apiRoutes";

export async function getUserPageData() {
  return await http.get(bookingDataUrl);
}

export async function getBenefitsData(noOfResultsPerPage, pageNumber) {
  return await http.get(
    `${referralDataUrl_1}${referralDataUrl_2}${noOfResultsPerPage}${referralDataUrl_3}${pageNumber}${referralDataUrl_4}`
  );
}

export async function getBookingListFilterByStatus(
  pageNumber,
  bookingDivision,
  status,
  sortBy
) {
  return await http.get(
    `${bookingListUrl_1}${bookingListUrl_2}${pageNumber}${bookingListUrl_3}${bookingDivision}${bookingListUrl_4}${"ByStatus"}${bookingListUrl_5}${status}${bookingListUrl_6}${sortBy}`
  );
}

export async function getBookingListFilterByDate(
  pageNumber,
  bookingDivision,
  startingDate,
  endingDate,
  sortBy
) {
  return await http.get(
    `${bookingListUrl_1}${bookingListUrl_2}${pageNumber}${bookingListUrl_3}${bookingDivision}${bookingListUrl_4}${"ByDate"}${bookingListUrl_7}${bookingListUrl_8}${startingDate}${bookingListUrl_9}${endingDate}${bookingListUrl_10}${sortBy}`
  );
}
