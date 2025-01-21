import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../utils/authUtils";
import {
  FaTachometerAlt,
  FaHistory,
  FaAddressBook,
  FaUserCog,
  FaUndoAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { motion } from "framer-motion";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  number: string;
  createdAt: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substr(0, 2);
};

export const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const handleLogout = useLogout();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeItem, setActiveItem] = useState<string>(
    localStorage.getItem("activeItem") || "Dashboard"
  );
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      label: "Notifications",
      path: "/customer/notifications",
      icon: (
        <div className="relative">
          <IoIosNotifications />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
            >
              {unreadNotifications}
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Purchase History",
      path: "/customer/purchase-history",
      icon: <FaHistory />,
    },
    {
      label: "Address Book",
      path: "/customer/address-book",
      icon: <FaAddressBook />,
    },
    {
      label: "Manage Profile",
      path: "/customer/manage-profile",
      icon: <FaUserCog />,
    },
    {
      label: "Return & Cancel",
      path: "/customer/return-and-cancel",
      icon: <FaUndoAlt />,
    },
    {
      label: "Reviews & Ratings",
      path: "/customer/reviews-ratings",
      icon: <MdReviews />,
    },
    { label: "Log Out", path: "/", icon: <FaSignOutAlt /> },
  ];

  const handleNavigation = (path: string, label: string) => {
    if (label === "Log Out") {
      handleLogout();
      return;
    }
    setActiveItem(label);
    navigate(path);
  };

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("userId") || "");
        const response = await fetch(`/api/notification/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok)
          throw new Error("Failed to fetch unread notifications count");
        const data = await response.json();
        setUnreadNotifications(data.count);
      } catch (error) {
        // console.error("Error fetching unread notifications count:", error);
      }
    };

    fetchUnreadNotifications();
    const intervalId = setInterval(fetchUnreadNotifications, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      className={` w-full  bg-[#293855] text-white flex flex-col items-center py-6 h-screen overflow-auto ${
        isOpen ? "w-64" : "w-16"
      }`}
      initial={false}
      animate={{ width: isOpen ? "16rem" : "4rem" }}
    >
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="  bg-[#293855] text-white p-1 rounded-full"
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      )}

      {isOpen && (
        <div className="user-info p-4 flex flex-col items-center">
          <div className="avatar mb-3">
            {user ? (
              <div className="avatar-inner w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-secondary flex items-center justify-center">
                <span className="text-xl text-white">
                  {user.fullName ? getInitials(user.fullName) : "U"}
                </span>
              </div>
            ) : (
              <div className="avatar-inner w-16 h-16 rounded-full bg-gray-300"></div>
            )}
          </div>
          <div className="user-name text-center text-gray-800">
            {user ? (
              <>
                <div className="text-lg text-gray-200 font-semibold">
                  {user.fullName}
                </div>
                <div className="text-sm text-gray-200">{user.email}</div>
              </>
            ) : (
              <div className="text-gray-500">No User Logged In</div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="w-[80%] border-b-2 border-gray-600 mb-3"></div>
      )}

      <div className="flex flex-col w-full px-2 space-y-2">
        {navItems.map((item) => (
          <motion.div
            key={item.label}
            onClick={() => handleNavigation(item.path, item.label)}
            className={`flex items-center cursor-pointer py-3 px-3 rounded-md transition duration-200 ${
              activeItem === item.label
                ? "bg-blue-600 text-white"
                : "text-white hover:bg-secondary"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl">{item.icon}</div>
            {isOpen && <Label className="text-sm ml-3">{item.label}</Label>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
