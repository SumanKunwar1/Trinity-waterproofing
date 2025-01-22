import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import AddressCard from "../components/common/AddressCard";
import type { Address } from "../types/address";
import { createOrder } from "../api/orderApi";
import type { OrderItem } from "../types/order";
import OrderStatusDialog from "../components/cart/OrderStatusDialog";

const Checkout: React.FC = () => {
  const location = useLocation();
  const { cart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{
    success: boolean;
    orderId?: string;
    error?: string;
  } | null>(null);

  // Checkout data: If it's from direct buy now, it will be passed via location state; otherwise, fallback to cart.
  const checkoutData = location.state?.checkoutData || cart;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const userIdString = localStorage.getItem("userId");
      if (!userIdString) {
        throw new Error("User ID not found in localStorage");
      }
      const userId = JSON.parse(userIdString);

      const response = await fetch(`/api/users/addressBook/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch addresses");
      }

      const data = await response.json();

      if (data && Array.isArray(data.addressBook)) {
        setAddresses(data.addressBook);
        const defaultAddress = data.addressBook.find(
          (address: Address) => address.default
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } else {
        setAddresses([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load addresses");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const userIdString = localStorage.getItem("userId");
      if (!userIdString) {
        throw new Error("User ID not found in localStorage");
      }
      const userId = JSON.parse(userIdString);

      const response = await fetch(
        `/api/users/addressBook/default/${userId}/${addressId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to set default address");
      }
      await fetchAddresses();
      toast.success("Default address updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to set default address");
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData: OrderItem[] = checkoutData.map((item: any) => {
        const productId = item.product?._id || item.productId;
        if (!productId) {
          throw new Error(
            `Invalid product ID for item: ${JSON.stringify(item)}`
          );
        }

        return {
          productId,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.price,
        };
      });

      if (orderData.length === 0) {
        throw new Error("No valid items to order");
      }

      const response = await createOrder(orderData, selectedAddressId);

      if (response.success && response.orderId) {
        setOrderStatus({ success: true, orderId: response.orderId });
      } else {
        setOrderStatus({
          success: false,
          error: response.error || "Failed to create order",
        });
      }
    } catch (error: any) {
      setOrderStatus({
        success: false,
        error: error.message || "Failed to place order",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-semibold mb-4">Select Address</h2>
              {isLoading ? (
                <p>Loading addresses...</p>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      onSetDefault={handleSetDefault}
                      isSelected={selectedAddressId === address._id}
                      onSelect={handleSelectAddress}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found.</p>
                  <Link to="/customer/address-book">
                    <Button variant="outline">Add New Address</Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <div className="sticky top-4">
                <OrderSummary cartItems={checkoutData} />
                <Button
                  type="button"
                  className="w-full mt-4"
                  variant="secondary"
                  disabled={!selectedAddressId || isSubmitting}
                  onClick={handlePlaceOrder}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {orderStatus && (
        <OrderStatusDialog
          success={orderStatus.success}
          orderId={orderStatus.orderId}
          error={orderStatus.error}
        />
      )}
    </div>
  );
};

export default Checkout;
