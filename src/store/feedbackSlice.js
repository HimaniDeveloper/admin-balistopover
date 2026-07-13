import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const initialState = {
  feedbackData: null,
  loading: false,
  error: null,
  feedbacks: [],
  pagination: {},
};

// Fetch single feedback data by ID
export const fetchFeedbackData = createAsyncThunk('FeedbackPages/fetchFeedbackData', async (routPath, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/feedback/${routPath}`, {
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

// Fetch all feedbacks
export const feedbackList = createAsyncThunk(
  'FeedbackPages/feedback',
  async ({ page = 1, limit = 6 }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/feedback?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        feedbacks: response?.data?.data || [],
        pagination: response?.data?.pagination || {},
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add new feedback
export const addFeedbackData = createAsyncThunk('FeedbackPages/addFeedbackData', async (pageData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/feedback`, {
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

// Update existing feedback
export const updateFeedbackData = createAsyncThunk('FeedbackPages/updateFeedbackData', async (pageData, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/feedback`, {
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


export const deleteFeedbackData = createAsyncThunk('FeedbackPages/deleteFeedbackData', async (routPath, { dispatch, rejectWithValue }) => {
  try {
     await apiRequest(dispatch, `/api/feedback/${routPath}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return routPath;
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
      .addCase(fetchFeedbackData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackData.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackData = action.payload;
      })
      .addCase(fetchFeedbackData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })     
      .addCase(addFeedbackData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedbackData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFeedbackData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateFeedbackData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedbackData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateFeedbackData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(feedbackList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(feedbackList.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action?.payload?.feedbacks || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(feedbackList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteFeedbackData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedbackData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.feedbacks = state.feedbacks.filter(feedback => feedback.routPath !== action.payload);
      })
      .addCase(deleteFeedbackData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default pagesReducer.reducer;
