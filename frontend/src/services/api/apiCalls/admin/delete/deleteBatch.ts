import { Batch, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const deleteBatch = async (email: User['email'], batchName: Batch['name']) => {
  try {
    const response = await axiosInstance.post("/deletebatch", {
      email,
      batchName
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
