import express, { Request, Response } from "express";
import { subjectModel } from "../../../models/dbmodels/subjectModel";
import { userModel } from "../../../models/dbmodels/userModel";
import { batchModel } from "../../../models/dbmodels/batchModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, subjectCode } = req.body;
    if (!email || !subjectCode) {
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
        const subject = await subjectModel.findOne({ code: subjectCode });
        if (!subject) {
          res
            .status(400)
            .json({ success: false, message: "Subject not found" });
          return;
        }
        // remove batches linked with that subject
        await batchModel.deleteMany({ subject: subject._id });
        //  remove subject from user enrolled subjects
        await userModel.updateMany(
          { enrolledSubjects: subject._id },
          { $pull: { enrolledSubjects: subject._id } }
        );

        await subjectModel.findByIdAndDelete(subject._id);
        res
          .status(200)
          .json({ success: true, message: "Subject deleted successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error deleting Subject:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
