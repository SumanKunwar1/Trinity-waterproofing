import { OrderItem } from "../types/order";

export const createOrder = async (
  orderData: OrderItem[],
  addressId: string
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") || "");
    // console.log("orderData", orderData);
    const response = await fetch(`/api/order/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ products: orderData, addressId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();
    // console.log(data);
    return { success: true, orderId: data._id };
  } catch (error: any) {
    // Type assertion for error
    // console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};
