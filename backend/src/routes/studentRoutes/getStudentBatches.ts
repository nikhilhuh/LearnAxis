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
        message: "Please provide the student's email.",
      });
      return;
    }

    // First, find the student by email
    const student = await userModel.findOne({ email });

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found.",
      });
      return;
    }

    // Now, find all batches where this student is enrolled
    const batches = await batchModel
      .find({ students: student._id })
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

    res.status(200).json({
      success: true,
      data: batches,
    });
    return;
  } catch (error) {
    console.error("Error fetching student batches:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
});

export { router };
