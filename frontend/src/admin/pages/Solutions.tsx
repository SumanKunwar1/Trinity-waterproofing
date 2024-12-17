import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // ShadCN Card components
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Solutions: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const solutions = [
    {
      title: "Residential Waterproofing",
      description:
        "Protect your home from water damage with our comprehensive residential waterproofing solutions.",
    },
    {
      title: "Commercial Building Waterproofing",
      description:
        "Ensure the longevity and structural integrity of your commercial buildings with our advanced waterproofing techniques.",
    },
    {
      title: "Industrial Waterproofing",
      description:
        "Protect your industrial facilities from water-related issues with our specialized industrial waterproofing solutions.",
    },
    {
      title: "Marine Waterproofing",
      description:
        "Safeguard your marine vessels and structures against water damage with our high-performance marine waterproofing products.",
    },
  ];

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
                  <CardTitle className="text-2xl font-bold">
                    Our Waterproofing Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {solutions.map((solution, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{solution.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{solution.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
