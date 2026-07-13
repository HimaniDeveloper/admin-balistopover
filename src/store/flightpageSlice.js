import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/api";

const initialState = {
  flightPageData: null,
  loading: false,
  error: null,
  airlines: [],
  allPages: [],
};

export const fetchFlightPageData = createAsyncThunk(
  "flightPages/fetchFlightPageData",
  async (routPath, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(
        dispatch,
        `/api/flightpage/${routPath}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const flightPages = createAsyncThunk(
  "flightPages/flightpage",
  async ({ page, limit, search = "" }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(
        dispatch,
        `/api/flightpage?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addFlightPageData = createAsyncThunk(
  "flightPages/addFlightPageData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/flightpage`, {
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

export const updateFlightPageData = createAsyncThunk(
  "flightPages/updateFlightPageData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/flightpage`, {
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

export const fetchAirlineData = createAsyncThunk(
  "flightPages/airlineData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/airline`, {
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

export const deleteFlightPage = createAsyncThunk(
  "flightPages/deleteFlightPage",
  async (rout, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(dispatch, `/api/flightpage/${rout}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return rout;
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
      .addCase(fetchFlightPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.flightPageData = null;
      })
      .addCase(fetchFlightPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.flightPageData = action.payload;
      })
      .addCase(fetchFlightPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFlightPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFlightPageData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFlightPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFlightPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlightPageData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateFlightPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAirlineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirlineData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.airlines = action.payload;
      })
      .addCase(fetchAirlineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(flightPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(flightPages.fulfilled, (state, action) => {
        state.loading = false;
        state.allPages = action.payload;
      })
      .addCase(flightPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFlightPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlightPage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allPages = state.allPages.filter(
          (p) => p.rout !== action.payload
        );
      })
      .addCase(deleteFlightPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default pagesReducer.reducer;
