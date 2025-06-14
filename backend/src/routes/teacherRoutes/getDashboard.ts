import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { batchModel } from "../../models/dbmodels/batchModel";
import { subjectModel } from "../../models/dbmodels/subjectModel";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const teacher = await userModel.findOne({ email });
    if (!teacher || teacher.role !== "teacher") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    // Fetch all batches this teacher teaches
    const batches = await batchModel
      .find({ teacher: teacher._id, completion: { $lt: 100 } })
      .populate("subject", "name code")
      .populate("room", "name")
      .populate("students", "_id firstName lastName email")
      .sort({ createdAt: -1 });

    const subjectMap = new Map<string, { name: string; code: string }>();
    const studentSet = new Set<string>();
    const dayCountMap: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    const upcomingBatches: any[] = [];
    const studentCountPerBatch: any[] = [];

    for (const batch of batches) {
      // Subjects
      const subject = batch.subject as any;
      if (subject && !subjectMap.has(subject._id.toString())) {
        subjectMap.set(subject._id.toString(), {
          name: subject.name,
          code: subject.code,
        });
      }

      // Students
      const students = batch.students || [];
      for (const s of students) {
        studentSet.add((s as any)._id.toString());
      }

      // Days
      if (batch.schedule?.day) {
        for (const day of batch.schedule.day) {
          if (dayCountMap[day] !== undefined) {
            dayCountMap[day]++;
          }
        }
      }

      // Student count per batch
      studentCountPerBatch.push({
        batch: batch.name,
        students: students.length,
      });

      // Upcoming batches (limit 5)
      if (upcomingBatches.length < 5) {
        upcomingBatches.push({
          name: batch.name,
          subject: subject?.name || "N/A",
          room: (batch.room as any)?.name || "N/A",
          time: batch.schedule?.time || "N/A",
          days: batch.schedule?.day || [],
        });
      }
    }

    const daywiseBatchData = Object.entries(dayCountMap).map(
      ([day, count]) => ({
        day,
        count,
      })
    );

    const recentStudents = Array.from(
      batches
        .flatMap((batch) => batch.students)
        .slice(0, 5)
        .map((student: any) => ({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        }))
    );

    res.status(200).json({
      success: true,
      data: {
        createdAt: teacher.createdAt,
        stats: {
          totalBatches: batches.length,
          totalSubjects: subjectMap.size,
          totalStudents: studentSet.size,
          upcomingThisWeek: upcomingBatches.length,
        },
        daywiseBatchData,
        subjectList: Array.from(subjectMap.values()),
        recentStudents,
        upcomingBatches,
        studentCountPerBatch,
      },
    });
    return;
  } catch (error) {
    console.error("Error in teacher dashboard:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

export { router };
