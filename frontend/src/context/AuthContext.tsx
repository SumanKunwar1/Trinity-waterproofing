import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
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

// Custom hook for handling logout
const useLogoutHandler = () => {
  const navigate = useNavigate();

  return () => {
    const keysToRemove = [
      "authToken",
      "userRole",
      "user",
      "userId",
      "userFullName",
      "userEmail",
      "userPassword",
      "userNumber",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    navigate("/login");
    window.location.reload();
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());
  const handleLogout = useLogoutHandler();

  const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
  const ACTIVITY_CHECK_INTERVAL = 60000; // Check every minute

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
      // console.error("Error refreshing access token:", error);
      toast.error(error.message);
      logout();
    }
  };

  // Initialize auth state
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && checkTokenExpiry(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setLastActiveTime(Date.now());
    } else if (storedToken) {
      refreshToken();
    }
  }, []);

  // Activity and token refresh checker
  useEffect(() => {
    const checkActivity = () => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActiveTime;

      if (timeSinceLastActivity > ACTIVITY_TIMEOUT) {
        toast.info("Session expired due to inactivity");
        logout();
      } else if (token && timeSinceLastActivity > TOKEN_REFRESH_INTERVAL) {
        refreshToken();
      }
    };

    const activityInterval = setInterval(
      checkActivity,
      ACTIVITY_CHECK_INTERVAL
    );

    return () => clearInterval(activityInterval);
  }, [lastActiveTime, token]);

  // Activity event listeners
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
