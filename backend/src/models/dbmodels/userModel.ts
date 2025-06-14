import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    user_id: { type: String, unique: true }, // roll No for students, teacher Id for teachers and admin Id for admins
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    enrolledSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subjects" }], //for students
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batches" }], //for teachers and students
  },
  { timestamps: true }
);
const userModel = mongoose.model("Users", userSchema, "Users");

export { userModel };
