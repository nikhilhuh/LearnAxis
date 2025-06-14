import { Room, Subject, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const getSubjectStudents = async (email: User['email'], subjectCode: Subject['code'], roomName: Room['name']) => {
  try {
    const response = await axiosInstance.get("/getsubjectstudents", {
      params: { email, subjectCode, roomName },
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
