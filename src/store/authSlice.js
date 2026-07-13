import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, authApiRequest } from '@/utils/api';

const initialState = {
  loading: false,
  error: null,
  user: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { }) => {
  return await authApiRequest('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
});

export const loggedInUser = createAsyncThunk('auth/loggedInUser', async (_, { dispatch }) => {
  return await apiRequest(dispatch, '/api/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { }) => {
  return await authApiRequest('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  return await apiRequest(dispatch, '/api/auth/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { }) => {
  return await authApiRequest('/api/auth/refreshtoken', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        window.location.href = '/login';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        window.location.href = '/login';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        window.location.href = '/login';
      })

      .addCase(loggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.user = null;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
