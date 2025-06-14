import { User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const getStudents = async (email: User['email']) => {
  try {
    const response = await axiosInstance.get("/getstudents", {
      params: { email },
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
