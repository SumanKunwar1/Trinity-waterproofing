import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReviews, deleteReview } from "../utils/api";
import { Review } from "../../types/review";

export const fetchReviewsAsync = createAsyncThunk(
  "review/fetchReviews",
  async () => {
    const response = await fetchReviews();
    return response;
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "review/deleteReview",
  async (reviewId: string) => {
    await deleteReview(reviewId);
    return reviewId;
  }
);

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
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
      .addCase(fetchReviewsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      });
  },
});

export default reviewsSlice.reducer;
