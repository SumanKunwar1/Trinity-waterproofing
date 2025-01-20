import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  success: false,
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (productData: FormData, { rejectWithValue }) => {
    console.log("Creating product with data:", Object.fromEntries(productData));
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: productData,
      });

      console.log("Create product response status:", response.status);
      const data = await response.json();
      console.log("Create product response data:", data);

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to create product");
      }

      return data;
    } catch (error) {
      console.error("Error in createProduct:", error);
      return rejectWithValue("An error occurred while creating the product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    { id, productData }: { id: string; productData: any },
    { rejectWithValue }
  ) => {
    console.log("Updating product with ID:", id);
    console.log("Product data:", productData);
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("Update response status:", response.status);
      const data = await response.json();
      console.log("Update response data:", data);

      if (!response.ok) {
        console.error("Error updating product:", data);
        return rejectWithValue(data.error || "Failed to update product");
      }

      return data;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      return rejectWithValue("An error occurred while updating the product");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetProductState } = productSlice.actions;

export default productSlice.reducer;
