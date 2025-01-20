import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "../router/PrivateRoute";
import { Provider } from "react-redux";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { store } from "../admin/store/store";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";

// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Orders = lazy(() => import("./pages/Orders"));
const Brands = lazy(() => import("./pages/Brands"));
const Users = lazy(() => import("./pages/Users"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Help = lazy(() => import("./pages/Help"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const Sliders = lazy(() => import("./pages/Sliders"));
const GenerateReport = lazy(() => import("./pages/GenerateReport"));
const ProductForm = lazy(() => import("./pages/ProductForm"));
const EditProductImages = lazy(() => import("./pages/EditProductImage"));
const Reviews = lazy(() => import("./pages/Review"));
const AdminReturnsAndCancellations = lazy(
  () => import("./pages/ReturnsAndCancel")
);
const Newsletters = lazy(() => import("./pages/Newsletters"));
const AdminGallery = lazy(() => import("./pages/Gallery"));
const Enquiries = lazy(() => import("./pages/Enquiry"));
const ServicePage = lazy(() => import("./pages/Services"));
const PrivacyPolicyForm = lazy(() => import("./pages/PrivacyPolicyForm"));
const TeamPage = lazy(() => import("./pages/Team"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));

// Loading component
const Loading = () => <div>Loading...</div>;

function AdminApp() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Provider store={store}>
          <SocketProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route
                      path="/admin/dashboard"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Products />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/add-product"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ProductForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/add-product/:id"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ProductForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/edit-product-images/:id"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <EditProductImages />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/categories"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Categories />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Orders />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/enquiries"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Enquiries />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/returns-and-cancels"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <AdminReturnsAndCancellations />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/reviews"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Reviews />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/brands"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Brands />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Users />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/newsletter"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Newsletters />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Reports />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/gallery"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <AdminGallery />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Settings />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/faqs"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <FAQs />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/admin-team"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <TeamPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/help"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Help />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/about"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <About />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/services"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ServicePage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/privacy-policy"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <PrivacyPolicy />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/privacy-policy-form"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <PrivacyPolicyForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/return-policy"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ReturnPolicy />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/shipping-policy"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <ShippingPolicy />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/sliders"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <Sliders />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin/generate-report"
                      element={
                        <PrivateRoute requiredRoles={["admin"]}>
                          <GenerateReport />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </Suspense>
              </WishlistProvider>
            </CartProvider>
          </SocketProvider>
        </Provider>
      </AuthProvider>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default AdminApp;
