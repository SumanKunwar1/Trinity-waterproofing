import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the base URL for your API
const API_URL = "/api/newsletter";

// Define the initial state
interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
}

interface NewslettersState {
  newsletters: Newsletter[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NewslettersState = {
  newsletters: [],
  isLoading: false,
  error: null,
};

// Function to include authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Async thunk for fetching newsletters
export const fetchNewslettersAsync = createAsyncThunk(
  "newsletters/fetchNewsletters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, getAuthHeaders());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch newsletters"
      );
    }
  }
);

// Async thunk for deleting a newsletter
export const deleteNewsletterAsync = createAsyncThunk(
  "newsletters/deleteNewsletter",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete newsletter"
      );
    }
  }
);

// Create the slice
const newslettersSlice = createSlice({
  name: "newsletters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch newsletters
      .addCase(fetchNewslettersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNewslettersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsletters = action.payload;
      })
      .addCase(fetchNewslettersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete newsletter
      .addCase(deleteNewsletterAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteNewsletterAsync.fulfilled, (state, action) => {
        state.newsletters = state.newsletters.filter(
          (newsletter) => newsletter._id !== action.payload
        );
      })
      .addCase(deleteNewsletterAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default newslettersSlice.reducer;
