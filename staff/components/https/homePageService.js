import { http } from "./httpServices";
import {
  geoLocationUrl,
  homePageUrl,
  newsletterUrl,
} from "../../utils/apiRoutes";

export async function getDeviceInfo() {
  const info = await http.get(geoLocationUrl, {
    transformRequest: (data, headers) => {
      delete headers.common["sj-client-api-key"];
      delete headers["Authorization"];
      return data;
    },
  });
  return info;
}

export async function subscribeToNewsLetter(email) {
  return await http.put(newsletterUrl, { email });
}

export async function getHomePageData() {
  return await http.get(homePageUrl);
}
