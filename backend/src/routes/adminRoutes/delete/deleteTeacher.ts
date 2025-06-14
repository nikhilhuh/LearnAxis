import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { batchModel } from "../../../models/dbmodels/batchModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, teacherId } = req.body;
    if (!email || !teacherId) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      } else {
        const teacher = await userModel.findOne({ user_id: teacherId });
        if (!teacher) {
          res
            .status(400)
            .json({ success: false, message: "Teacher not found" });
          return;
        }
        // Set teacher field in batches to null
        await batchModel.updateMany(
          { teacher: teacher._id },
          { $set: { teacher: null } }
        );

        // Remove the teacher user
        await userModel.findByIdAndDelete(teacher._id);
        res
          .status(200)
          .json({ success: true, message: "Teacher deleted successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error deleting Teacher:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
