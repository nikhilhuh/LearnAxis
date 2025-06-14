import express, { Request, Response } from "express";
import { subjectModel } from "../../../models/dbmodels/subjectModel";
import { userModel } from "../../../models/dbmodels/userModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, subjects } = req.body;
    if (!email || !subjects || !Array.isArray(subjects)) {
      res.status(400).json({ success: false ,message: "Invalid request data" });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false ,message: "Access denied" });
        return;
      } else {
        await Promise.all(
          subjects.map(async (subject: { name: string; code: string }) => {
            const existingSubject = await subjectModel.findOne({
              name: subject.name,
            });
            if (!existingSubject) {
              await subjectModel.create({
                name: subject.name,
                code: subject.code,
              });
            }
          })
        );
        res.status(200).json({ success: true ,message: "Subject(s) added successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error adding Subjects:", error);
    res.status(500).json({ success: false ,message: "Internal Server error" });
    return;
  }
});

export { router };
