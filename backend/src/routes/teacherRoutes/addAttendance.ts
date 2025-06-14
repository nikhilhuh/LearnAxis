import express, { Request, Response } from "express";
import { batchModel } from "../../models/dbmodels/batchModel";
import { userModel } from "../../models/dbmodels/userModel";
import { attendanceModel } from "../../models/dbmodels/attendanceModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, topicsCovered, attendance } = req.body;

    if (
      !email ||
      !topicsCovered ||
      !Array.isArray(topicsCovered) ||
      !attendance ||
      !attendance.batchId ||
      !attendance.records ||
      !attendance.date
    ) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user || user.role !== "teacher") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    const batch = await batchModel.findOne({ name: attendance.batchId });
    if (!batch) {
      res.status(404).json({ success: false, message: "Batch not found" });
      return;
    }

    const emails = attendance.records.map((r: any) => r.email);
    const students = await userModel.find({ email: { $in: emails } });
    const emailToIdMap: Record<string, string> = {};
    students.forEach((s) => {
      emailToIdMap[s.email] = s._id.toString();
    });

    const finalRecords = attendance.records
      .map((r: any) => {
        const studentId = emailToIdMap[r.email];
        if (!studentId) return null;
        return {
          studentId,
          status: r.status || "absent",
        };
      })
      .filter(Boolean); // removes null entries

    // Normalize incoming date to midnight
    const attendanceDate = new Date(attendance.date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for that batch and date
    const existingAttendance = await attendanceModel.findOne({
      batchId: batch._id,
      date: attendanceDate,
    });

    if (existingAttendance) {
      // Replace the existing record
      await attendanceModel.updateOne(
        { _id: existingAttendance._id },
        { records: finalRecords, updatedAt: new Date() }
      );
    } else {
      // Create new attendance
      await attendanceModel.create({
        batchId: batch._id,
        date: attendanceDate,
        records: finalRecords,
      });
    }

    // update the topics covered of the batch in syllabus
    if (topicsCovered.length > 0) {
      await batchModel.updateOne(
        { _id: batch._id },
        {
          $set: {
            "syllabus.$[elem].done": true,
          },
        },
        {
          arrayFilters: [{ "elem.title": { $in: topicsCovered } }],
        }
      );
    }

    // update the completion of the batch
    const attendanceCount = await attendanceModel.countDocuments({
      batchId: batch._id,
    });
    // Calculate percentage
    const totalDays = batch.days;
    const completedPercentage = Math.min(
      Math.round((attendanceCount / totalDays) * 100),
      100
    );

    // Prepare update fields
    const updateFields: any = {
      completion: completedPercentage,
    };
    // If just completed 100% and endDate isn't set, set it
    if (completedPercentage === 100 && !batch.endDate) {
      updateFields.endDate = new Date();
    }

    // Update batch
    await batchModel.updateOne({ _id: batch._id }, { $set: updateFields });

    res
      .status(200)
      .json({ success: true, message: "Attendance recorded successfully" });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
});

export { router };
