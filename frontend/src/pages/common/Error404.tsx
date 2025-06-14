import React from "react";
import { useNavigate } from "react-router-dom";

const Error404: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] laptop-sm:h-screen bg-transparent">
      <h1 className="text-3xl laptop-sm:text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg laptop-sm:text-xl font-semibold">
        Page Not Found
      </p>
      <p className="mt-2 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-6 px-6 py-2 bg-[var(--color-primary)] rounded-lg shadow-lg drop-shadow-lg hover:bg-[var(--color-primaryHover)] cursor-pointer hover:scale-110 transition-all"
      >
        Go Back
      </button>
    </div>
  );
};

export default Error404;
