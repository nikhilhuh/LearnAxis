import express, { Request, Response } from "express";
import { roomModel } from "../../../models/dbmodels/roomModel";
import { userModel } from "../../../models/dbmodels/userModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, rooms } = req.body;
    if (!email || !rooms || !Array.isArray(rooms)) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      } else {
        await Promise.all(
          rooms.map(async (room: { name: string; capacity: Number }) => {
            const existingRoom = await roomModel.findOne({
              name: room.name,
            });
            if (!existingRoom) {
              await roomModel.create({
                name: room.name,
                capacity: room.capacity,
              });
            }
          })
        );
        res.status(200).json({ success: true, message: "Room(s) added successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error adding Room(s):", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
