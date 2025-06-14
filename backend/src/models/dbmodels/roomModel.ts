import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const roomModel = mongoose.model("Rooms", roomSchema, "Rooms");

export { roomModel };
