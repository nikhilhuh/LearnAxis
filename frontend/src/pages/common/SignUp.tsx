import React from "react";
import signupBGImage from "../../assets/images/signin-bg.jpg";
import logoImage from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../components/Modals/Status Modals/ErrorModal";
import SuccessModal from "../../components/Modals/Status Modals/SuccessModal";
import { addStudent } from "../../services/api/apiCalls/student/addStudent";
import { SignUpUser } from "../../utils/constants";
import Cliploader from "../../components/Loaders/Cliploader";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [credentials, setCredentials] = React.useState<
    SignUpUser
  >({
    firstName: "",
    lastName: "",
    role: "student",
    rollNo: "",
    email: "",
    password: "",
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    credentials.firstName.trim() !== "" &&
    credentials.rollNo.trim() !== "" &&
    credentials.email.trim() !== "" &&
    credentials.password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);
    try {
      const response = await addStudent(
        credentials.firstName,
        credentials.rollNo,
        credentials.email,
        credentials.password,
        credentials.lastName
      );
      if (response.success) {
        setSuccess("Signup successful! You can now log in.");
        setError("");
        setTimeout(() => {
          setSuccess("");
          navigate("/signin");
        }, 2000);
      } else {
        setError(response.message || "Signup failed. Try again.");
        setSuccess("");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Try again.");
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
        backgroundImage: `url(${signupBGImage})`,
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
          className="h-[10vh] laptop-md:h-[12vh] 4k:h-[15vh] object-contain"
        />

        <div className="hidden laptop-md:flex text-center flex-col gap-1">
          <p className="text-base laptop-sm:text-lg 4k:text-2xl font-underdog">
            I am
          </p>
          <div className="flex gap-2 flex-wrap justify-center text-sm laptop-sm:text-base 4k:text-xl">
            {/* student */}
            <div
              className={`bg-blueLight text-white
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
          {/* first name */}
          <div className="relative">
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={credentials.firstName}
              onChange={handleCredentialsChange}
              placeholder="your first name"
              autoComplete="name"
              className="invalid:border-pink-500 invalid:text-pink-600 bg-gray-100 border-1 border-gray-500 rounded-xl py-2 w-[75vw] laptop-sm:w-[25vw] px-10"
            />
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                height="20"
                width="20"
              >
                <path d="M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92l0 71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-83.6 0 18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3l0-7.8c0-53-43-96-96-96s-96 43-96 96l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5l0-71.9c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24l40.3 0c-.2-2.8-.3-5.6-.3-8.5L64 368l-40 0zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24l-310.1 0c-6.7 16.3-14.2 32.3-22.3 48L616 416z" />
              </svg>
            </div>
          </div>

          {/* last name */}
          <div className="relative">
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={credentials.lastName}
              onChange={handleCredentialsChange}
              placeholder="your last name"
              autoComplete="name"
              className="invalid:border-pink-500 invalid:text-pink-600 bg-gray-100 border-1 border-gray-500 rounded-xl py-2 w-[75vw] laptop-sm:w-[25vw] px-10"
            />
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                height="20"
                width="20"
              >
                <path d="M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92l0 71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-83.6 0 18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3l0-7.8c0-53-43-96-96-96s-96 43-96 96l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5l0-71.9c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24l40.3 0c-.2-2.8-.3-5.6-.3-8.5L64 368l-40 0zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24l-310.1 0c-6.7 16.3-14.2 32.3-22.3 48L616 416z" />
              </svg>
            </div>
          </div>

          {/* roll no */}
          <div className="relative">
            <input
              type="text"
              name="rollNo"
              id="rollNo"
              value={credentials.rollNo}
              onChange={handleCredentialsChange}
              placeholder="your roll number"
              autoComplete="rollNo"
              className="invalid:border-pink-500 invalid:text-pink-600 bg-gray-100 border-1 border-gray-500 rounded-xl py-2 w-[75vw] laptop-sm:w-[25vw] px-10"
            />
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                height="20"
                width="20"
              >
                <path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128l95.1 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0L325.8 320l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7-95.1 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 21.3-128L64 192c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320l95.1 0 21.3-128-95.1 0z" />
              </svg>
            </div>
          </div>

          {/* email */}
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

          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleCredentialsChange}
              placeholder="set your password"
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

          {/* signup button */}
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
              {loading? <Cliploader size={10} /> : "Sign up"}
            </button>
          </div>
        </form>

        <div className="flex gap-2 items-center mt-2">
          <p>Already registered?</p>
          <Link to="/signin">
            <button className="px-4 py-2 rounded-full bg-blue text-white font-bold cursor-pointer hover:bg-blue-900">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
