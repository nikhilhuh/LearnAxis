import { Teacher } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const addAttendance = async (email: Teacher["email"],topicsCovered: String[] , attendance: any) => {
  try {
    const response = await axiosInstance.post("/addattendance", { email, topicsCovered, attendance });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
