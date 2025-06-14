import { Student } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const addStudent = async (
firstName: Student['firstName'], rollNo: Student['user_id'], email: Student['email'], password: string, lastName?: Student['lastName']) => {
  try {
    const response = await axiosInstance.post("/addstudent", {
      firstName,
      lastName,
      rollNo,
      email,
      password,
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
