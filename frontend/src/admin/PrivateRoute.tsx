import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Check if the user is authenticated (i.e., if the token exists in localStorage)
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole"); // Assuming the role is stored in localStorage

  // Check if the user is authenticated and has an admin role
  const isAuthenticated = Boolean(authToken);
  const isAdmin = userRole === "admin";

  if (!isAuthenticated && !isAdmin) {
    // If not authenticated or not an admin, redirect to the login or other page
    return <Navigate to="/" />;
  }

  // If authenticated and is an admin, render the children (i.e., the protected component)
  return children;
};

export default PrivateRoute;
