import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RedirectToDashboard = () => {
  const { UserDetails } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!UserDetails) {
      navigate("/signin");
      return;
    }

    switch (UserDetails.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/unauthorized");
    }
  }, [UserDetails, navigate]);

  return null;
};

export default RedirectToDashboard;
