import { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { ThemeProvider } from "./ThemeProvider";

// Create an AppProvider that wraps RoomProvider and PlayerProvider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
};
