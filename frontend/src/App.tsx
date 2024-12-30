import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Wishlist from "./pages/Wishlist";
import AdminApp from "./admin/AdminApp";
import { DashboardPage } from "./pages/customer-profile/dashboard/page";
import { ManageProfilePage } from "./pages/customer-profile/manage-profile/page";
import { PurchaseHistoryPage } from "./pages/customer-profile/purchase-history/page";
import { ReturnAndCancelPage } from "./pages/customer-profile/return-and-cancel/page";
import AddressBookPage from "./pages/customer-profile/address-book/page";
import PrivateRoute from "./router/PrivateRoute";
import ForgetPassword from "./pages/ForgetPassword";
import FAQPage from "./pages/FAQPage";
import ShippingPage from "./pages/ShippingPolicy";
import ReturnPolicyPage from "./pages/ReturnPolicy";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import { AuthProvider } from "./context/AuthContext";
import OrderSuccess from "./components/cart/OrderSuccess";
import OrderFailure from "./components/cart/OrderFailure";
import { RatingsAndReviews } from "./pages/customer-profile/rating-review/page";
function App() {
  const userRole = localStorage.getItem("userRole");
  return (
    <ErrorBoundary>
      {userRole === "admin" ? (
        <AdminApp />
      ) : (
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/products/:id" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-failure" element={<OrderFailure />} />

                <Route path="/forgot-password" element={<ForgetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/return-policy" element={<ReturnPolicyPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
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
              <ToastContainer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      )}
    </ErrorBoundary>
  );
}

export default App;
