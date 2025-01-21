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

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    navigate("/");
  };

  return handleLogout;
};
