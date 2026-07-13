import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const initialState = {
  placeData: null,
  loading: false,
  error: null,
  allPlaces: [],
};

// Fetch flight destination by routPath
export const fetchPlaceByRoutPath = createAsyncThunk('PopuplarPlaces/fetchPlaceByRoutPath', async (routPath, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/popularplaces/${routPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchPlaceById = createAsyncThunk('PopuplarPlaces/fetchPlaceById', async ({ routPath, id }, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/popularplaces/${routPath}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});


// Add new flight place
export const addPlaceData = createAsyncThunk('PopuplarPlaces/addPlaceData', async (placeData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/popularplaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Update flight place by ID
export const updatePlaceData = createAsyncThunk('PopuplarPlaces/updatePlaceData', async (placeData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/popularplaces`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Delete flight place by ID
export const deletePlaceData = createAsyncThunk('PopuplarPlaces/deletePlaceData', async (id, { dispatch, rejectWithValue }) => {
  try {
     await apiRequest(dispatch, `/api/popularplaces/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const popuplarPlacesReducer = createSlice({
  name: 'PopuplarPlaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceByRoutPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceByRoutPath.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlaces = action.payload;
      })
      .addCase(fetchPlaceByRoutPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchPlaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.placeData = action.payload;
      })
      .addCase(fetchPlaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(addPlaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlaceData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addPlaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updatePlaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaceData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePlaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deletePlaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaceData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allPlaces = state.allPlaces.filter(place => place._id !== action.payload);
      })
      .addCase(deletePlaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default popuplarPlacesReducer.reducer;
