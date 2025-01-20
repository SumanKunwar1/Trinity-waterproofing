import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import AddressCard from "../components/common/AddressCard";
import { Address } from "../types/address";
import { createOrder } from "../api/orderApi";
import { OrderItem } from "../types/order";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout data: If it's from direct buy now, it will be passed via location state; otherwise, fallback to cart.
  const checkoutData = location.state?.checkoutData || cart;
  // console.log("checkoutData", checkoutData);
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
        // console.error("Invalid data structure:", data);
        setAddresses([]);
      }
    } catch (error: any) {
      // console.error("Error fetching addresses:", error);
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
      // console.error("Error setting default address:", error);
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
        const productId = item.product?._id || item.productId; // Normalize productId
        if (!productId) {
          throw new Error(
            `Invalid product ID for item: ${JSON.stringify(item)}`
          );
        }

        // Build the order data for placing an order
        return {
          productId,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.price,
        };
      });
      // console.log("orderData in checkout", orderData);

      if (orderData.length === 0) {
        throw new Error("No valid items to order");
      }

      // console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Debugging

      // Call the API to create an order
      const response = await createOrder(orderData, selectedAddressId);

      if (response.success && response.orderId) {
        navigate("/order-success", { state: { orderId: response.orderId } });
      } else {
        navigate("/order-failure", {
          state: { error: response.error || "Failed to create order" },
        });
      }
    } catch (error: any) {
      // console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
      navigate("/order-failure", {
        state: { error: error.message || "Failed to place order" },
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
    </div>
  );
};

export default Checkout;
