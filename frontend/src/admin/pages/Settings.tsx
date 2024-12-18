import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Settings: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const [settings, setSettings] = useState({
    siteName: "WaterproofStore",
    siteEmail: "info@waterproofstore.com",
    enableNotifications: true,
    darkMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the settings to your backend
    console.log("Settings saved:", settings);
    toast.success("Settings saved successfully");
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="siteName">Site Name</label>
                      <Input
                        id="siteName"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="siteEmail">Site Email</label>
                      <Input
                        id="siteEmail"
                        name="siteEmail"
                        type="email"
                        value={settings.siteEmail}
                        onChange={handleChange}
                        className="border p-2 rounded"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableNotifications"
                        checked={settings.enableNotifications}
                        onCheckedChange={() =>
                          handleToggle("enableNotifications")
                        }
                      />
                      <label htmlFor="enableNotifications">
                        Enable Notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="darkMode"
                        checked={settings.darkMode}
                        onCheckedChange={() => handleToggle("darkMode")}
                      />
                      <label htmlFor="darkMode">Dark Mode</label>
                    </div>
                    <Button variant="secondary" type="submit">
                      Save Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
