import { http } from "./httpServices";
import { registerUrl } from "../../utils/apiRoutes";

export async function registerStaff(data) {
  return await http.post(registerUrl, { ...data });
}
