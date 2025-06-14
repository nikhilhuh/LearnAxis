import { Teacher, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const deleteTeacher = async (email: User['email'], teacherId: Teacher['user_id']) => {
  try {
    const response = await axiosInstance.post("/deleteteacher", {
      email,
      teacherId
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
