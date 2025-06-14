import express, { Request, Response } from "express";
import { batchModel } from "../../../models/dbmodels/batchModel";
import { userModel } from "../../../models/dbmodels/userModel";
import { subjectModel } from "../../../models/dbmodels/subjectModel";
import { roomModel } from "../../../models/dbmodels/roomModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, batches } = req.body;
    if (!email || !batches || !Array.isArray(batches)) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      } else {
        await Promise.all(
          batches.map(async (batch: any) => {
            // 1. Find subject by code (e.g., 4002)
            const subject = await subjectModel.findOne({
              code: batch.subject,
            });
            if (!subject) return;

            // 2. Find teacher by user_id
            const teacher = await userModel.findOne({ user_id: batch.teacher });
            if (!teacher) return;

            // 3. Find room by name
            const room = await roomModel.findOne({ name: batch.room });
            if (!room) return;

            // 4. Find student ObjectIds from their roll no
            const students = await userModel.find({
              user_id: { $in: batch.students },
            });
            const studentObjectIds = students.map((s) => s._id);

            const existingBatch = await batchModel.findOne({
              $and: [
                {
                  name: batch.name,
                },
                { subject: subject._id },
                { teacher: teacher._id },
                { room: room._id },
                { student: { $all: studentObjectIds } },
              ],
            });

            if (!existingBatch) {
              const newBatch = await batchModel.create({
                name: batch.name,
                subject: subject._id,
                teacher: teacher._id,
                room: room._id,
                students: studentObjectIds,
                schedule: {
                  day: batch.schedule.day,
                  time: batch.schedule.time,
                },
                days: batch.days || 0,
                completion: 0,
                syllabus: [],
                startDate: batch.startDate || new Date(),
                endDate: null,
              });

              const batchId = newBatch._id;

              // Add batchId to teacher's batchIds
              await userModel.findByIdAndUpdate(teacher._id, {
                $addToSet: { batches: batchId },
              });

              // Add batchId to each student's batchIds
              await userModel.updateMany(
                { _id: { $in: studentObjectIds } },
                { $addToSet: { batches: batchId } }
              );
            }
          })
        );

        res
          .status(200)
          .json({ success: true, message: "Batch(es) added successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error adding Batches:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
