"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCheck,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<Omit<Address, "_id">>({
    street: "",
    city: "",
    province: "",
    district: "",
    postalCode: "",
    country: "",
    default: false,
  });
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses().catch((error) => {
      console.error("Error in useEffect:", error);
      toast.error("Failed to load addresses");
    });
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(`/api/users/addressBook/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add address");
      await fetchAddresses();
      resetForm();
      setIsAddEditOpen(false);
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
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

  const handleDeleteAddress = async (addressId: string) => {
    setAddressToDelete(addressId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/users/addressBook/${userId}/${addressToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");
      await fetchAddresses();
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      street: address.street,
      city: address.city,
      province: address.province,
      district: address.district,
      postalCode: address.postalCode,
      country: address.country,
      default: address.default,
    });
    setIsEditing(true);
    setSelectedAddress(address);
    setIsAddEditOpen(true);
  };

  const handleUpdateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAddress) return;
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/users/addressBook/${userId}/${selectedAddress._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to update address");
      await fetchAddresses();
      resetForm();
      setIsAddEditOpen(false);
      toast.success("Address updated successfully");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  const handleViewDetails = (address: Address) => {
    setSelectedAddress(address);
    setIsDetailsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      street: "",
      city: "",
      province: "",
      district: "",
      postalCode: "",
      country: "",
      default: false,
    });
    setIsEditing(false);
    setSelectedAddress(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Address Book</h1>
      <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              setIsAddEditOpen(true);
            }}
            className="mb-6"
          >
            <FaPlus className="mr-2" /> Add New Address
          </Button>
        </DialogTrigger>

        <div className="space-y-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading addresses...</p>
          ) : addresses.length > 0 ? (
            <AnimatePresence>
              {addresses.map((address) => (
                <motion.div
                  key={address._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AddressCard
                    address={address}
                    isDefault={address.default}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDeleteAddress}
                    onEdit={handleEditAddress}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No addresses added yet. Click "Add New Address" to get started.
            </p>
          )}
        </div>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the address details below."
                : "Fill out the form below to add a new address to your address book."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={isEditing ? handleUpdateAddress : handleAddAddress}
            className="space-y-4"
          >
            <AddressFormField
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="Province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="District"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update Address" : "Save Address"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Address Details</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <div className="mt-4">
              <p>
                <strong>Street:</strong> {selectedAddress.street}
              </p>
              <p>
                <strong>City:</strong> {selectedAddress.city}
              </p>
              <p>
                <strong>Province:</strong> {selectedAddress.province}
              </p>
              <p>
                <strong>District:</strong> {selectedAddress.district}
              </p>
              <p>
                <strong>Postal Code:</strong> {selectedAddress.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {selectedAddress.country}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={confirmDeleteAddress} variant="destructive">
              Delete
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (address: Address) => void;
  onViewDetails: (address: Address) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isDefault,
  onSetDefault,
  onDelete,
  onEdit,
  onViewDetails,
}) => (
  <Card
    className={`overflow-hidden ${isDefault ? "ring-2 ring-blue-500" : ""}`}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            {address.street}
          </h3>
          <p className="text-gray-600">
            {address.city}, {address.province} {address.postalCode}
          </p>
          <p className="text-gray-600">{address.country}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isDefault ? "default" : "outline"}
            size="sm"
            onClick={() => onSetDefault(address._id)}
          >
            {isDefault ? (
              <>
                <FaCheck className="mr-1" /> Default
              </>
            ) : (
              "Set Default"
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
            <FaEdit className="text-blue-500" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(address._id)}
          >
            <FaTrashAlt className="text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(address)}
          >
            View Details
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AddressFormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressFormField: React.FC<AddressFormFieldProps> = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);
