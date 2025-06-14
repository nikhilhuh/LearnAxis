import { User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const getBatches = async (email: User['email']) => {
  try {
    const response = await axiosInstance.get("/getbatches", {
      params: { email },
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
