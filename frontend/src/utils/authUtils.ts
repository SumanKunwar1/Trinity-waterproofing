import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
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

    navigate("/login", { replace: true });
    window.location.reload();
  };
};
