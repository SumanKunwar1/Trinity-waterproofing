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
  refreshToken: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
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

  const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

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
    setLastActiveTime(Date.now());
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    handleLogout();
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh token");
      }

      const data = await response.json();
      const newAccessToken = data.token;
      localStorage.setItem("authToken", newAccessToken);
      setToken(newAccessToken);
      setLastActiveTime(Date.now());
    } catch (error: any) {
      console.error("Error refreshing access token:", error);
      toast.error(error.message);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && checkTokenExpiry(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setLastActiveTime(Date.now());
    } else if (storedToken) {
      // If token exists but is expired, try to refresh it
      refreshToken();
    }
  }, []);

  useEffect(() => {
    const checkActivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActiveTime > ACTIVITY_TIMEOUT) {
        logout();
      } else if (
        token &&
        currentTime - lastActiveTime > TOKEN_REFRESH_INTERVAL
      ) {
        refreshToken();
      }
    };

    const activityInterval = setInterval(checkActivity, 60000); // Check every minute

    return () => clearInterval(activityInterval);
  }, [lastActiveTime, token]);

  useEffect(() => {
    const handleActivity = () => {
      setLastActiveTime(Date.now());
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
      "focus",
      "resize",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
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
