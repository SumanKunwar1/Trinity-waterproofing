import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const fetchProducts = async () => {
  try {
    const response = await api.get("/product");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api.get("/order/admin");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchSubcategories = async () => {
  try {
    const response = await api.get("/subcategory");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
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

export const submitReturnRequest = async (orderId: string) => {
  try {
    const response = await api.patch(`/return-request/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error submitting return request:", error);
    throw error;
  }
};

export const submitCancelRequest = async (orderId: string, reason: string) => {
  try {
    const response = await api.delete(`/cancel/${orderId}`, {
      data: { reason },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting cancel request:", error);
    throw error;
  }
};

export const approveReturn = async (orderId: string) => {
  try {
    const response = await api.patch(`/admin/${orderId}/approve-return`);
    return response.data;
  } catch (error) {
    console.error("Error approving return:", error);
    throw error;
  }
};

export const disapproveReturn = async (orderId: string, reason: string) => {
  try {
    const response = await api.patch(`/admin/${orderId}/disapprove-return`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Error disapproving return:", error);
    throw error;
  }
};

// Gallery-related functions
export const getFolders = async () => {
  try {
    const response = await api.get("/gallery");
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

export const getFiles = async (folderName: string) => {
  try {
    const response = await api.get(`/gallery/images/${folderName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const createFolder = async (folderName: string) => {
  try {
    const response = await api.post("/gallery/create-folder", { folderName });
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const uploadImage = async (folderName: string, files: File[]) => {
  try {
    const formData = new FormData();
    formData.append("folderName", folderName);
    files.forEach((file) => {
      formData.append("image", file);
    });
    const response = await api.post("/gallery/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const renameFolder = async (
  oldFolderName: string,
  newFolderName: string
) => {
  try {
    const response = await api.patch(`/gallery/${oldFolderName}`, {
      newFolderName,
    });
    return response.data;
  } catch (error) {
    console.error("Error renaming folder:", error);
    throw error;
  }
};

export const deleteFolder = async (folderName: string) => {
  try {
    const response = await api.delete("/gallery/folder", {
      data: { folderName },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export const deleteFiles = async (folderName: string, files: string[]) => {
  try {
    const response = await api.delete("/gallery/files", {
      data: { folderName, files: files.map((file) => file.split("/").pop()) },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
};
