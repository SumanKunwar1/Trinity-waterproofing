import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const decodeToken = (token: string) => {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  };

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
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setToken(null);
    
    // Only navigate to home if we're already initialized
    // This prevents redirect on initial page load
    if (isInitialized) {
      navigate("/", { replace: true });
    }
  };

  // Initial authentication check
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      // Clear invalid token but DON'T navigate
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setToken(null);
    }
    
    // Mark as initialized after first check
    setIsInitialized(true);
  }, []);

  // Token expiry timer
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
  }, [token, isInitialized]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};