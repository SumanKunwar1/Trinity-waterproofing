import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchReviews, deleteReview } from "../utils/api";

export interface Review {
  _id: string;
  fullName: string;
  number: string;
  image: string[];
  content: string;
  rating: number;
  user: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  productName: string;
}

export interface Product {
  _id: string;
  name: string;
  review: Review[];
}

export const fetchReviewsAsync = createAsyncThunk<Product[]>(
  "review/fetchReviews",
  async () => {
    const response = await fetchReviews();
    return response;
  }
);

export const deleteReviewAsync = createAsyncThunk<string, string>(
  "review/deleteReview",
  async (reviewId: string) => {
    await deleteReview(reviewId);
    return reviewId;
  }
);

interface ReviewsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  products: [],
  isLoading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchReviewsAsync.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchReviewsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(
        deleteReviewAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.map((product) => ({
            ...product,
            review: product.review.filter(
              (review) => review._id !== action.payload
            ),
          }));
        }
      );
  },
});

export default reviewsSlice.reducer;
