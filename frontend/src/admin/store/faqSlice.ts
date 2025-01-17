import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/faq";

// Define the FAQ interface
export interface Faq {
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
export const fetchFaqsAsync = createAsyncThunk<
  Faq[],
  void,
  { rejectValue: string }
>("faqs/fetchFaqs", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Faq[]>(`${API_URL}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch FAQs"
    );
  }
});

// Create FAQ
export const createFaqAsync = createAsyncThunk<
  Faq,
  Omit<Faq, "_id">,
  { rejectValue: string }
>("faqs/createFaq", async (faq, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Faq>(`${API_URL}`, faq);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create FAQ"
    );
  }
});

// Edit FAQ
export const editFaqAsync = createAsyncThunk<Faq, Faq, { rejectValue: string }>(
  "faqs/editFaq",
  async (faq, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<Faq>(`${API_URL}/${faq._id}`, {
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
export const deleteFaqAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("faqs/deleteFaq", async (faqId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`${API_URL}/${faqId}`);
    return faqId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete FAQ"
    );
  }
});

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
      .addCase(
        fetchFaqsAsync.fulfilled,
        (state, action: PayloadAction<Faq[]>) => {
          state.isLoading = false;
          state.faqs = action.payload;
        }
      )
      .addCase(fetchFaqsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(createFaqAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createFaqAsync.fulfilled,
        (state, action: PayloadAction<Faq>) => {
          state.isLoading = false;
          state.faqs.push(action.payload);
        }
      )
      .addCase(createFaqAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(editFaqAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editFaqAsync.fulfilled, (state, action: PayloadAction<Faq>) => {
        state.isLoading = false;
        state.faqs = state.faqs.map((faq) =>
          faq._id === action.payload._id ? action.payload : faq
        );
      })
      .addCase(editFaqAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(deleteFaqAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteFaqAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
        }
      )
      .addCase(deleteFaqAsync.rejected, (state, action) => {
        state.error = action.payload ?? "An error occurred";
      });
  },
});

export default faqSlice.reducer;
