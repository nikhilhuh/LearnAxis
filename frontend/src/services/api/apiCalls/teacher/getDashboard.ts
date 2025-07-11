import { Teacher } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const getTeacherDashboard = async (email: Teacher['email']) => {
  try {
    const response = await axiosInstance.get("/getteacherdashboard", {
      params: { email },
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
