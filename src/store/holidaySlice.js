import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const initialState = {
  holidayData: null,
  loading: false,
  error: null,
  allHolidays: [],
};

// Fetch single holiday data by ID
export const fetchHolidayData = createAsyncThunk('Holidays/fetchHolidayData', async (id, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/holiday/${id}`, {
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

// Fetch all holidays
export const holidayList = createAsyncThunk('Holidays/holiday', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/holiday`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Add new holiday
export const addHolidayData = createAsyncThunk('Holidays/addHolidayData', async (pageData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/holiday`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Update existing holiday
export const updateHolidayData = createAsyncThunk('Holidays/updateHolidayData', async (pageData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/holiday`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});


export const deleteHolidayData = createAsyncThunk('Holidays/deleteHolidayData', async (id, { dispatch, rejectWithValue }) => {
  try {
     await apiRequest(dispatch, `/api/holiday/${id}`, {
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

const pagesReducer = createSlice({
  name: 'pages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayData.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayData = action.payload;
      })
      .addCase(fetchHolidayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })     
      .addCase(addHolidayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHolidayData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addHolidayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateHolidayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHolidayData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateHolidayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(holidayList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(holidayList.fulfilled, (state, action) => {
        state.loading = false;
        state.allHolidays = action.payload;
      })
      .addCase(holidayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteHolidayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHolidayData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allHolidays = state.allHolidays.filter(holiday => holiday._id !== action.payload);
      })
      .addCase(deleteHolidayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default pagesReducer.reducer;
