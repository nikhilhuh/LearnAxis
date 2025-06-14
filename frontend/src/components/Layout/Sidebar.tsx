import React from "react";
import { useUser } from "../../context/UserContext";
import DashboardImg from "../../assets/images/dashboard.png";
import AttendanceImg from "../../assets/images/attendance.png";
import BatchesImg from "../../assets/images/batches.png";
import RoomsImg from "../../assets/images/rooms.svg";
import SubjectsImg from "../../assets/images/subjects.svg";
import StudentsImg from "../../assets/images/student.png";
import TeachersImg from "../../assets/images/teacher.png";
import SettingsImg from "../../assets/images/settings.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { UserDetails } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  if (!UserDetails) return null;

  const adminMenuItems = [
    { label: "Dashboard", icon: DashboardImg, path: "/admin/dashboard" },
    { label: "Batches", icon: BatchesImg, path: "/admin/batches" },
    { label: "Rooms", icon: RoomsImg, path: "/admin/rooms" },
    { label: "Subjects", icon: SubjectsImg, path: "/admin/subjects" },
    { label: "Students", icon: StudentsImg, path: "/admin/students" },
    { label: "Teachers", icon: TeachersImg, path: "/admin/teachers" },
    { label: "Settings", icon: SettingsImg, path: "/admin/settings" },
  ];
  const teacherMenuItems = [
    { label: "Dashboard", icon: DashboardImg, path: "/teacher/dashboard" },
    { label: "Attendance", icon: AttendanceImg, path: "/teacher/attendance" },
    { label: "Batches", icon: BatchesImg, path: "/teacher/batches" },
    { label: "Students", icon: StudentsImg, path: "/teacher/students" },
    { label: "Settings", icon: SettingsImg, path: "/teacher/settings" },
  ];
  const studentMenuItems = [
    { label: "Dashboard", icon: DashboardImg, path: "/student/dashboard" },
    { label: "Batches", icon: BatchesImg, path: "/student/batches" },
    { label: "Subjects", icon: SubjectsImg, path: "/student/subjects" },
    { label: "Settings", icon: SettingsImg, path: "/student/settings" },
  ];

  const menuItems =
    UserDetails.role === "admin"
      ? adminMenuItems
      : UserDetails.role === "teacher"
      ? teacherMenuItems
      : studentMenuItems;

  const handleViewProfile = () => {
    const profilePath =
      UserDetails.role === "admin"
        ? "/admin/settings"
        : UserDetails.role === "teacher"
        ? "/teacher/settings"
        : "/student/settings";
    navigate(profilePath);
  };

  return (
    <div className="w-[20vw] bg-[var(--color-primary)] h-full px-1 py-4">
      <div className="flex flex-col h-full justify-center gap-2">
        {/* user profile */}
        <div
          onClick={handleViewProfile}
          title="View Profile"
          className="flex items-center laptop-sm:gap-2 laptop-sm:p-2 laptop-lg:gap-4 laptop-lg:p-4 cursor-pointer hover:scale-105 transition transform duration-100"
        >
          <div className="flex justify-center items-center laptop-sm:p-2 laptop-lg:p-4 border-2 rounded-full bg-gray-100">
            {UserDetails.role === "admin" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="laptop-sm:h-6 laptop-sm:w-6 laptop-lg:h-8 laptop-lg:w-8"
              >
                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z" />
              </svg>
            ) : UserDetails.role === "teacher" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="laptop-sm:h-6 laptop-sm:w-6 laptop-lg:h-8 laptop-lg:w-8"
              >
                <path d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 384l0-128 16 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-288 56 0 64 0 16 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-16 0 0-64 192 0 0 192-192 0 0-32-64 0 0 48c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-224c0-26.5-21.5-48-48-48L368 0c-26.5 0-48 21.5-48 48l0 80-76.9 0-65.9 0c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9 120 480c0 17.7 14.3 32 32 32s32-14.3 32-32z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="laptop-sm:h-6 laptop-sm:w-6 laptop-lg:h-8 laptop-lg:w-8"
              >
                <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z" />
              </svg>
            )}
          </div>
          <div>
            <p className="laptop-sm:text-base laptop-lg:text-lg font-semibold">
              {UserDetails.firstName} {UserDetails.lastName}
            </p>
            <p className="laptop-sm:text-sm laptop-lg:text-base">
              #{UserDetails.user_id}
            </p>
          </div>
        </div>
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link key={index} to={item.path}>
              <div
                className={`${
                  isActive ? "bg-[var(--color-primaryHover)]" : "bg-transparent"
                } flex gap-3 cursor-pointer hover:bg-[var(--color-primaryHover)] p-4 items-center justify-start font-semibold laptop-sm:text-base laptop-lg:text-xl`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="laptop-sm:h-[4vh] laptop-lg:h-[5vh]"
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
