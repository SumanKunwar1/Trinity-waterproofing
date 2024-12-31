import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  markOrderShipped,
  markOrderDelivered,
} from "../utils/api";

// Types
interface Order {
  id: string;
  status: string;
  [key: string]: any;
}

interface OrdersState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial State
const initialState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
};

// Async Thunks with proper typings
export const fetchOrdersAsync = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchOrders();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const updateOrderStatusAsync = createAsyncThunk<
  Order,
  { orderId: string; newStatus: string },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

export const cancelOrderAsync = createAsyncThunk<
  Order,
  { orderId: string; reason: string },
  { rejectValue: string }
>("order/cancelOrder", async ({ orderId, reason }, { rejectWithValue }) => {
  try {
    const response = await cancelOrder(orderId, reason);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to cancel order"
    );
  }
});

export const deleteOrderAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("order/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    await deleteOrder(orderId);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete order"
    );
  }
});

export const markOrderShippedAsync = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/markOrderShipped", async (orderId, { rejectWithValue }) => {
  try {
    const response = await markOrderShipped(orderId);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark order as shipped"
    );
  }
});

export const markOrderDeliveredAsync = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/markOrderDelivered", async (orderId, { rejectWithValue }) => {
  try {
    const response = await markOrderDelivered(orderId);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to mark order as delivered"
    );
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrdersAsync.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(
        updateOrderStatusAsync.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      })
      .addCase(
        cancelOrderAsync.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to cancel order";
      })
      .addCase(
        deleteOrderAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload
          );
          state.error = null;
        }
      )
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete order";
      })
      .addCase(
        markOrderShippedAsync.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(markOrderShippedAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark order as shipped";
      })
      .addCase(
        markOrderDeliveredAsync.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(markOrderDeliveredAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark order as delivered";
      });
  },
});

export default ordersSlice.reducer;
