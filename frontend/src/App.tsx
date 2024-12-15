import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
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
// import { CustomerProfilePage } from "./pages/customer-profile/page";
import { DashboardPage } from "./pages/customer-profile/dashboard/page";
import { ManageProfilePage } from "./pages/customer-profile/manage-profile/page";
import { PurchaseHistoryPage } from "./pages/customer-profile/purchase-history/page";
import { ReturnAndCancelPage } from "./pages/customer-profile/return-and-cancel/page";
import AddressBookPage from "./pages/customer-profile/address-book/page";

function App() {
  const isAdmin = true;
  return (
    <ErrorBoundary>
      {isAdmin ? (
        <AdminApp />
      ) : (
        <>
          <CartProvider>
            <WishlistProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* <Route
                    path="/customer/profile"
                    element={<CustomerProfilePage />}
                  /> */}
                  <Route
                    path="/customer/dashboard"
                    element={<DashboardPage />}
                  />
                  <Route
                    path="/customer/manage-profile"
                    element={<ManageProfilePage />}
                  />
                  <Route
                    path="/customer/purchase-history"
                    element={<PurchaseHistoryPage />}
                  />
                  <Route
                    path="/customer/address-book"
                    element={<AddressBookPage />}
                  />
                  <Route
                    path="/customer/return-and-cancel"
                    element={<ReturnAndCancelPage />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <ToastContainer />
            </WishlistProvider>
          </CartProvider>
        </>
      )}
      ;
    </ErrorBoundary>
  );
}

export default App;
