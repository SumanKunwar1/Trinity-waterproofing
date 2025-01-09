import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ICompanyDetail {
  name: string;
  description: string;
  phoneNumber: string;
  location: string;
  email: string;
  twitter?: string;
  facebook?: string;
  google_plus?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
}

interface CompanyDetailsState {
  data: ICompanyDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyDetailsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchCompanyDetails = createAsyncThunk(
  "companyDetails/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/company-detail");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error("Failed to fetch company details");
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompanyDetails = createAsyncThunk(
  "companyDetails/update",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const companyDetails: Partial<ICompanyDetail> = {};
      for (let [key, value] of formData.entries()) {
        companyDetails[key as keyof ICompanyDetail] = value as string;
      }

      console.log("Submitting values:", companyDetails);

      const response = await fetch("/api/company-detail", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(companyDetails),
      });

      console.log("Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      toast.success("Company details updated successfully");
      return data;
    } catch (error: any) {
      toast.error(`Failed to update company details: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const companyDetailsSlice = createSlice({
  name: "companyDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companyDetailsSlice.reducer;
