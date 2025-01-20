import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus, FaEdit } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getLatestPrivacyPolicy } from "../utils/privacyPolicy";

interface IPrivacyPolicy {
  content: string;
}

const PrivacyPolicy: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [policy, setPolicy] = useState<IPrivacyPolicy | null>(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const data = await getLatestPrivacyPolicy();

      if (!data) {
        throw new Error("Failed to fetch privacy policy");
      }
      setPolicy(data);
    } catch (error: any) {
      // console.error("Error fetching policy:", error);
      toast.error(error.message || "Failed to fetch privacy policy");
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Privacy Policy
                </CardTitle>
                <Button onClick={() => navigate("/admin/privacy-policy-form")}>
                  {policy ? (
                    <>
                      <FaEdit className="mr-2" /> Edit Policy
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Add Policy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {policy ? (
                  <div dangerouslySetInnerHTML={{ __html: policy.content }} />
                ) : (
                  <p>No privacy policy has been added yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
