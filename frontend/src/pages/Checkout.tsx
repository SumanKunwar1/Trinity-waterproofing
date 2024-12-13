import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import OrderSummary from "../components/cart/OrderSummary";
import { useCart } from "../hooks/useCart";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CartItem } from "../types/cart";

const checkoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("ZIP code is required"),
});

const Checkout: React.FC = () => {
  const location = useLocation();
  const [buyNowItems, setBuyNowItems] = useState<CartItem[]>([]);
  const { cartItems } = useCart();

  useEffect(() => {
    // Check if there's state passed from Buy Now action
    if (location.state) {
      const { product, selectedVariants, quantity, price } = location.state;

      // Create a CartItem from the buy now product
      const buyNowCartItem: CartItem = {
        ...product,
        selectedVariants,
        quantity,
        price,
        variantKey: Object.keys(selectedVariants)
          .map((key) => `${key}:${selectedVariants[key]}`)
          .join("|"),
      };

      setBuyNowItems([buyNowCartItem]);
    }
  }, [location.state]);

  const handleSubmit = (values: any) => {
    console.log("Checkout values:", values);
    // Implement checkout logic here
  };

  // Determine which items to show in OrderSummary
  const itemsToDisplay = buyNowItems.length > 0 ? buyNowItems : cartItems;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 md:pr-8">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
            }}
            validationSchema={checkoutSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Input label="First Name" name="firstName" type="text" />
                  <Input label="Last Name" name="lastName" type="text" />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    country="np" // Default country Nepal
                    value={""}
                    onChange={(phone) => setFieldValue("phone", phone)}
                    inputClass={`${
                      errors.phone && touched.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    containerStyle={{ width: "100%" }}
                    inputStyle={{
                      width: "100%",
                      paddingLeft: "70px",
                      fontSize: "16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                    }}
                    buttonStyle={{
                      padding: "0 12px",
                      borderRight: "1px solid #d1d5db",
                    }}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <Input label="Email" name="email" type="email" />
                <Input label="Address" name="address" type="text" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Input label="City" name="city" type="text" />
                  <Input label="State" name="state" type="text" />
                  <Input label="ZIP Code" name="zipCode" type="text" />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Place Order
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <OrderSummary
            cartItems={itemsToDisplay}
            variantDetails={itemsToDisplay.map((item) => item.selectedVariants)}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
