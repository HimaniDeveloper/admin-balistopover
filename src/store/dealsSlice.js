import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/api";

const initialState = {
  dealData: null,
  loading: false,
  error: null,
  allDeals: [],
  pagination: {},
};

// Thunks should be defined BEFORE the slice
export const fetchDealData = createAsyncThunk(
  "deals/fetchDealData",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/deals/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const dealsList = createAsyncThunk(
  "deals/list",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, "/api/deals");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addDealData = createAsyncThunk(
  "deals/addDealData",
  async (dealData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, "/api/deals", {
        method: "POST",
        body: JSON.stringify(dealData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateDealData = createAsyncThunk(
  "deals/updateDealData",
  async (dealData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, "/api/deals", {
        method: "PUT",
        body: JSON.stringify(dealData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDealData = createAsyncThunk(
  "deals/deleteDealData",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(dispatch, `/api/deals/${id}`, { method: "DELETE" });
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    resetDeals: (state) => {
      state.allDeals = [];
      state.dealData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // First handle all specific cases
      .addCase(fetchDealData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.dealData = payload;
      })
      .addCase(dealsList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allDeals = payload?.data || [];
        state.pagination = payload.pagination;
      })
      .addCase(addDealData.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data) state.allDeals.push(payload.data);
      })
      .addCase(updateDealData.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data) {
          const index = state.allDeals.findIndex(
            (d) => d._id === payload.data._id
          );
          if (index !== -1) state.allDeals[index] = payload.data;
        }
      })
      .addCase(deleteDealData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allDeals = state.allDeals.filter((deal) => deal._id !== payload);
      })

      // Then handle the generic matchers
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message;
        }
      );
  },
});

export const { resetDeals } = dealsSlice.actions;
export default dealsSlice.reducer;
