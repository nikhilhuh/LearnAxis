import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batches",
      required: true,
    },
    date: { type: Date, required: true },
    records: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          default: "absent"
        },
      },
    ],
  },
  { timestamps: true }
);
attendanceSchema.index({ batchId: 1, date: 1 });
attendanceSchema.index({ "records.studentId": 1 });
const attendanceModel = mongoose.model(
  "Attendance",
  attendanceSchema,
  "Attendance"
);

export { attendanceModel };
