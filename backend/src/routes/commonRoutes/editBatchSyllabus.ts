import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { batchModel } from "../../models/dbmodels/batchModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, batchName, syllabus } = req.body;
    if (!email || !batchName || !syllabus || !Array.isArray(syllabus)) {
      res.status(400).json({ success: false, message: "Invalid request data" });
      return;
    }
    const user = await userModel.findOne({ email: email });
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    const batch = await batchModel.findOne({ name: batchName });

    if (!batch) {
      res.status(404).json({ success: false, message: "Batch not found" });
      return;
    }

    // Create a map of existing titles to their done status
    const existingDoneMap: Record<string, boolean> = {};
    for (const item of batch.syllabus || []) {
      existingDoneMap[item.title] = item.done;
    }

    // Build new syllabus, preserving done for existing titles
    const formattedSyllabus = syllabus.map((title: string) => ({
      title,
      done: existingDoneMap[title] ?? false,
    }));

    const result = await batchModel.updateOne(
      { name: batchName },
      { $set: { syllabus: formattedSyllabus } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Batch not found or syllabus unchanged",
      });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Syllabus updated successfully" });
    return;
  } catch (error) {
    console.error("Error updating Syllabus:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
