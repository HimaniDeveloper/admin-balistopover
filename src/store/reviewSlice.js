import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const initialState = {
  reviewData: null,
  loading: false,
  error: null,
  reviews: [],
  pagination: {},
};

// Fetch single review data by ID
export const fetchReviewData = createAsyncThunk(
  'reviews/fetchReviewData', 
  async (reviewId, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/reviews/${reviewId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch all reviews with pagination
export const reviewList = createAsyncThunk(
  'reviews/reviewList',
  async ({ page = 1, limit = 10 }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/reviews?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        reviews: response?.data?.data || [],
        pagination: response?.data?.pagination || {},
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add new review
export const addReviewData = createAsyncThunk(
  'reviews/addReviewData',
  async (reviewData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, '/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          date: reviewData.date.toISOString() // Convert Date to string
        }),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update existing review
export const updateReviewData = createAsyncThunk(
  'reviews/updateReviewData',
  async (reviewData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/reviews`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          date: reviewData.date.toISOString() // Convert Date to string
        }),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete review
export const deleteReviewData = createAsyncThunk(
  'reviews/deleteReviewData',
  async (reviewId, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(dispatch, `/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch single review
      .addCase(fetchReviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = action.payload;
      })
      .addCase(fetchReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      // Add review
      .addCase(addReviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReviewData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      // Update review
      .addCase(updateReviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      // Fetch review list
      .addCase(reviewList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewList.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
      })
      .addCase(reviewList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      // Delete review
      .addCase(deleteReviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
      })
      .addCase(deleteReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default reviewSlice.reducer;