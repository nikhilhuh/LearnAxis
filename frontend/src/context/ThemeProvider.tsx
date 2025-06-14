import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "blue" | "orange" | "pink";
type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("darkMode") || "false")
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "default"
  );

  // Sync with localStorage and update root classes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("theme", theme);

    const root = document.documentElement;

    root.classList.remove("blue", "orange", "pink", "dark");

    if (darkMode) {
      root.classList.add("dark");
    } else {
      if (theme !== "default") {
        root.classList.add(theme);
      }
    }
  }, [darkMode, theme]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
