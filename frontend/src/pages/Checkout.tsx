import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import AddressCard from "../components/common/AddressCard";

interface Address {
  _id: string;
  street: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
  default: boolean;
}

interface ICartItem {
  productId: string;
  name: string;
  description: string;
  retailPrice: number;
  productImage: string;
  quantity: number;
  color?: {
    name: string;
    hex: string;
  };
  inStock: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const [buyNowItem, setBuyNowItem] = useState<ICartItem | null>(null);
  const { cart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (location.state && location.state.product) {
      setBuyNowItem(location.state.product);
    }
    fetchAddresses();
  }, [location.state]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const response = await fetch(`/api/users/addressBook/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data && Array.isArray(data.addressBook)) {
        setAddresses(data.addressBook);
        const defaultAddress = data.addressBook.find(
          (address: Address) => address.default
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } else {
        console.error("Invalid data structure:", data);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/users/addressBook/default/${userId}/${addressId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to set default address");
      await fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const itemsToDisplay = buyNowItem ? [buyNowItem] : cart;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 md:pr-8">
              <h2 className="text-2xl font-semibold mb-4">Select Address</h2>
              {isLoading ? (
                <p>Loading addresses...</p>
              ) : addresses.length > 0 ? (
                addresses.map(
                  (address) => (
                    console.log("Address:", address),
                    (
                      <AddressCard
                        key={address._id}
                        address={address}
                        onSetDefault={handleSetDefault}
                        isSelected={selectedAddressId === address._id}
                        onSelect={handleSelectAddress}
                      />
                    )
                  )
                )
              ) : (
                <p>No addresses found. Please add an address.</p>
              )}
            </div>
            <div className="w-full md:w-1/3 mt-8 md:mt-0">
              <OrderSummary cartItems={itemsToDisplay} />
              <Button
                type="submit"
                className="w-full mt-4"
                variant="secondary"
                disabled={!selectedAddressId}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
