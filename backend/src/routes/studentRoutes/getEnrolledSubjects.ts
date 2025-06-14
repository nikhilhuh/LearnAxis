import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
      return;
    } else {
      const student = await userModel.findOne({ email: email }).populate("enrolledSubjects").select("-_id name code");
      if (!student) {
        res
          .status(400)
          .json({ success: false, message: "No such student exists" });
        return;
      } 

      res.status(200).json({ success: true, data: student.enrolledSubjects });
      return;
    }
  } catch (error) {
    console.error("Error retrieving teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
