import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Check if the user is logged in (i.e., if the token exists in localStorage)
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/admin" />;
  }

  // If authenticated, render the children (i.e., the protected component)
  return children;
};

export default PrivateRoute;
