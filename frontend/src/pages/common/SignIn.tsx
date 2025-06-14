import React from "react";
import signinBGImage from "../../assets/images/signin-bg.jpg";
import logoImage from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { useUser } from "../../context/UserContext";
import { signin } from "../../services/api/apiCalls/common/signin";
import { fetchuser } from "../../services/api/apiCalls/common/fetchUserDetails";
import { SignInUser } from "../../utils/constants";
import Cliploader from "../../components/Loaders/Cliploader";

const SignIn: React.FC = () => {
  const { setUserDetails } = useUser();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [credentials, setCredentials] = React.useState<SignInUser>({ role: "student", email: "", password: "" });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRoleChange = (newRole: SignInUser['role']) => {
    setCredentials((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    credentials.email.trim() !== "" && credentials.password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);
    try {
      const response = await signin(
        credentials.role,
        credentials.email,
        credentials.password
      );
      if (response.success) {
        const userDetails = await fetchuser(credentials.email);
        if (userDetails.success) {
          localStorage.setItem("user", JSON.stringify(userDetails.user));
          setUserDetails(userDetails.user);
          setSuccess("Signin successful!");
          setError("");
          setTimeout(() => {
            setSuccess("");
            navigate(`/${credentials.role}/dashboard`);
          }, 2000);
        }
      } else {
        setError(response.message || "Signin failed. Try again.");
        setSuccess("");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Signin failed. Try again.");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex h-screen justify-center items-center w-full p-4 md:p-0 text-black"
      style={{
        backgroundImage: `url(${signinBGImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {error && <ErrorModal error={error} />}
      {success && <SuccessModal success={success} />}
      <div className="p-6 laptop-sm:p-8 laptop-sm:rounded-3xl laptop-sm:shadow-xl w-full max-w-[90vw] laptop-sm:max-w-[50vw] laptop-sm:bg-[var(--color-primary)]/20 laptop-sm:backdrop-blur-md laptop-sm:border laptop-sm:border-[var(--color-secondary)]/50 flex flex-col items-center gap-6 laptop-sm:transition laptop-sm:duration-300">
        <img
          src={logoImage}
          alt="Logo"
          className="h-[10vh] laptop-lg:h-[12vh] 4k:h-[15vh] object-contain"
        />

        <div className="text-center flex flex-col gap-2">
          <p className="text-base laptop-sm:text-lg 4k:text-2xl font-underdog">
            I am
          </p>
          <div className="flex gap-2 flex-wrap justify-center text-sm laptop-sm:text-base 4k:text-xl">
            {/* admin */}
            <div
              onClick={() => handleRoleChange("admin")}
              className={`${
                credentials.role === "admin" ? "bg-blueLight text-white" : ""
              } p-4 border-1 rounded-full cursor-pointer hover:bg-blueLight hover:text-white flex flex-col justify-center items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                height="22"
                width="22"
              >
                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z" />
              </svg>
              <p>Admin</p>
            </div>
            {/* teacher */}
            <div
              onClick={() => handleRoleChange("teacher")}
              className={`${
                credentials.role === "teacher" ? "bg-blueLight text-white" : ""
              } p-4 border-1 rounded-full cursor-pointer hover:bg-blueLight hover:text-white flex flex-col justify-center items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                height="22"
                width="22"
              >
                <path d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 384l0-128 16 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-288 56 0 64 0 16 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-16 0 0-64 192 0 0 192-192 0 0-32-64 0 0 48c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-224c0-26.5-21.5-48-48-48L368 0c-26.5 0-48 21.5-48 48l0 80-76.9 0-65.9 0c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9 120 480c0 17.7 14.3 32 32 32s32-14.3 32-32z" />
              </svg>
              <p>Teacher</p>
            </div>
            {/* student */}
            <div
              onClick={() => handleRoleChange("student")}
              className={`${
                credentials.role === "student" ? "bg-blueLight text-white" : ""
              } p-4 border-1 rounded-full cursor-pointer hover:bg-blueLight hover:text-white flex flex-col justify-center items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                height="22"
                width="22"
              >
                <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z" />
              </svg>
              <p>Student</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-base laptop-sm:text-lg 4k:text-xl"
        >
          {/* email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="px-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleCredentialsChange}
                placeholder="your registered email"
                autoComplete="email"
                className="invalid:border-pink-500 invalid:text-pink-600 bg-gray-100 border-1 border-gray-500 rounded-xl py-2 w-[75vw] laptop-sm:w-[25vw] px-10"
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  height="20"
                  width="20"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
              </div>
            </div>
          </div>
          {/* password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="px-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={credentials.password}
                onChange={handleCredentialsChange}
                placeholder="your password"
                className="invalid:border-pink-500 invalid:text-pink-600 bg-gray-100 border-1 border-gray-500 rounded-xl px-10 py-2 w-[75vw] laptop-sm:w-[25vw]"
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  height="20"
                  width="20"
                >
                  <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
                </svg>
              </div>
              <div
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    height="20"
                    width="20"
                  >
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    height="20"
                    width="20"
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          {/* login button */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`bg-blue-500 text-white py-2 px-4 rounded-xl cursor-pointer ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {loading? <Cliploader size={10} /> : "Sign in"}
            </button>
          </div>
        </form>

        <div className="flex gap-2 items-center mt-4">
          <p>New student?</p>
          <Link to="/signup">
            <button className="px-4 py-2 rounded-full bg-blue text-white font-bold cursor-pointer hover:bg-blue-900">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
