import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Return Requested"
    | "Return Approved"
    | "Return Disapproved";
  total: number;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

interface OrdersState {
  orders: Order[];
  latestOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  latestOrder: null,
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await fetch("/api/order/admin", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
});

console.log("fetchOrders", fetchOrders);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({
    orderId,
    newStatus,
  }: {
    orderId: string;
    newStatus: Order["status"];
  }) => {
    const response = await fetch(`/api/order/admin/${orderId}/confirm`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      throw new Error("Failed to update order status");
    }
    return { orderId, newStatus };
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, reason }: { orderId: string; reason: string }) => {
    const response = await fetch(`/api/order/admin/${orderId}/cancel`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }
    return orderId;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
          state.latestOrder = action.payload[0] || null;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, newStatus } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderId = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = "Cancelled";
        }
      });
  },
});

export default ordersSlice.reducer;
