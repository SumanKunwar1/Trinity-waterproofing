import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Get the authToken and userRole from localStorage
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Check if the user is authenticated
  const isAuthenticated = Boolean(authToken);

  // If not authenticated, redirect to the login page
  if (!isAuthenticated && !userRole) {
    return <Navigate to="/login" />;
  }

  // Allow access to the children if authenticated
  return children;
};

export default PrivateRoute;
