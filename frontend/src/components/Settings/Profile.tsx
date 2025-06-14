import React from "react";
import { useUser } from "../../context/UserContext";

const Profile: React.FC = () => {
  const { UserDetails } = useUser();
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [id, setId] = React.useState<string>("");

  React.useEffect(() => {
    if (UserDetails) {
      setName(`${UserDetails.firstName} ${UserDetails.lastName}` || "");
      setEmail(UserDetails.email || "");
      setId(UserDetails.user_id || "");
    }
  }, [UserDetails]);

  if (!UserDetails) return null;

  return (
    <div className="space-y-4 laptop-sm:space-y-6 laptop-lg:space-y-8">
      <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
        Profile
      </h2>
      <div className="space-y-4 laptop-md:space-y-6 pb-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Role</span>
          <span className="text-gray-500">
            {UserDetails.role === "admin"
              ? "Admin"
              : UserDetails.role === "teacher"
              ? "Teacher"
              : "Student"}
          </span>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Name</span>
          <span className="text-gray-500">{name}</span>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Registered Email</span>
          <span className="text-gray-500">{email}</span>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Your Id</span>
          <span className="text-gray-500">{id}</span>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Status</span>
          <span className="text-gray-500 cursor-pointer">
            {UserDetails.status === "active" ? (
              <div
                title="active"
                className="h-4 w-4 border-2 bg-green-700 rounded-full"
              ></div>
            ) : (
              <div
                title="inactive"
                className="h-4 w-4 border-2 bg-red-700 rounded-full"
              ></div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
