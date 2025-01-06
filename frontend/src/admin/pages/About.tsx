import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TabForm from "../components/TabForm";
import TabList from "../components/TabList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IAbout, ITabAbout } from "../../types/about";

const AdminAbout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [about, setAbout] = useState<IAbout | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<ITabAbout | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      if (!response.ok) {
        throw new Error("Failed to fetch about data");
      }
      const data = await response.json();
      setAbout(data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  const handleFormSubmit = () => {
    fetchAbout();
    setIsFormOpen(false);
    setEditingTab(null);
  };

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About WaterproofStore</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Manage your About page content here. You can add, edit, or
                    delete tabs that will be displayed on the customer-facing
                    About page.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>About Tabs</CardTitle>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add New Tab
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {about && (
                    <TabList
                      tabs={about.tabs}
                      onEdit={(tab) => {
                        setEditingTab(tab);
                        setIsFormOpen(true);
                      }}
                      onDelete={fetchAbout}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
      {isFormOpen && (
        <TabForm
          onClose={() => {
            setIsFormOpen(false);
            setEditingTab(null);
          }}
          onSubmit={handleFormSubmit}
          editingTab={editingTab}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminAbout;
