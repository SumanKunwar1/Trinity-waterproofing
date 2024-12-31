import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

// Reviews API
export const fetchReviews = async () => {
  const response = await api.get("/review");
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(`/review/${reviewId}`);
  return response.data;
};

// Orders API
export const fetchOrders = async () => {
  const response = await api.get("/order/admin");
  return response.data;
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const response = await api.patch(`/order/admin/${orderId}/confirm`, {
    status: newStatus,
  });
  return response.data;
};

export const cancelOrder = async (orderId: string, reason: string) => {
  const response = await api.patch(`/order/admin/${orderId}/cancel`, {
    reason,
  });
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await api.delete(`/order/admin/${orderId}`);
  return response.data;
};

export const markOrderShipped = async (orderId: string) => {
  const response = await api.patch(`/order/admin/${orderId}/order-shipped`);
  return response.data;
};

export const markOrderDelivered = async (orderId: string) => {
  const response = await api.patch(`/order/admin/${orderId}/order-delivered`);
  return response.data;
};
