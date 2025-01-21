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

  if (!isAuthenticated && !hasRedirected) {
    setHasRedirected(true);
    navigate("/login");
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(userRole || "")) {
    logout();
    return null;
  }

  return children;
};

export default PrivateRoute;
