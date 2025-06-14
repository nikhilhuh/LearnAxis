import React from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/api/apiCalls/common/logout";

const System: React.FC<{
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setError, setSuccess }) => {
  const { UserDetails, setUserDetails } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  if (!UserDetails) return;

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await logout(UserDetails.email);
      if (response.success) {
        setSuccess("Logout successful!");
        setError("");
        setTimeout(() => {
          setSuccess("");
          navigate(`/`);
          localStorage.removeItem("user");
          setUserDetails(null);
        }, 2000);
      } else {
        setError(response.message || "Logout failed. Try again.");
        setSuccess("");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Logout failed. Try again.");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 space-y-4 laptop-sm:space-y-6 laptop-lg:space-y-8">
      <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
        System
      </h2>
      <button
      title="Logout "
        onClick={handleLogout}
        className="text-red-500 font-medium cursor-pointer hover:scale-105"
      >
        Log out
      </button>
    </div>
  );
};

export default System;
