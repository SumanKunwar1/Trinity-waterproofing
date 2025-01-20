import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TinyMCEEditor from "../components/Editor";
import {
  getLatestPrivacyPolicy,
  createOrUpdatePrivacyPolicy,
} from "../utils/privacyPolicy";

const PrivacyPolicyForm: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const policy = await getLatestPrivacyPolicy();
      if (policy && policy.content) {
        setEditorContent(policy.content);
        setIsEditing(true);
      } else {
        setEditorContent("");
        setIsEditing(false);
      }
    } catch (error: any) {
      // console.error("Error fetching policy:", error);
      toast.error(error.message || "Failed to fetch policy");
      setEditorContent("");
      setIsEditing(false);
    }
  };

  const handleSavePolicy = async () => {
    try {
      // Send the raw HTML content to the server
      await createOrUpdatePrivacyPolicy(editorContent);
      toast.success(
        isEditing ? "Policy updated successfully" : "Policy added successfully"
      );
      navigate("/admin/privacy-policy");
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("Failed to save policy");
    }
  };

  return (
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {isEditing ? "Edit Privacy Policy" : "Add New Privacy Policy"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TinyMCEEditor
                  value={editorContent}
                  onChange={setEditorContent}
                  height={600}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/privacy-policy")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSavePolicy}>
                    {isEditing ? "Update Policy" : "Save Policy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicyForm;
