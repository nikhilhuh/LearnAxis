import express, { Request, Response } from "express";
import { batchModel } from "../../../models/dbmodels/batchModel";
import { userModel } from "../../../models/dbmodels/userModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, batchName } = req.body;
    if (!email || !batchName) {
      res
        .status(400)
        .json({
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
        const batch = await batchModel.findOne({ name: batchName });
        if (!batch) {
          res.status(400).json({ success: false, message: "Batch not found" });
          return;
        }
        // Remove batch references from users
        await userModel.updateMany(
          { batches: batch._id },
          { $pull: { batches: batch._id } }
        );
        await batchModel.findByIdAndDelete(batch._id);
        res
          .status(200)
          .json({ success: true, message: "Batch deleted successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error deleting Batch:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
});

export { router };
