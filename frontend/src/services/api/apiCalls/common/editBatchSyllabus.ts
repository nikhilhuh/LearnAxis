import { Batch, User } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const editBatchSyllabus = async (email: User['email'], batchName: Batch['name'], syllabus: string[]) => {
  try {
    const response = await axiosInstance.post("/editbatchsyllabus", {
      email,
      batchName,
      syllabus
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
