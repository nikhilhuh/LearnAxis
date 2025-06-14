import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
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
      const user = await userModel.findOne({ email: email });
      if (!user) {
        res
          .status(400)
          .json({ success: false, message: "No such admin exists" });
        return;
      } else if (user.role !== "admin") {
        res.status(400).json({ success: false, message: "Access denied" });
        return;
      }
      const students = await userModel
        .find({ role: "student" })
        .populate([
          {
            path: "batches",
            select: "name",
          },
          {
            path: "enrolledSubjects",
            select: "name code",
          },
        ])
        .select("-_id -createdAt -updatedAt -__v -password -role")
        .sort({ firstName: 1 });

      res.status(200).json({ success: true, data: students });
      return;
    }
  } catch (error) {
    console.error("Error retrieving teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
