import { Subject, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const deleteSubject = async (email: User['email'], subjectCode: Subject['code']) => {
  try {
    const response = await axiosInstance.post("/deletesubject", {
      email,
      subjectCode
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
