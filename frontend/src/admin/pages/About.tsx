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
import ContentForm from "../components/ContentForm";
import TabList from "../components/TabList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IAbout {
  _id?: string;
  title: string;
  description: string;
  image: string;
  cores: ICore[];
  tabs: ITab[];
}

interface ICore {
  _id?: string;
  title: string;
  description: string;
  image: string;
}

interface ITab {
  _id?: string;
  title: string;
  description: string;
  image: string;
}

const AdminAbout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [about, setAbout] = useState<IAbout | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<"about" | "cores" | "tab">("about");
  const [editingContent, setEditingContent] = useState<any | null>(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleError = async (response: Response, fallbackMessage: string) => {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  };

  useEffect(() => {
    fetchAbout();
    fetchCore();
    fetchTabs();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      if (!response.ok) {
        await handleError(response, "Failed to fetch about data");
      }
      const data: IAbout = await response.json();
      setAbout((prevState) => ({
        ...prevState,
        ...data,
        cores: prevState?.cores || [],
        tabs: prevState?.tabs || [],
      }));
    } catch (error: any) {
      toast.error(error.message);
      // console.error("Error fetching about data:", error);
    }
  };

  const fetchCore = async () => {
    try {
      const response = await fetch("/api/about/cores");
      if (!response.ok) {
        await handleError(response, "Failed to fetch core values");
      }
      const data: ICore[] = await response.json();
      setAbout((prevState) => ({
        ...(prevState || {
          title: "",
          description: "",
          image: "",
          cores: [],
          tabs: [],
        }),
        cores: data,
      }));
    } catch (error: any) {
      toast.error(error.message);
      // console.error("Error fetching core values:", error);
    }
  };

  const fetchTabs = async () => {
    try {
      const response = await fetch("/api/about/tabs");
      if (!response.ok) {
        await handleError(response, "Failed to fetch tabs");
      }
      const data: ITab[] = await response.json();
      setAbout((prevState) => ({
        ...(prevState || {
          title: "",
          description: "",
          image: "",
          cores: [],
          tabs: [],
        }),
        tabs: data,
      }));
    } catch (error: any) {
      toast.error(error.message);
      // console.error("Error fetching tabs:", error);
    }
  };

  const handleFormSubmit = () => {
    fetchAbout();
    fetchCore();
    fetchTabs();
    setIsFormOpen(false);
    setEditingContent(null);
  };

  const openForm = (type: "about" | "cores" | "tab", content: any = null) => {
    setFormType(type);
    setEditingContent(content);
    setIsFormOpen(true);
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
              {/* About Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>About WaterproofStore</CardTitle>
                    <button
                      onClick={() => openForm("about", about || null)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      {about ? "Edit About" : "Add About"}
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {about ? (
                    <>
                      <h2 className="text-xl font-bold mb-2">{about.title}</h2>
                      <p className="mb-4">{about.description}</p>
                      <img
                        src={about.image}
                        alt="About"
                        className="w-full h-48 object-cover rounded"
                      />
                    </>
                  ) : (
                    <p>No about content available. Please create it.</p>
                  )}
                </CardContent>
              </Card>

              {/* Core Values Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Core Values</CardTitle>
                    <button
                      onClick={() => openForm("cores")}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add Core Value
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {about && about.cores.length > 0 ? (
                    <TabList
                      tabs={about.cores}
                      onEdit={(core) => openForm("cores", core)}
                      onDelete={fetchCore}
                      type="cores"
                    />
                  ) : (
                    <p>No core values available. Please add them.</p>
                  )}
                </CardContent>
              </Card>

              {/* About Tabs Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>About Tabs</CardTitle>
                    <button
                      onClick={() => openForm("tab")}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add New Tab
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {about && about.tabs.length > 0 ? (
                    <TabList
                      tabs={about.tabs}
                      onEdit={(tab) => openForm("tab", tab)}
                      onDelete={fetchTabs}
                      type="tabs"
                    />
                  ) : (
                    <p>No tabs available. Please add them.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Content Form */}
      {isFormOpen && (
        <ContentForm
          onClose={() => {
            setIsFormOpen(false);
            setEditingContent(null);
          }}
          onSubmit={handleFormSubmit}
          type={formType}
          content={editingContent}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminAbout;
