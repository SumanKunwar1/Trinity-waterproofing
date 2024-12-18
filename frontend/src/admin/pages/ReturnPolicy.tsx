import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
// import { Button } from "../components/ui/button"; // If needed in the future

const ReturnPolicy: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
                  <CardTitle className="text-2xl font-bold">
                    Return Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-2">
                    1. Return Window
                  </h2>
                  <p className="mb-4">
                    We offer a 30-day return policy for most items. To be
                    eligible for a return, your item must be unused and in the
                    same condition that you received it. It must also be in the
                    original packaging.
                  </p>

                  <h2 className="text-xl font-semibold mb-2">2. Refunds</h2>
                  <p className="mb-4">
                    Once we receive your item, we will inspect it and notify you
                    that we have received your returned item. We will
                    immediately notify you on the status of your refund after
                    inspecting the item. If your return is approved, we will
                    initiate a refund to your credit card (or original method of
                    payment). You will receive the credit within a certain
                    amount of days, depending on your card issuer's policies.
                  </p>

                  <h2 className="text-xl font-semibold mb-2">3. Shipping</h2>
                  <p className="mb-4">
                    You will be responsible for paying for your own shipping
                    costs for returning your item. Shipping costs are
                    non-refundable. If you receive a refund, the cost of return
                    shipping will be deducted from your refund.
                  </p>

                  <h2 className="text-xl font-semibold mb-2">4. Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions on how to return your item to us,
                    contact us at returns@waterproofstore.com.
                  </p>

                  <p>
                    This return policy is effective as of June 1, 2023 and will
                    remain in effect except with respect to any changes in its
                    provisions in the future, which will be in effect
                    immediately after being posted on this page. We reserve the
                    right to update or change our Return Policy at any time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
