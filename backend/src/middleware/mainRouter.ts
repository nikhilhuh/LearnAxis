import express from "express";
// common routes
import { router as signInRoute } from "../routes/commonRoutes/signIn"; 
import { router as logoutRoute } from "../routes/commonRoutes/logout"; 
import { router as fetchUserRoute } from "../routes/commonRoutes/fetchUser";
import { router as getSubjectsRoute } from "../routes/commonRoutes/getSubjects";
import { router as getTeachersNameRoute } from "../routes/commonRoutes/getTeachersName";
import { router as editBatchSyllabusRoute } from "../routes/commonRoutes/editBatchSyllabus";

// admin routes
import { router as addTeacherRoute } from "../routes/adminRoutes/add/addTeacher"
import { router as addSubjectsRoute } from "../routes/adminRoutes/add/addSubjects";
import { router as addRoomsRoute } from "../routes/adminRoutes/add/addRooms";
import { router as addBatchRoute } from "../routes/adminRoutes/add/addBatch";
import { router as getTeachersRoute } from "../routes/adminRoutes/get/getTeachers";
import { router as getStudentsRoute } from "../routes/adminRoutes/get/getStudents";
import { router as getSubjectStudentsRoute } from "../routes/adminRoutes/get/getSubjectStudents";
import { router as getBatchesRoute } from "../routes/adminRoutes/get/getBatches";
import { router as getRoomsRoute } from "../routes/adminRoutes/get/getRooms";
import { router as deleteRoomRoute } from "../routes/adminRoutes/delete/deleteRoom";
import { router as deleteSubjectRoute } from "../routes/adminRoutes/delete/deleteSubject";
import { router as deleteBatchRoute } from "../routes/adminRoutes/delete/deleteBatch";
import { router as deleteTeacherRoute } from "../routes/adminRoutes/delete/deleteTeacher";
import { router as getAdminDashboardRoute } from "../routes/adminRoutes/get/getDashboard";

// student routes
import { router as addStudentRoute } from "../routes/studentRoutes/addStudent"; 
import { router as enrollSubjectRoute } from "../routes/studentRoutes/enrollSubject"
import { router as getEnrolledSubjectsRoute } from  "../routes/studentRoutes/getEnrolledSubjects";
import { router as deleteEnrollmentRoute } from "../routes/studentRoutes/deleteEnrollment";
import { router as getStudentBatchesRoute } from "../routes/studentRoutes/getStudentBatches";
import { router as getStudentDashboardRoute } from "../routes/studentRoutes/getDashboard";

// teacher routes
import { router as getTeacherDashboardRoute } from "../routes/teacherRoutes/getDashboard";
import { router as getTeacherBatchesRoute } from "../routes/teacherRoutes/getTeacherBatches";
import { router as getTeacherOngoingBatchesRoute } from "../routes/teacherRoutes/getTeacherOngoingBatches";
import { router as getTeacherStudentsRoute } from "../routes/teacherRoutes/getStudents";
import { router as addAttendanceRoute } from "../routes/teacherRoutes/addAttendance";

const mainRouter = express.Router();

// Middleware to log requests

// common routes
mainRouter.use("/signin", signInRoute);
mainRouter.use("/fetchuser", fetchUserRoute);
mainRouter.use("/logout", logoutRoute);
mainRouter.use("/editbatchsyllabus", editBatchSyllabusRoute); // for admin as well as teacher
mainRouter.use("/getteachersname", getTeachersNameRoute);
mainRouter.use("/getsubjects", getSubjectsRoute);

// admin routes
mainRouter.use("/addsubject", addSubjectsRoute);
mainRouter.use("/addroom", addRoomsRoute);
mainRouter.use("/addbatch", addBatchRoute);
mainRouter.use("/addteacher", addTeacherRoute);
mainRouter.use("/deleteroom", deleteRoomRoute);
mainRouter.use("/deletesubject", deleteSubjectRoute);
mainRouter.use("/deletebatch", deleteBatchRoute);
mainRouter.use("/deleteteacher", deleteTeacherRoute);
mainRouter.use("/getadmindashboard", getAdminDashboardRoute);
mainRouter.use("/getteachers", getTeachersRoute);
mainRouter.use("/getstudents", getStudentsRoute);
mainRouter.use("/getbatches", getBatchesRoute);
mainRouter.use("/getrooms", getRoomsRoute);
mainRouter.use("/getsubjectstudents", getSubjectStudentsRoute);

// teacher routes
mainRouter.use("/getteacherstudents", getTeacherStudentsRoute);
mainRouter.use("/addattendance", addAttendanceRoute);
mainRouter.use("/getteacherdashboard", getTeacherDashboardRoute);
mainRouter.use("/getteacherbatches", getTeacherBatchesRoute);
mainRouter.use("/getteacherongoingbatches", getTeacherOngoingBatchesRoute);

// student routes
mainRouter.use("/addstudent", addStudentRoute);
mainRouter.use("/enrollsubject", enrollSubjectRoute);
mainRouter.use("/getenrolledsubjects", getEnrolledSubjectsRoute);
mainRouter.use("/deleteenrollment", deleteEnrollmentRoute);
mainRouter.use("/getstudentbatches", getStudentBatchesRoute);
mainRouter.use("/getstudentdashboard", getStudentDashboardRoute);

export { mainRouter };