import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Please provide all required fields." });
      return;
    } else {
      //  check if the user exists or not
      let user = await userModel.findOne({ email: email });
      if (!user) {
        res.status(400).json({success: false, message: "User does not exist." });
      }
      // logout the user
      await userModel.updateOne({ email: email }, { status: "inactive" });
      res
        .status(200)
        .json({ success: true, message: "User logged out successfully." });
      return;
    }
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
