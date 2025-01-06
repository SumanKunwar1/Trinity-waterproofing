import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/faq";

// Define the FAQ interface
interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FaqState {
  faqs: Faq[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FaqState = {
  faqs: [],
  isLoading: false,
  error: null,
};

// Helper function to get the authorization token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Adjust this according to your token storage
};

// Set up Axios default headers with authorization token
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Fetch FAQs
export const fetchFaqsAsync = createAsyncThunk(
  "faqs/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch FAQs"
      );
    }
  }
);

// Create FAQ
export const createFaqAsync = createAsyncThunk(
  "faqs/createFaq",
  async (faq: Omit<Faq, "_id">, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}`, faq);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create FAQ"
      );
    }
  }
);

// Edit FAQ
export const editFaqAsync = createAsyncThunk(
  "faqs/editFaq",
  async (faq: Faq, { rejectWithValue }) => {
    try {
      console.log("faq to be edited", faq);
      const response = await axiosInstance.patch(`${API_URL}/${faq._id}`, {
        question: faq.question,
        answer: faq.answer,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit FAQ"
      );
    }
  }
);

// Delete FAQ
export const deleteFaqAsync = createAsyncThunk(
  "faqs/deleteFaq",
  async (faqId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_URL}/${faqId}`);
      return faqId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete FAQ"
      );
    }
  }
);

const faqSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaqsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createFaqAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFaqAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs.push(action.payload); // Add new FAQ to the list
      })
      .addCase(createFaqAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(editFaqAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editFaqAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs = state.faqs.map((faq) =>
          faq._id === action.payload._id ? action.payload : faq
        );
      })
      .addCase(editFaqAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFaqAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFaqAsync.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
      })
      .addCase(deleteFaqAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default faqSlice.reducer;
