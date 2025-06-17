import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminBatches from "../pages/admin/Batches";
import AdminRooms from "../pages/admin/Rooms";
import AdminSubjects from "../pages/admin/Subjects";
import AdminStudents from "../pages/admin/Students";
import AdminTeachers from "../pages/admin/Teachers";
import TeacherDetail from "../components/Teachers/TeacherDetail";

// Teacher pages
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherBatches from "../pages/teacher/Batches";
import TeacherStudents from "../pages/teacher/Students";
import TeacherAttendance from "../pages/teacher/Attendance";
import MarkAttendance from "../components/Teachers/MarkAttendance";

// Student pages
import StudentDashboard from "../pages/student/Dashboard";
import StudentBatches from "../pages/student/Batches";
import StudentSubjects from "../pages/student/Subjects";

//  Common pages
import Settings from "../pages/common/Settings";
import BatchDetail from "../components/Batches/BatchDetail";
import StudentDetail from "../components/Students/StudentDetail";
import Unauthorized from "../pages/common/Unauthorized";
import ProtectedRoute from "./ProtectedRoutes";
import Error404 from "../pages/common/Error404";
import SignIn from "../pages/common/SignIn";
import SignUp from "../pages/common/SignUp";

// redirecting 
import RedirectToDashboard from "./RedirectToDashboard";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Common */}
      <Route path="/" element={<RedirectToDashboard />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin layout */}
      {/* Admin Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="batches" element={<AdminBatches />} />
          <Route path="batches/:batchName" element={<BatchDetail />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:studentId" element={<StudentDetail />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="teachers/:teacherId" element={<TeacherDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Route>

      {/* Teacher Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<MainLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="attendance/:batchName" element={<MarkAttendance />} />
          <Route path="batches" element={<TeacherBatches />} />
          <Route path="batches/:batchName" element={<BatchDetail />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="students/:studentId" element={<StudentDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Route>

      {/* Student Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<MainLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="batches" element={<StudentBatches />} />
          <Route path="batches/:batchName" element={<BatchDetail />} />
          <Route path="subjects" element={<StudentSubjects />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;
