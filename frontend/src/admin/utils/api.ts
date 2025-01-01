import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reviews API
export const fetchReviews = async () => {
  try {
    const response = await api.get("/review");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const response = await api.delete(`/review/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Orders API
export const fetchOrders = async () => {
  try {
    const response = await api.get("/order/admin");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await api.patch(`/order/admin/${orderId}/confirm`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string, reason: string) => {
  try {
    const response = await api.patch(`/order/admin/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await api.delete(`/order/admin/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const markOrderShipped = async (orderId: string) => {
  try {
    const response = await api.patch(`/order/admin/${orderId}/order-shipped`);
    return response.data;
  } catch (error) {
    console.error("Error marking order as shipped:", error);
    throw error;
  }
};

export const markOrderDelivered = async (orderId: string) => {
  try {
    const response = await api.patch(`/order/admin/${orderId}/order-delivered`);
    return response.data;
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    throw error;
  }
};
