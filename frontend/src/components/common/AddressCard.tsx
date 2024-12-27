import React from "react";
import { Button } from "../ui/button";
import { Address } from "../../types/address";
interface AddressCardProps {
  address: Address;
  onSetDefault: (addressId: string) => void;
  isSelected: boolean;
  onSelect: (addressId: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSetDefault,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 mb-4 ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{address.country}</h3>
        <input
          type="radio"
          checked={isSelected}
          onChange={() => onSelect(address._id)}
          className="form-radio h-5 w-5 text-blue-600"
        />
      </div>
      <p className="text-gray-600 mb-1">{address.province}</p>
      <p className="text-gray-600 mb-1">{address.street}</p>
      {address.district && (
        <p className="text-gray-600 mb-1">{address.district}</p>
      )}
      <p className="text-gray-600 mb-1">{`${address.city}, ${address.street} ${address.postalCode}`}</p>
      <p className="text-gray-600 mb-1">{address.country}</p>
      {address.default ? (
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mt-2">
          Default Address
        </span>
      ) : (
        <Button
          onClick={() => onSetDefault(address._id)}
          className="mt-4"
          variant="outline"
        >
          Set as Default
        </Button>
      )}
    </div>
  );
};

export default AddressCard;
