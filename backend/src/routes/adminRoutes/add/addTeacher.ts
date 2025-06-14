import express, { Request, Response } from "express";
import { userModel } from "../../../models/dbmodels/userModel";
import { generateUserId } from "../../../utils/userIdGenerator";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, teachers } = req.body;
    if (!email || !teachers || !Array.isArray(teachers)) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
      return;
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user || user.role !== "admin") {
        res.status(403).json({ success: false, message: "Access denied" });
        return;
      } else {
        await Promise.all(
          teachers.map(async (teacher: any) => {
            const existingTeacher = await userModel.findOne({
              email: teacher.email,
            });

            if (!existingTeacher) {
              // Generate a unique user ID
              let userId: string;
              let isUnique = false;

              while (!isUnique) {
                userId = generateUserId();
                const existingUser = await userModel.findOne({
                  user_id: userId,
                });
                if (!existingUser) {
                  isUnique = true;
                }
              }
              // ✅ HASH THE PASSWORD
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(teacher.password, salt);
              // Create new teacher
              await userModel.create({
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                user_id: userId,
                password: hashedPassword,
                role: "teacher",
              });
            }
          })
        );

        res
          .status(201)
          .json({ success: true, message: "Teacher(s) added successfully" });
        return;
      }
    }
  } catch (error) {
    console.error("Error creating Teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
    return;
  }
});

export { router };
