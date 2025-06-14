import { Subject, User } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const enrollSubject = async (email: User['email'], subjects: Subject['code'][]) => {
  try {
    const response = await axiosInstance.post("/enrollsubject", {
      email,
      subjects
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
