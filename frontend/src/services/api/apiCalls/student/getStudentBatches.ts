import { Student } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const getStudentBatches = async (email: Student["email"]) => {
  try {
    const response = await axiosInstance.get("/getstudentbatches", {
      params: {
        email,
      },
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
