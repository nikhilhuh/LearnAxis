import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
      return;
    } else {
      //  check if the user exists or not
      let user = await userModel.findOne({ email: email });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "User with this email does not exist.",
        });
        return;
      } else if (user.role !== role) {
        res.status(400).json({
          success: false,
          message: `No user with this email is a ${role}.`,
        });
        return;
      }
      // check if password is correct then sign in the user
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        await userModel.updateOne({ email: email }, { status: "active" });
        user = await userModel.findOne({ email: email });
        res
          .status(200)
          .json({ success: true, message: "User signed in successfully." });
        return;
      } else {
        res.status(400).json({ success: false, message: "Incorrect password" });
        return;
      }
    }
  } catch (error) {
    console.error("Error Signing in user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
