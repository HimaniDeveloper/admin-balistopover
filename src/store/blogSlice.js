import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/api";

const initialState = {
  blogData: null,
  loading: false,
  error: null,
  blogs: [],
  pagination: {},
};

// Fetch single blog data by ID
export const fetchBlogData = createAsyncThunk(
  "BlogPages/fetchBlogData",
  async (routPath, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/blog/${routPath}`, {
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

// Fetch all blogs
export const blogList = createAsyncThunk(
  'BlogPages/blog',
  async (
    { page = 1, limit = 25, search = "" },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await apiRequest(
        dispatch,
        `/api/blog?page=${page}&limit=${limit}&search=${encodeURIComponent(
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
        blogs: response?.data?.data || [],
        pagination: response?.data?.pagination || {},
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add new blog
export const addBlogData = createAsyncThunk(
  "BlogPages/addBlogData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/blog`, {
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

// Update existing blog
export const updateBlogData = createAsyncThunk(
  "BlogPages/updateBlogData",
  async (pageData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiRequest(dispatch, `/api/blog`, {
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

export const deleteBlogData = createAsyncThunk(
  "BlogPages/deleteBlogData",
  async (routPath, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(dispatch, `/api/blog/${routPath}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return routPath;
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
      .addCase(fetchBlogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogData.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = action.payload;
      })
      .addCase(fetchBlogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(addBlogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlogData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addBlogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateBlogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogData.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBlogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(blogList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blogList.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action?.payload?.blogs || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(blogList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteBlogData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogs = state.blogs.filter(
          (blog) => blog.routPath !== action.payload
        );
      })
      .addCase(deleteBlogData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default pagesReducer.reducer;
