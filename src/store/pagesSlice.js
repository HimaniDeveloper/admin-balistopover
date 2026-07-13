import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const initialState = {
  pageData: null,
  loading: false,
  allPages: [],
  error: null,
};


export const fetchPageData = createAsyncThunk('pages/fetchPageData', async (slug, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/pages/${slug}`, {
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

export const updatePageData = createAsyncThunk('pages/updatePageData', async ({ pageData }, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/pages`, {
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

export const fetchAllPages = createAsyncThunk('pages/fetchAllPages', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await apiRequest(dispatch, `/api/pages`, {
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

const pagesReducer = createSlice({
  name: 'pages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.pageData = action.payload;
      })
      .addCase(fetchPageData.rejected, (state, action) => {
        state.loading = true;
        state.error = null;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPages.fulfilled, (state, action) => {
        state.loading = false;
        state.allPages = action.payload;
      })
      .addCase(fetchAllPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePageData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pagesReducer.reducer;
