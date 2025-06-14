import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { roomModel } from "../../../models/dbmodels/roomModel";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const subjectCode = req.query.subjectCode as string;
    const roomName = req.query.roomName as string;
    if (!email || !subjectCode || !roomName) {
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
          .json({ success: false, message: "No such admin exists" });
        return;
      } else if (user.role !== "admin") {
        res.status(400).json({ success: false, message: "Access denied" });
        return;
      }

      const room = await roomModel.findOne({ name: roomName });
      if (!room || room.capacity === 0) {
        res.status(200).json({ success: true, data: [] });
        return;
      }
      let students = await userModel
        .find({ role: "student" })
        .populate([
          {
            path: "enrolledSubjects",
            select: "name code",
          },
        ])
        .select("firstName lastName user_id enrolledSubjects")
        .sort({ firstName: 1 })
        .limit(room.capacity);

      students = students.filter((student: any) =>
        student.enrolledSubjects?.some(
          (subject: any) => subject.code === subjectCode
        )
      );

      res.status(200).json({ success: true, data: students });
      return;
    }
  } catch (error) {
    console.error("Error retrieving teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
