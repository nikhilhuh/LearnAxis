import express, { Request, Response } from "express";
import { roomModel } from "../../../models/dbmodels/roomModel";
import { userModel } from "../../../models/dbmodels/userModel";
import { batchModel } from "../../../models/dbmodels/batchModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, roomName } = req.body;
    if (!email || !roomName) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      } else {
        const room = await roomModel.findOne({ name: roomName });
        if (!room) {
          res.status(400).json({ success: false, message: "Room not found" });
          return;
        }
        await batchModel.updateMany(
          { room: room._id },
          { $set: { room: null } }
        );

        await roomModel.findByIdAndDelete(room._id);
        res
          .status(200)
          .json({ success: true, message: "Room deleted successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error deleting Room:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
