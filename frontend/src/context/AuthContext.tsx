import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../utils/authUtils";
import { toast } from "react-toastify";
// Utility function to decode token and check expiration
const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => void;
}

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode; // Allows the component to accept `children`
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());
  const handleLogout = useLogout();
  const checkTokenExpiry = (token: string | null) => {
    if (token) {
      const decoded: any = decodeToken(token);
      if (decoded && decoded.exp) {
        return decoded.exp * 1000 > Date.now();
      }
    }
    return false;
  };

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    handleLogout;
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/users/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        // Parse the error response to get the API's structured error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh token"); // Use API error message if available
      }

      const data = await response.json();
      const newAccessToken = data.token;
      localStorage.setItem("authToken", newAccessToken);
      setToken(newAccessToken);
    } catch (error: any) {
      console.error("Error refreshing access token:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && checkTokenExpiry(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        token &&
        checkTokenExpiry(token) &&
        Date.now() - lastActiveTime > 15 * 60 * 1000
      ) {
        logout();
      } else if (
        token &&
        checkTokenExpiry(token) &&
        Date.now() - lastActiveTime < 10 * 60 * 1000
      ) {
        refreshToken();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [lastActiveTime, token]);

  useEffect(() => {
    const handleActivity = () => {
      setLastActiveTime(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("focus", handleActivity);
    window.addEventListener("resize", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("focus", handleActivity);
      window.removeEventListener("resize", handleActivity);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
