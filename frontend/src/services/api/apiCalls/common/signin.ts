import { User } from "../../../../utils/constants";
import { axiosInstance } from "../../../axiosInstance";
import { apiErrorHandler } from "../../apiErrorHandling";

export const signin = async (role: User['role'], email: User['email'], password: string) => {
  try {
    const response = await axiosInstance.post("/signin", {
      role,
      email,
      password,
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
