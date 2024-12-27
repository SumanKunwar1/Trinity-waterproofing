// src/utils/authUtils.ts
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const keysToRemove = [
      "authToken",
      "userRole",
      "user",
      "userId",
      "userFullName",
      "userEmail",
      "userPassword",
      "userNumber",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Redirect to login page
    navigate("/login");
    window.location.reload();
  };

  return handleLogout;
};
