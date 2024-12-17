import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminLogin from "./pages/AdminLogin";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute

// Lazy loading admin pages
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
const Solutions = lazy(() => import("./pages/Solutions"));
const Sliders = lazy(() => import("./pages/Sliders"));
const GenerateReport = lazy(() => import("./pages/GenerateReport"));

function AdminApp() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public route for login */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Private routes (protected by PrivateRoute) */}
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
            path="/admin/reports"
            element={
              <PrivateRoute>
                <Reports />
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
            path="/admin/solutions"
            element={
              <PrivateRoute>
                <Solutions />
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
      </Suspense>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default AdminApp;
