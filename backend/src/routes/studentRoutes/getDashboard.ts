import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { subjectModel } from "../../models/dbmodels/subjectModel";
import { roomModel } from "../../models/dbmodels/roomModel";
import { batchModel } from "../../models/dbmodels/batchModel";
import { attendanceModel } from "../../models/dbmodels/attendanceModel";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const student = await userModel
      .findOne({ email })
      .populate("enrolledSubjects", "name code");
    if (!student || student.role !== "student") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    const allSubjectsCount = await subjectModel.countDocuments();

    const enrolledBatches = await batchModel
      .find({ students: student._id })
      .populate("subject", "name code")
      .populate("teacher", "firstName lastName email")
      .populate("room", "name")
      .select("name schedule subject teacher room completion");

    const dayCountMap: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    enrolledBatches.forEach((batch) => {
      if (batch.schedule?.day) {
        batch.schedule.day.forEach((day: string) => {
          if (dayCountMap[day] !== undefined) {
            dayCountMap[day]++;
          }
        });
      }
    });

    const daywiseBatchData = Object.entries(dayCountMap).map(
      ([day, count]) => ({
        day,
        count,
      })
    );

    // Get unique teachers
    const uniqueTeachers = enrolledBatches.reduce((acc: any[], batch) => {
      const teacher = batch.teacher as any;
      if (teacher && !acc.find((t) => t.email === teacher.email)) {
        acc.push({
          name: `${teacher.firstName} ${teacher.lastName}`,
          email: teacher.email,
        });
      }
      return acc;
    }, []);

    // Get unique subjects student has opted
    const optedSubjects = student.enrolledSubjects || [];

    // get attendance per batch (active batches: completion<100)
    // Filter active batches
    const activeEnrolledBatches = enrolledBatches.filter(
      (batch: any) => batch.completion < 100
    );

    const attendanceStats: Record<string, number> = {};

    for (const batch of activeEnrolledBatches) {
      const totalSessions = await attendanceModel.countDocuments({
        batchId: batch._id,
      });

      const presentCount = await attendanceModel.countDocuments({
        batchId: batch._id,
        records: {
          $elemMatch: {
            studentId: student._id,
            status: "present",
          },
        },
      });

      const percentage =
        totalSessions === 0
          ? 0
          : Math.round((presentCount / totalSessions) * 100);
      attendanceStats[batch.name] = percentage;
    }

    res.status(200).json({
      success: true,
      data: {
        createdAt: student.createdAt,
        daywiseBatchData,
        batchesCount: enrolledBatches.length,
        uniqueTeachers,
        subjectStats: {
          totalSubjects: allSubjectsCount,
          optedSubjects: optedSubjects.length,
        },
        attendanceStats,
      },
    });
    return;
  } catch (error) {
    console.error("Error in student dashboard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

export { router };
