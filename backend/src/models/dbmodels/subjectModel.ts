import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const subjectModel = mongoose.model("Subjects", subjectSchema, "Subjects");

export { subjectModel };
