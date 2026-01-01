import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SocketProvider } from "./context/SocketContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PrivateRoute from "./router/PrivateRoute";
import { Provider } from "react-redux";
import { store } from "./admin/store/store";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import Loader from "./components/common/Loader";
import EmailForm from "./pages/EmailForm";
import ResetPasswordForm from "./pages/ResetPassword";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const ProductListing = lazy(() => import("./pages/ProductListing"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

const DashboardPage = lazy(
  () => import("./pages/customer-profile/dashboard/page")
);
const ManageProfilePage = lazy(
  () => import("./pages/customer-profile/manage-profile/page")
);
const PurchaseHistoryPage = lazy(
  () => import("./pages/customer-profile/purchase-history/page")
);
const ReturnAndCancelPage = lazy(
  () => import("./pages/customer-profile/return-and-cancel/page")
);
const AddressBookPage = lazy(
  () => import("./pages/customer-profile/address-book/page")
);
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPolicy"));
const ReturnPolicyPage = lazy(() => import("./pages/ReturnPolicy"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicy"));
const RatingsAndReviews = lazy(
  () => import("./pages/customer-profile/rating-review/page")
);
const Notification = lazy(
  () => import("./pages/customer-profile/notification/page")
);
const ServicesPage = lazy(() => import("./pages/Services"));
const TeamPage = lazy(() => import("./pages/Teams"));
const UserGallery = lazy(() => import("./pages/Gallery"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));

// Lazy load admin components
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("./admin/pages/Products"));
const AdminCategories = lazy(() => import("./admin/pages/Categories"));
const AdminOrders = lazy(() => import("./admin/pages/Orders"));
const AdminBrands = lazy(() => import("./admin/pages/Brands"));
const AdminUsers = lazy(() => import("./admin/pages/Users"));
const AdminReports = lazy(() => import("./admin/pages/Reports"));
const AdminSettings = lazy(() => import("./admin/pages/Settings"));
const AdminFAQs = lazy(() => import("./admin/pages/FAQs"));
const AdminHelp = lazy(() => import("./admin/pages/Help"));
const AdminAbout = lazy(() => import("./admin/pages/About"));
const AdminPrivacyPolicy = lazy(() => import("./admin/pages/PrivacyPolicy"));
const AdminReturnPolicy = lazy(() => import("./admin/pages/ReturnPolicy"));
const AdminShippingPolicy = lazy(() => import("./admin/pages/ShippingPolicy"));
const AdminSliders = lazy(() => import("./admin/pages/Sliders"));
const AdminGenerateReport = lazy(() => import("./admin/pages/GenerateReport"));
const AdminProductForm = lazy(() => import("./admin/pages/ProductForm"));
const AdminEditProductImages = lazy(
  () => import("./admin/pages/EditProductImage")
);
const AdminReviews = lazy(() => import("./admin/pages/Review"));
const AdminReturnsAndCancellations = lazy(
  () => import("./admin/pages/ReturnsAndCancel")
);
const AdminNewsletters = lazy(() => import("./admin/pages/Newsletters"));
const AdminGallery = lazy(() => import("./admin/pages/Gallery"));
const AdminEnquiries = lazy(() => import("./admin/pages/Enquiry"));
const AdminServicePage = lazy(() => import("./admin/pages/Services"));
const AdminPrivacyPolicyForm = lazy(
  () => import("./admin/pages/PrivacyPolicyForm")
);
const AdminTeamPage = lazy(() => import("./admin/pages/Team"));

// Debug component to log current route
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Current Route:", location.pathname);
    console.log("Current Search:", location.search);
    console.log("Current Hash:", location.hash);
  }, [location]);
  
  return null;
}

// 🔓 Development Admin Access Button
function DevAdminAccessButton() {
  const location = useLocation();
  
  // Only show on homepage
  if (location.pathname !== "/") return null;
  
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      backgroundColor: "#ff4444",
      color: "white",
      padding: "15px 25px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      fontWeight: "bold",
      textDecoration: "none",
      cursor: "pointer"
    }}>
      <Link to="/admin/dashboard" style={{ color: "white", textDecoration: "none" }}>
        🔓 Admin Dashboard (Dev Mode)
      </Link>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SocketProvider>
                  <RouteDebugger />
                  <DevAdminAccessButton />
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/teams" element={<TeamPage />} />
                      <Route path="/products" element={<ProductListing />} />
                      <Route path="/products/:id" element={<ProductListing />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/gallery" element={<UserGallery />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<EmailForm />} />
                      <Route
                        path="/reset-password"
                        element={<ResetPasswordForm />}
                      />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicyPage />}
                      />
                      <Route
                        path="/return-policy"
                        element={<ReturnPolicyPage />}
                      />
                      <Route path="/shipping-policy" element={<ShippingPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />

                      {/* Admin Login Route */}
                      <Route path="/admin/login" element={<AdminLogin />} />

                      {/* Protect customer profile pages */}
                      <Route
                        path="/customer/dashboard"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <DashboardPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/notifications"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <Notification />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/manage-profile"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <ManageProfilePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/purchase-history"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <PurchaseHistoryPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/address-book"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <AddressBookPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/reviews-ratings"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <RatingsAndReviews />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/customer/return-and-cancel"
                        element={
                          <PrivateRoute requiredRoles={["b2c", "b2b"]}>
                            <ReturnAndCancelPage />
                          </PrivateRoute>
                        }
                      />

                      {/* Protect admin pages - NOW WITH BYPASS MODE */}
                      <Route
                        path="/admin/dashboard"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminProducts />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/add-product"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminProductForm />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/add-product/:id"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminProductForm />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/edit-product-images/:id"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminEditProductImages />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/categories"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminCategories />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminOrders />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/enquiries"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminEnquiries />
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
                            <AdminReviews />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/brands"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminBrands />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminUsers />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/newsletter"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminNewsletters />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/reports"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminReports />
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
                            <AdminSettings />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/faqs"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminFAQs />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/team"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminTeamPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/help"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminHelp />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/about"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminAbout />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/services"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminServicePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/privacy-policy"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminPrivacyPolicy />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/privacy-policy-form"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminPrivacyPolicyForm />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/return-policy"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminReturnPolicy />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/shipping-policy"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminShippingPolicy />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/sliders"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminSliders />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/admin/generate-report"
                        element={
                          <PrivateRoute requiredRoles={["admin"]}>
                            <AdminGenerateReport />
                          </PrivateRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <ToastContainer />
                </SocketProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;