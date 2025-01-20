import React from "react";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRoles?: string[]; // Accept an array of roles
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  const isAuthenticated = Boolean(authToken);

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    navigate("/");
  }

  // If specific roles are required, check if the user's role matches any of them
  if (requiredRoles && !requiredRoles.includes(userRole || "")) {
    navigate("/");
  }

  // Allow access to the children if authenticated and authorized
  return children;
};

export default PrivateRoute;
