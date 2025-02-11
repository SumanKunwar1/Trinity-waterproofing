import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaListUl,
  FaShoppingCart,
  FaTags,
  FaUsers,
  FaFileAlt,
  FaSlidersH,
  FaCog,
  FaQuestionCircle,
  FaLifeRing,
  FaInfoCircle,
  FaShieldAlt,
  FaExchangeAlt,
  FaShippingFast,
  FaSignOutAlt,
  FaNewspaper,
} from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { useLogout } from "../../utils/authUtils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const handleLogout = useLogout();

  const menuItems = [
    { icon: FaChartBar, text: "Dashboard", link: "/admin/dashboard" },
    { icon: FaBox, text: "Products", link: "/admin/products" },
    { icon: FaListUl, text: "Categories", link: "/admin/categories" },
    { icon: FaTags, text: "Brands", link: "/admin/brands" },
    { icon: FaShoppingCart, text: "Orders", link: "/admin/orders" },
    {
      icon: FaShoppingCart,
      text: "Returns & Cancels",
      link: "/admin/returns-and-cancels",
    },
    { icon: MdReviews, text: "Reviews", link: "/admin/reviews" },
    { icon: FaUsers, text: "Users", link: "/admin/users" },
    { icon: FaNewspaper, text: "Newsletters", link: "/admin/newsletter" },
    { icon: FaQuestionCircle, text: "Enquiries", link: "/admin/enquiries" },
    { icon: GrGallery, text: "Gallery", link: "/admin/gallery" },
    { icon: FaFileAlt, text: "Reports", link: "/admin/reports" },
    { icon: FaSlidersH, text: "Sliders", link: "/admin/sliders" },
    { icon: FaCog, text: "Settings", link: "/admin/settings" },
    { icon: FaQuestionCircle, text: "FAQs", link: "/admin/faqs" },
    { icon: FaLifeRing, text: "Help", link: "/admin/help" },
    { icon: FaInfoCircle, text: "About", link: "/admin/about" },
    { icon: FaInfoCircle, text: "Services", link: "/admin/services" },
    // { icon: FaUsers, text: "Teams", link: "/admin/team" },
    {
      icon: FaShieldAlt,
      text: "Privacy Policy",
      link: "/admin/privacy-policy",
    },
    {
      icon: FaExchangeAlt,
      text: "Return Policy",
      link: "/admin/return-policy",
    },
    {
      icon: FaShippingFast,
      text: "Shipping Policy",
      link: "/admin/shipping-policy",
    },
    {
      icon: FaFileAlt,
      text: "Generate Report",
      link: "/admin/generate-report",
    },
    {
      icon: FaSignOutAlt,
      text: "Logout",
      link: "/login",
      onClick: handleLogout,
    },
  ];

  return (
    <aside
      className={`fixed z-50 top-0 left-0 min-h-screen  bg-white shadow-md transform transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-64`}
    >
      <div className="p-4 flex justify-between items-center md:block">
        <h2 className="text-2xl font-semibold">Trinity Waterproofing</h2>
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleSidebar}
        >
          ✕
        </button>
      </div>

      <nav className="mt-6 overflow-y-auto max-h-[calc(100vh-8rem)] h-lvh">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={item.onClick} // This triggers the handleLogout for logout action
            className={`flex items-center px-6 py-2 mt-4 duration-200 border-l-4 ${
              location.pathname === item.link
                ? "border-blue-500 bg-blue-100 text-blue-500"
                : "border-transparent hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="mx-4">{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
