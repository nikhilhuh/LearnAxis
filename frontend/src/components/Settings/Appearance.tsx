import React from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "../../context/ThemeProvider";

const Appearance: React.FC = () => {
  const { darkMode, setDarkMode, theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  
  // Sync theme and dark mode with localStorage and update classes
  React.useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    const root = document.documentElement;

    root.classList.remove("blue", "orange", "pink", "default", "dark");

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.add(theme);
    }
  }, [darkMode, theme]);

  return (
    <div className="border-t pt-4 space-y-4 laptop-sm:space-y-6 laptop-lg:space-y-8">
      <h2 className="text-xl laptop-sm:text-2xl laptop-lg:text-3xl font-bold">
        Appearance
      </h2>
      <div className="space-y-4 laptop-md:space-y-6 pb-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Dark Mode</span>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            onClick={toggleDarkMode}
            title={darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
            aria-label={darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
            className={`${darkMode ? "bg-black" : "bg-gray-300"}
                    relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer`}
          >
            <span
              className={`${
                darkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>

        <div className="flex justify-between items-center gap-4 flex-wrap">
          <span>Theme</span>
          <div className="flex gap-2 items-center">
            {/* blue theme */}
            <div
              onClick={() => setTheme("blue")}
              title={
                darkMode
                  ? "DarkMode is on"
                  : theme === "blue"
                  ? "Current Theme"
                  : "Set Blue Theme"
              }
              className={`rounded-full ${
                theme === "blue" ? "border-2" : "border-1"
              } bg-gradient-to-r from-blue-500 to-white h-5 w-5 laptop-sm:h-8 laptop-sm:w-8 text-center shadow-lg ${
                darkMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            ></div>
            {/* default theme - lavender */}
            <div
              onClick={() => setTheme("default")}
              title={
                darkMode
                  ? "DarkMode is on"
                  : theme === "default"
                  ? "Current Theme"
                  : "Set Default Theme"
              }
              className={`rounded-full ${
                theme === "default" ? "border-2" : "border-1"
              } bg-gradient-to-r from-purple-500 to-white h-5 w-5 laptop-sm:h-8 laptop-sm:w-8 text-center shadow-lg ${
                darkMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            ></div>
            {/* orange theme */}
            <div
              onClick={() => setTheme("orange")}
              title={
                darkMode
                  ? "DarkMode is on"
                  : theme === "orange"
                  ? "Current Theme"
                  : "Set Orange Theme"
              }
              className={`rounded-full ${
                theme === "orange" ? "border-2" : "border-1"
              } bg-gradient-to-r from-orange-500 to-white h-5 w-5 laptop-sm:h-8 laptop-sm:w-8 text-center shadow-lg ${
                darkMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            ></div>
            {/* pink theme */}
            <div
              onClick={() => setTheme("pink")}
              title={
                darkMode
                  ? "DarkMode is on"
                  : theme === "pink"
                  ? "Current Theme"
                  : "Set Pink Theme"
              }
              className={`rounded-full ${
                theme === "pink" ? "border-2" : "border-1"
              } bg-gradient-to-r from-pink-500 to-white h-5 w-5 laptop-sm:h-8 laptop-sm:w-8 text-center shadow-lg ${
                darkMode ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
