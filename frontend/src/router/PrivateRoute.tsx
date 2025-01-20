import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  const userRole = localStorage.getItem("userRole");
  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - userRole:", userRole);
  console.log("PrivateRoute - requiredRoles:", requiredRoles);

  if (!isAuthenticated && !hasRedirected) {
    console.log(
      "PrivateRoute - User not authenticated. Redirecting to /login..."
    );
    setHasRedirected(true);
    navigate("/login");
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(userRole || "")) {
    console.log(
      `PrivateRoute - User role "${userRole}" does not match required roles: ${requiredRoles}. Logging out...`
    );
    logout();
    return null;
  }

  console.log("PrivateRoute - Access granted. Rendering children...");
  return children;
};

export default PrivateRoute;
