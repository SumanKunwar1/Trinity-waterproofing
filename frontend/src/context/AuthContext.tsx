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
      return false;
    }
    const decoded: any = decodeToken(token);
    if (decoded && decoded.exp) {
      const isValid = decoded.exp * 1000 > Date.now();
      return isValid;
    }
    return false;
  };

  const logout = () => {
    handleLogout();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      if (isAuthenticated) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decoded: any = decodeToken(token);
      if (decoded && decoded.exp) {
        const expiryTime = decoded.exp * 1000 - Date.now();
        const timeoutId = setTimeout(() => {
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
