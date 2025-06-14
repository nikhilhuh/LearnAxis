import { Room, User } from "../../../../../utils/constants";
import { axiosInstance } from "../../../../axiosInstance";
import { apiErrorHandler } from "../../../apiErrorHandling";

export const deleteRoom = async (email: User['email'], roomName: Room['name']) => {
  try {
    const response = await axiosInstance.post("/deleteroom", {
      email,
      roomName
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
