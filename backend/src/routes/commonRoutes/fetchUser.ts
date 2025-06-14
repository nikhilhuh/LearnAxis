import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import { User } from "../../models/type models/userType";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
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
      } 
      const userData: User = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user_id: user.user_id,
        role: user.role,
        status: user.status
      }
      res.status(200).json({success: true, user: userData , message: "User fetched successfully."});
      return;
    }
  } catch (error) {
    console.error("Error Signing in user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
