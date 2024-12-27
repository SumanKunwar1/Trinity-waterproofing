import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../ui/button";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import successImage from "/assets/success.png"; // Add the success image to your assets folder

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <img
            src={successImage}
            alt="Success"
            className="mx-auto mb-4 w-32 h-32 object-cover"
          />
          <h1 className="text-3xl font-bold mb-4">
            Order Placed Successfully!
          </h1>
          <p className="mb-4">
            Thank you for your order. Your order ID is: {orderId}
          </p>
          <Button asChild>
            <Link to="/customer/purchase-history">View Your Orders</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
