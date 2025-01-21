import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Help: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const tabContent: Record<string, React.ReactNode> = {
    category: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adding a Category</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Navigate to the Categories section in your admin panel.</li>
          <img
            src="/assets/category1.png"
            alt="Adding a category screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click on the "Add New Category" button.</li>

          <li>Enter the category name and description.</li>
          <img
            src="/assets/category2.png"
            alt="Adding a category screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click "Add Category" button to create the new category.</li>
        </ol>
        <img
          src="/assets/category4.png"
          alt="Adding a category screenshot"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    ),
    subcategory: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adding a Subcategory</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to the Subcategories section in your admin panel.</li>
          <img
            src="/assets/category1.png"
            alt="Adding a subcategory screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click on "Add New Subcategory".</li>
          <li>Enter the subcategory name and description.</li>
          <li>Select the parent category from the dropdown.</li>
          <img
            src="/assets/category3.png"
            alt="Adding a subcategory screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click "Save" to create the new subcategory.</li>
        </ol>
        <img
          src="/assets/category5.png"
          alt="Adding a subcategory screenshot"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    ),
    brand: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adding a Brand</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to the Brands section in your admin panel.</li>
          <img
            src="/assets/brand1.png"
            alt="Adding a brand screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click on the "Add New Brand" button.</li>
          <li>Enter the brand name, description, and website URL.</li>
          <li>Upload the brand logo.</li>
          <img
            src="/assets/brand2.png"
            alt="Adding a brand screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Specify any associated categories or products.</li>
          <li>Click "Save" to add the new brand.</li>
        </ol>
        <img
          src="/assets/brand3.png"
          alt="Adding a brand screenshot"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    ),
    product: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adding a Product</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to the Products section in your admin panel.</li>
          <img
            src="/assets/product1.png"
            alt="Adding a product screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click on "Add New Product".</li>
          <li>Fill in the product details (name, description, price, etc.).</li>
          <li>Select the category, subcategory, and brand.</li>
          <li>Upload product images.</li>
          <li>Set inventory levels and any variants.</li>
          <img
            src="/assets/product2.png"
            alt="Adding a product screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <img
            src="/assets/product3.png"
            alt="Adding a product screenshot"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <li>Click "Create Product" to add the product to your store.</li>
          <li>
            Click on switch button to make your product featured product or not.
          </li>
        </ol>
        <img
          src="/assets/product4.png"
          alt="Adding a product screenshot"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    ),
    editing: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Editing Items</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Navigate to the appropriate section (Categories, Subcategories,
            Brands, or Products).
          </li>
          <li>Find the item you want to edit and click the "Edit" button.</li>
          <li>Update the necessary information in the edit form.</li>
          <li>For images, you can replace existing ones or add new ones.</li>
          <li>Review your changes and click "Save" or "Update".</li>
        </ol>
        <img
          src="/assets/brand3.png"
          alt="Editing items screenshot"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
      </div>
    ),
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Help Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="category" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
                    <TabsTrigger value="category">Category</TabsTrigger>
                    <TabsTrigger value="subcategory">Subcategory</TabsTrigger>
                    <TabsTrigger value="brand">Brand</TabsTrigger>
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="editing">Editing</TabsTrigger>
                  </TabsList>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="tabContent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="category">
                        {tabContent.category}
                      </TabsContent>
                      <TabsContent value="subcategory">
                        {tabContent.subcategory}
                      </TabsContent>
                      <TabsContent value="brand">
                        {tabContent.brand}
                      </TabsContent>
                      <TabsContent value="product">
                        {tabContent.product}
                      </TabsContent>
                      <TabsContent value="editing">
                        {tabContent.editing}
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Help;
