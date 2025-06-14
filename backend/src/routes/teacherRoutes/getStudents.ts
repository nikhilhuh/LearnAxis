import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
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
      const teacher = await userModel
        .findOne({ email: email })
        .populate("batches");
      if (!teacher) {
        res
          .status(400)
          .json({ success: false, message: "No such teacher exists" });
        return;
      } else if (teacher.role !== "teacher") {
        res.status(400).json({ success: false, message: "Access denied" });
        return;
      }
      // Get batch IDs where this user is the teacher
      const teacherBatchIds = teacher.batches.map((batch: any) => batch._id);
      // Find students who are in at least one of the teacher's batches
      const students = await userModel
        .find({
          role: "student",
          batches: { $in: teacherBatchIds },
        })
        .populate([
          {
            path: "batches",
            select: "name",
          },
          {
            path: "enrolledSubjects",
            select: "name code",
          },
        ])
        .select("-_id -createdAt -updatedAt -__v -password -role")
        .sort({ firstName: 1 });

      // After fetching students
      const filteredStudents = students.map((student) => {
        return {
          ...student.toObject(),
          batches: student.batches.filter((batch) =>
            teacherBatchIds.some((id) => id.equals(batch._id))
          ),
        };
      });

      res.status(200).json({ success: true, data: filteredStudents });
      return;
    }
  } catch (error) {
    console.error("Error retrieving teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
