import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { roomModel } from "../../../models/dbmodels/roomModel";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        res
          .status(400)
          .json({ success: false, message: "No such user exists" });
        return;
      }
      const rooms = await roomModel
        .find({})
        .select("-_id -createdAt -updatedAt -__v")
        .sort({ name: 1});

      res.status(200).json({ success: true, data: rooms });
      return;
    }
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
