import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../utils/authUtils";

const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("AuthProvider - Failed to decode token:", e);
    return null;
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
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

  const handleLogout = useLogout();

  const checkTokenValidity = (token: string | null) => {
    if (!token) {
      console.log("AuthProvider - Token is null or empty.");
      return false;
    }
    const decoded: any = decodeToken(token);
    if (decoded && decoded.exp) {
      const isValid = decoded.exp * 1000 > Date.now();
      console.log("AuthProvider - Token validity:", isValid);
      return isValid;
    }
    console.log("AuthProvider - Failed to extract expiration from token.");
    return false;
  };

  const logout = () => {
    console.log("AuthProvider - Logging out user...");
    handleLogout();
  };

  useEffect(() => {
    console.log("AuthProvider - Initializing auth state...");
    const storedToken = localStorage.getItem("authToken");
    console.log("AuthProvider - Stored token:", storedToken);

    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
      console.log("AuthProvider - User authenticated.");
    } else {
      console.log("AuthProvider - Invalid or expired token... ");
      if (isAuthenticated) {
        console.log("...logging out");
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log("AuthProvider - Setting up token expiry handler...");
      const decoded: any = decodeToken(token);
      if (decoded && decoded.exp) {
        const expiryTime = decoded.exp * 1000 - Date.now();
        console.log(`AuthProvider - Token expires in ${expiryTime} ms.`);
        const timeoutId = setTimeout(() => {
          console.log("AuthProvider - Token expired. Logging out...");
          logout();
        }, expiryTime);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
