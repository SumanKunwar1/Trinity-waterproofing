import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface AddressFormData {
  street: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
}

const addressSchema = yup.object().shape({
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  province: yup.string().required("Province is required"),
  district: yup.string().required("District is required"),
  postalCode: yup.string().required("Postal code is required"),
  country: yup.string().required("Country is required"),
});

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  initialData?: AddressFormData;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="street">Street</Label>
        <Input id="street" {...register("street")} />
        {errors.street && (
          <p className="text-red-500 text-sm">{errors.street.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city")} />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="province">Province</Label>
        <Input id="province" {...register("province")} />
        {errors.province && (
          <p className="text-red-500 text-sm">{errors.province.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="district">District</Label>
        <Input id="district" {...register("district")} />
        {errors.district && (
          <p className="text-red-500 text-sm">{errors.district.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input id="postalCode" {...register("postalCode")} />
        {errors.postalCode && (
          <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" {...register("country")} />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        Save Address
      </Button>
    </form>
  );
};
