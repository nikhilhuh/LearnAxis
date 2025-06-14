import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { batchModel } from "../../models/dbmodels/batchModel";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please provide the teacher's email.",
      });
      return;
    }

    // First, find the teacher by email
    const teacher = await userModel.findOne({ email });

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
      return;
    }

    // Fetch all batches this teacher teaches
    const batches = await batchModel
      .find({ teacher: teacher._id, completion: { $lt: 100} })
      .populate("subject", "name code")
      .populate("room", "name capacity")
      .populate("teacher", "firstName lastName email")
      .populate("students", "firstName lastName email user_id")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: batches,
    });
    return;
  } catch (error) {
    console.error("Error fetching teacher batches:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
});

export { router };
