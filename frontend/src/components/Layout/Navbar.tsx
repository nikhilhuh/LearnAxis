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
import { Link, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import LogoImg from "../../assets/images/logo.png";

const Navbar: React.FC = () => {
  const { UserDetails } = useUser();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!UserDetails) return;

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

  return (
    <div className="w-full bg-[var(--color-primary)] py-2 px-4 relative h-[8vh]">
      <div className="flex w-full items-center justify-between text-[2.5rem]">
        <img src={LogoImg} alt="Logo" className="h-[5vh]" />
        <div
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <IoClose /> : <IoMenu />}
        </div>
      </div>

      <div
        className={`absolute top-full left-0 w-full h-[92vh] bg-[var(--color-primary)] z-50 shadow-md transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 font-semibold text-base p-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link to={item.path} key={index} onClick={() => setIsOpen(false)}>
                <div
                  className={`${
                    isActive
                      ? "bg-[var(--color-primaryHover)]"
                      : "bg-transparent"
                  } flex gap-2 cursor-pointer hover:bg-[var(--color-primaryHover)] px-4 py-2 items-center`}
                >
                  <img src={item.icon} alt={item.label} className="h-[5vh]" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
