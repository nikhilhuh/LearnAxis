import { Room, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const addRoom = async (email: User['email'], rooms: Room[]) => {
  try {
    const response = await axiosInstance.post("/addroom", {
      email,
      rooms
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
