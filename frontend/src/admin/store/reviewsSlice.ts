import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReviews, deleteReview } from "../utils/api";
import { Review } from "../../types/review";

export const fetchReviewsAsync = createAsyncThunk(
  "reviews/fetchReviews",
  async () => {
    const response = await fetchReviews();
    return response.data;
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: string) => {
    await deleteReview(reviewId);
    return reviewId;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [] as Review[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsAsync.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      });
  },
});

export default reviewsSlice.reducer;
