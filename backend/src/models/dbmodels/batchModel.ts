import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subjects",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      default: null,
    },
    schedule: {
      day: {
        type: [String],
        required: true,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      time: { type: String, required: true },
    },
    days: { type: Number, required: true, default: 30 },
    syllabus: {
      type: [
        {
          title: { type: String, required: true },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    completion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true, 
    },
    endDate: {
      type: Date,
      default: null, // will be set later when completion hits 100
    },
  },
  { timestamps: true }
);

const batchModel = mongoose.model("Batches", batchSchema, "Batches");

export { batchModel };
