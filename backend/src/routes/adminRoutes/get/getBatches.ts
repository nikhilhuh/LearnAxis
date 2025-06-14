import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { batchModel } from "../../../models/dbmodels/batchModel";

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
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "No such admin exists",
      });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    const batches = await batchModel
      .find({})
      .populate([
        {
          path: "subject",
          select: "name code",
        },
        {
          path: "teacher",
          select: "firstName lastName email",
        },
        {
          path: "students",
          select: "firstName lastName user_id email",
        },
        {
          path: "room",
          select: "name capacity",
        },
      ])
      .select("-_id -createdAt -updatedAt -__v")
      .sort({ name: 1 });

    res.status(200).json({ success: true, data: batches });
    return;
  } catch (error) {
    console.error("Error retrieving batches:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
});

export { router };
