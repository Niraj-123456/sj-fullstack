import { http } from "./httpServices";
import { bookingDataUrl, homePageUrl } from "../../utils/apiRoutes";

export async function getUserPageData() {
  return await http.get(bookingDataUrl);
}

export async function getServiceLists() {
  return await http.get(homePageUrl);
}
