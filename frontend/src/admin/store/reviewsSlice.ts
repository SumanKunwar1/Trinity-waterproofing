import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: Review[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  status: "idle",
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async () => {
    const response = await fetch("/api/review", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return response.json();
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: string) => {
    const response = await fetch(`/api/review/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete review");
    }
    return reviewId;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.status = "succeeded";
          state.reviews = action.payload;
        }
      )
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch reviews";
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      });
  },
});

export default reviewsSlice.reducer;
