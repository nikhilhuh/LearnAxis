import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../utils/constants";

interface UserContextType {
  UserDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  isInitialized: boolean;
}

const defaultUserContext: UserContextType = {
  UserDetails: null,
  setUserDetails: () => {},
  isInitialized: false,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [UserDetails, setUserDetails] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updateFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUserDetails(parsedUser);
        } catch (error) {
          console.error("Error parsing user:", error);
          setUserDetails(null);
        }
      } else {
        setUserDetails(null);
      }
      setIsInitialized(true); // mark init complete
    };

    updateFromStorage();
    window.addEventListener("storage", updateFromStorage);

    return () => {
      window.removeEventListener("storage", updateFromStorage);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ UserDetails, setUserDetails, isInitialized }}
    >
      {children}
    </UserContext.Provider>
  );
};
