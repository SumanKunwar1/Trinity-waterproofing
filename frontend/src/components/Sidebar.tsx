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
  FaLightbulb,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { icon: FaChartBar, text: "Dashboard", link: "/" },
    { icon: FaBox, text: "Products", link: "/products" },
    { icon: FaListUl, text: "Categories", link: "/categories" },
    { icon: FaTags, text: "Brands", link: "/brands" },
    { icon: FaShoppingCart, text: "Orders", link: "/orders" },
    { icon: FaUsers, text: "Users", link: "/users" },
    { icon: FaFileAlt, text: "Reports", link: "/reports" },
    { icon: FaSlidersH, text: "Sliders", link: "/sliders" },
    { icon: FaCog, text: "Settings", link: "/settings" },
    { icon: FaQuestionCircle, text: "FAQs", link: "/faqs" },
    { icon: FaLifeRing, text: "Help", link: "/help" },
    { icon: FaInfoCircle, text: "About", link: "/about" },
    { icon: FaShieldAlt, text: "Privacy Policy", link: "/privacy-policy" },
    { icon: FaExchangeAlt, text: "Return Policy", link: "/return-policy" },
    { icon: FaLightbulb, text: "Solutions", link: "/solutions" },
    { icon: FaFileAlt, text: "Generate Report", link: "/generate-report" },
  ];

  return (
    <aside
      className={`fixed z-50 top-0 left-0 h-full bg-white shadow-md transform transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-64`}
    >
      <div className="p-4 flex justify-between items-center md:block">
        <h2 className="text-2xl font-semibold">WaterproofStore</h2>
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleSidebar}
        >
          ✕
        </button>
      </div>

      <nav className="mt-6 overflow-y-auto h-full">
        {" "}
        {/* Added scrollable area here */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
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
