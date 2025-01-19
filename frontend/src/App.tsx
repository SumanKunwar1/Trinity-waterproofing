import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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
const AdminApp = lazy(() => import("./admin/AdminApp"));
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
const OrderSuccess = lazy(() => import("./components/cart/OrderSuccess"));
const OrderFailure = lazy(() => import("./components/cart/OrderFailure"));
const RatingsAndReviews = lazy(
  () => import("./pages/customer-profile/rating-review/page")
);
const Notification = lazy(
  () => import("./pages/customer-profile/notification/page")
);
const ServicesPage = lazy(() => import("./pages/Services"));
const TeamPage = lazy(() => import("./pages/Teams"));
const UserGallery = lazy(() => import("./pages/Gallery"));

function App() {
  const userRole = localStorage.getItem("userRole");

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          {userRole === "admin" ? (
            <Suspense
              fallback={
                <div>
                  <Loader />
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          ) : (
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <SocketProvider>
                    <Suspense fallback={<Loader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/teams" element={<TeamPage />} />
                        <Route path="/products" element={<ProductListing />} />
                        <Route
                          path="/products/:id"
                          element={<ProductListing />}
                        />
                        <Route
                          path="/product/:id"
                          element={<ProductDetail />}
                        />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/gallery" element={<UserGallery />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                          path="/order-success"
                          element={<OrderSuccess />}
                        />
                        <Route
                          path="/order-failure"
                          element={<OrderFailure />}
                        />
                        <Route
                          path="/forgot-password"
                          element={<EmailForm />}
                        />
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
                        <Route
                          path="/shipping-policy"
                          element={<ShippingPage />}
                        />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        {/* Protect customer profile pages */}
                        <Route
                          path="/customer/dashboard"
                          element={
                            <PrivateRoute>
                              <DashboardPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/notifications"
                          element={
                            <PrivateRoute>
                              <Notification />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/manage-profile"
                          element={
                            <PrivateRoute>
                              <ManageProfilePage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/purchase-history"
                          element={
                            <PrivateRoute>
                              <PurchaseHistoryPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/address-book"
                          element={
                            <PrivateRoute>
                              <AddressBookPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/reviews-ratings"
                          element={
                            <PrivateRoute>
                              <RatingsAndReviews />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customer/return-and-cancel"
                          element={
                            <PrivateRoute>
                              <ReturnAndCancelPage />
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
          )}
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
