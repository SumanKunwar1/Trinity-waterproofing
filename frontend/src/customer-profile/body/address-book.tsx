import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input"; // Assuming you have an Input component
import { FaCheck, FaTrashAlt } from "react-icons/fa"; // For delete and select default icons
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog"; // Import the Dialog from shadcn

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]); // Define the type of addresses
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [defaultAddress, setDefaultAddress] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false); // For dialog state

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle address submission
  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAddress: Address = { ...formData, id: Date.now() };

    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setFormData({
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    });
    setIsOpen(false); // Close dialog after saving
  };

  // Handle setting default address
  const handleSetDefault = (id: number) => {
    setDefaultAddress(id);
  };

  // Handle delete address
  const handleDeleteAddress = (id: number) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address.id !== id)
    );
  };

  return (
    <div className="p-6">
      {/* Dialog Component wrapping the Trigger and other dialog-related components */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => setIsOpen(true)}
            className="mb-6"
          >
            Add New Address
          </Button>
        </DialogTrigger>

        {/* Address List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`p-4 shadow-lg rounded-lg ${
                  defaultAddress === address.id
                    ? "border-4 border-primary-500"
                    : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{address.street}</h3>
                      <p>
                        {address.city}, {address.state} - {address.zip}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        {defaultAddress === address.id ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          "Set Default"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Dialog for Adding New Address */}
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new address.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" variant="secondary">
                  Save Address
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="mt-2 bg-gray-500 text-white">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};
