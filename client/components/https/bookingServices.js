import { http } from "./httpServices";
import { bookingUrl, bookingDataUrl } from "../../utils/apiRoutes";

export async function createBooking(contactNumber, unfilteredSourceInfo) {
  return await http.post(bookingUrl, {
    bookingSourceForm: "WebAppPhoneNumberOnlyUserForm",
    unfilteredSourceInfo: unfilteredSourceInfo,
    contactNumber: contactNumber,
    isForSelf: true,
  });
}

export async function createDetailedBooking(data, unfilteredSourceInfo) {
  return await http.post(bookingUrl, {
    fullName: data.fullName,
    servicesIds: data.serviceNames,
    explanation: data.message,
    contactNumber: data.phone,
    bookingSourceForm: data.bookingSourceForm,
    unfilteredSourceInfo,
    isForSelf: data.isForSelf,
  });
}

export async function createBookingWithRecommedation(
  data,
  unfilteredSourceInfo
) {
  return await http.post(bookingUrl, {
    ...data,
    unfilteredSourceInfo,
  });
}

export async function getBookingData() {
  return await http.get(bookingDataUrl);
}
