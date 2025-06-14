import { Subject, User } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const deleteEnrollment = async (email: User['email'], subject: Subject['code']) => {
  try {
    const response = await axiosInstance.post("/deleteenrollment", {
      email,
      subject
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
