"use client";

import { useState } from "react";
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

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

// Dummy data for addresses
const dummyAddresses: Address[] = [
  {
    id: 1,
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    phone: "555-123-4567",
  },
  {
    id: 2,
    street: "456 Elm St",
    city: "Springfield",
    state: "IL",
    zip: "67890",
    phone: "555-987-6543",
  },
  {
    id: 3,
    street: "789 Oak Ave",
    city: "Riverdale",
    state: "NY",
    zip: "10001",
    phone: "555-246-8135",
  },
];

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddresses);
  const [formData, setFormData] = useState<Address>({
    id: 0,
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [defaultAddress, setDefaultAddress] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => (addr.id === formData.id ? formData : addr))
      );
      setIsEditing(false);
    } else {
      const newAddress: Address = { ...formData, id: Date.now() };
      setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    }
    setFormData({ id: 0, street: "", city: "", state: "", zip: "", phone: "" });
    setIsOpen(false);
  };

  const handleSetDefault = (id: number) => {
    setDefaultAddress(id);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address.id !== id)
    );
    if (defaultAddress === id) {
      setDefaultAddress(null);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData(address);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleViewDetails = (address: Address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Address Book</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => {
              setIsEditing(false);
              setFormData({
                id: 0,
                street: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
              });
              setIsOpen(true);
            }}
            className="mb-6"
          >
            <FaPlus className="mr-2" /> Add New Address
          </Button>
        </DialogTrigger>

        <div className="space-y-6">
          <AnimatePresence>
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AddressCard
                  address={address}
                  isDefault={defaultAddress === address.id}
                  onSetDefault={handleSetDefault}
                  onDelete={handleDeleteAddress}
                  onEdit={handleEditAddress}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {addresses.length === 0 && (
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
          <form onSubmit={handleAddAddress} className="space-y-4">
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
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="Zip Code"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
            />
            <AddressFormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update Address" : "Save Address"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedAddress}
        onOpenChange={(open) => !open && setSelectedAddress(null)}
      >
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
                <strong>State:</strong> {selectedAddress.state}
              </p>
              <p>
                <strong>Zip Code:</strong> {selectedAddress.zip}
              </p>
              <p>
                <strong>Phone:</strong> {selectedAddress.phone}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedAddress(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onSetDefault: (id: number) => void;
  onDelete: (id: number) => void;
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
            {address.city}, {address.state} {address.zip}
          </p>
          <p className="text-gray-600">{address.phone}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isDefault ? "default" : "outline"}
            size="sm"
            onClick={() => onSetDefault(address.id)}
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
            onClick={() => onDelete(address.id)}
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
