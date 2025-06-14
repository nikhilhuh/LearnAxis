import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { subjectModel } from "../../models/dbmodels/subjectModel";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, subject } = req.body;

    if (!email || !subject) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    }

    // Find the student
    const user = await userModel.findOne({ email });
    if (!user || user.role !== "student") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    // Find the subject by code
    const sub = await subjectModel.findOne({ code: subject });
    if (!sub) {
      res.status(400).json({ success: false, message: "No subject found" });
      return;
    }

    const subjectId = sub._id;

    // Check if the subject is in enrolledSubjects
    const enrolledIndex = user.enrolledSubjects.findIndex(
      (id: mongoose.Types.ObjectId) => id.equals(subjectId)
    );

    if (enrolledIndex === -1) {
      res
        .status(400)
        .json({
          success: false,
          message: "Student is not enrolled in this subject",
        });
      return;
    }

    // Remove subjectId from enrolledSubjects
    user.enrolledSubjects.splice(enrolledIndex, 1);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Enrollment from subject removed successfully",
      });
    return;
  } catch (error) {
    console.error("Error removing enrollment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
});

export { router };
