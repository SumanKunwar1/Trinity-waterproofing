import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());

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
    localStorage.removeItem("authToken");
  };

  async function refreshToken() {
    try {
      const response = await fetch("/api/users/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // If needed, but not strictly necessary for a simple POST request
        },
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }

      // Assuming the response contains the new access token
      const data = await response.json();
      console.log(data);
      const newAccessToken = data.token; // Modify according to your API's response format
      console.log("New Access Token:", newAccessToken);

      // Store the new access token in local storage or a global state if needed
      localStorage.setItem("authToken", newAccessToken);
      setToken(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && checkTokenExpiry(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle token expiry and user activity tracking
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        token &&
        checkTokenExpiry(token) &&
        Date.now() - lastActiveTime > 15 * 60 * 1000 // 15 minutes of inactivity
      ) {
        logout(); // Log out after 15 minutes of inactivity
      } else if (
        token &&
        checkTokenExpiry(token) &&
        Date.now() - lastActiveTime < 15 * 60 * 1000
      ) {
        refreshToken(); // Refresh token if still valid and user is active
      }
    }, 5 * 60 * 1000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [lastActiveTime, token]);

  // Event listeners to track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActiveTime(Date.now()); // Update last active time on activity
    };

    // Adding multiple event listeners to track different activities
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity); // Mouse clicks
    window.addEventListener("touchstart", handleActivity); // Touch events (mobile)
    window.addEventListener("scroll", handleActivity); // Scrolling
    window.addEventListener("focus", handleActivity); // Page focus (window focus)
    window.addEventListener("resize", handleActivity); // Window resizing

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("focus", handleActivity);
      window.removeEventListener("resize", handleActivity);
    };
  }, []); // Empty dependency array means these listeners are added once when component mounts

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
