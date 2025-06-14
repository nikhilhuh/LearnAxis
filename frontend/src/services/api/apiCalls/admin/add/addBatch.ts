import { addBatchType, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const addBatch = async (email: User['email'], batches: addBatchType[]) => {
  try {
    const response = await axiosInstance.post("/addbatch", {
      email,
      batches
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
