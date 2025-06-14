import express, { Request, Response } from "express";
import { userModel } from "../../models/dbmodels/userModel";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, rollNo, password } = req.body;
    if (!firstName || !rollNo || !email || !password) {
      res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields.",
        });
      return;
    } else {
      // check if student already exists
      const existingStudent = await userModel.findOne({
        $or: [{ user_id: rollNo }, { email: email }],
      });
      if (existingStudent) {
        res
          .status(400)
          .json({ success: false, message: "Student already exists." });
        return;
      }
      // ✅ HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      // create new user -> student
      await userModel.create({
        firstName,
        lastName,
        email,
        user_id: rollNo,
        password: hashedPassword,
        role: "student",
        enrolledSubjects: [],
        status: "inactive",
      });
      res
        .status(201)
        .json({ success: true, message: "Student created successfully" });
      return;
    }
  } catch (error) {
    console.error("Error creating Student:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
