import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/api";

const initialState = {
  destinationData: null,
  loading: false,
  error: null,
  allDestinations: [],
  pagination: {},
};

// Fetch single destination data by ID
export const fetchDestinationData = createAsyncThunk(
  "Destinations/fetchDestinationData",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/destination/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch all destinations
export const destinationList = createAsyncThunk(
  "Destinations/destination",
  async (
    { page = 1, limit = 25, search = "" },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await apiRequest(
        dispatch,
        `/api/destination?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return {
        destinations: response?.data?.data || [],
        pagination: response?.data?.pagination || {},
      };
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add new destination
export const addDestinationData = createAsyncThunk(
  "Destinations/addDestinationData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update existing destination
export const updateDestinationData = createAsyncThunk(
  "Destinations/updateDestinationData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/destination`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDestinationData = createAsyncThunk(
  "Destinations/deleteDestinationData",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(dispatch, `/api/destination/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const pagesReducer = createSlice({
  name: "pages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinationData.fulfilled, (state, action) => {
        state.loading = false;
        state.destinationData = action.payload;
      })
      .addCase(fetchDestinationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(addDestinationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDestinationData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addDestinationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateDestinationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDestinationData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDestinationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(destinationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(destinationList.fulfilled, (state, action) => {
        state.loading = false;
        state.allDestinations = action?.payload?.destinations || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(destinationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteDestinationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDestinationData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allDestinations = state.allDestinations.filter(
          (destination) => destination._id !== action.payload
        );
      })
      .addCase(deleteDestinationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default pagesReducer.reducer;
