import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("useLogout - Clearing localStorage keys...");
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
      console.log(`useLogout - Removing key: ${key}`);
      localStorage.removeItem(key);
    });

    console.log("useLogout - Redirecting to /...");
    navigate("/");
  };

  return handleLogout;
};
