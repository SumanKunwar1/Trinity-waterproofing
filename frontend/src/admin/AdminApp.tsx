import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
// Directly import the admin pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Brands from "./pages/Brands";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import FAQs from "./pages/FAQs";
import Help from "./pages/Help";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Sliders from "./pages/Sliders";
import GenerateReport from "./pages/GenerateReport";
import ProductForm from "./pages/ProductForm";
import EditProductImages from "./pages/EditProductImage";
import Reviews from "./pages/Review";
import { Provider } from "react-redux";
import { store } from "../admin/store/store";
import AdminReturnsAndCancellations from "./pages/ReturnsAndCancel";
import Newsletters from "./pages/Newsletters";
import AdminGallery from "./pages/Gallery";
import { AuthProvider } from "../context/AuthContext";
import Enquiries from "./pages/Enquiry";
import { SocketProvider } from "../context/SocketContext";
import ServicePage from "./pages/Services";

function AdminApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Provider store={store}>
          <SocketProvider>
            <Routes>
              {/* Private routes (protected by PrivateRoute) */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/add-product/:id"
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/edit-product-images/:id"
                element={
                  <PrivateRoute>
                    <EditProductImages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <PrivateRoute>
                    <Categories />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/enquiries"
                element={
                  <PrivateRoute>
                    <Enquiries />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/returns-and-cancels"
                element={
                  <PrivateRoute>
                    <AdminReturnsAndCancellations />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <PrivateRoute>
                    <Reviews />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/brands"
                element={
                  <PrivateRoute>
                    <Brands />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute>
                    <Users />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/newsletter"
                element={
                  <PrivateRoute>
                    <Newsletters />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <PrivateRoute>
                    <AdminGallery />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/faqs"
                element={
                  <PrivateRoute>
                    <FAQs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/help"
                element={
                  <PrivateRoute>
                    <Help />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/about"
                element={
                  <PrivateRoute>
                    <About />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <PrivateRoute>
                    <ServicePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/privacy-policy"
                element={
                  <PrivateRoute>
                    <PrivacyPolicy />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/return-policy"
                element={
                  <PrivateRoute>
                    <ReturnPolicy />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/shipping-policy"
                element={
                  <PrivateRoute>
                    <ShippingPolicy />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/sliders"
                element={
                  <PrivateRoute>
                    <Sliders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/generate-report"
                element={
                  <PrivateRoute>
                    <GenerateReport />
                  </PrivateRoute>
                }
              />
            </Routes>
          </SocketProvider>
        </Provider>
      </AuthProvider>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default AdminApp;
