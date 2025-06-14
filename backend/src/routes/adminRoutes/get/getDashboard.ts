import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { batchModel } from "../../../models/dbmodels/batchModel";
import { subjectModel } from "../../../models/dbmodels/subjectModel";
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

    const [studentCount, teacherCount, subjectCount, roomCount, batchCount] =
      await Promise.all([
        userModel.countDocuments({ role: "student" }),
        userModel.countDocuments({ role: "teacher" }),
        subjectModel.countDocuments(),
        roomModel.countDocuments(),
        batchModel.countDocuments(),
      ]);

    const recentStudents = await userModel
      .find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-_id firstName lastName email");
    res
      .status(200)
      .json({
        success: true,
        data: {
          stats: {
            studentCount,
            teacherCount,
            subjectCount,
            roomCount,
            batchCount,
          },
          recentStudents,
        },
      });
    return;
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
    return;
  }
});

export { router };
