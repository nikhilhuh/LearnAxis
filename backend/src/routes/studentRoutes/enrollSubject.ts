import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { subjectModel } from "../../models/dbmodels/subjectModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, subjects } = req.body;
    if (!email || !subjects || !Array.isArray(subjects)) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user || user.role !== "student") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    for (const course of subjects) {
      const subject = await subjectModel.findOne({
        code: course,
      });

      if (!subject) continue;

      const alreadyEnrolled = user.enrolledSubjects.some(
        (id) => id.toString() === subject._id.toString()
      );

      if (!alreadyEnrolled) {
        user.enrolledSubjects.push(subject._id);
      }
    }

    await user.save();
    res.status(200).json({ success: true, message: "Enrolled for subject(s) successfully" });
  } catch (error) {
    console.error("Error enrolling for subject(s):", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
});

export { router };
