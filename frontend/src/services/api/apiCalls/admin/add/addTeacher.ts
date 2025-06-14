import { addTeacherType, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const addTeacher = async (email: User['email'], teachers: addTeacherType[]) => {
  try {
    const response = await axiosInstance.post("/addteacher", {
      email,
      teachers
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
