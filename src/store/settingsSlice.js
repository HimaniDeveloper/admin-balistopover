import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: {
    open: false,
    message: '',
    type: 'info',
    timeOut: 5000,
  },
  isLoading: false,
  lang: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    showToast(state, action) {
      state.toast = {
        open: true,
        message: action.payload.message,
        type: action.payload.type,
        timeOut: action.payload.timeOut || 5000,
      };
    },
    hideToast(state, action) {
      state.toast = {
        open: false,
        message: '',
        type: 'info',
        timeOut: action.payload?.timeOut || 5000,
      };
    },
    showLoader(state) {
      state.isLoading = true;
    },
    hideLoader(state) {
      state.isLoading = false;
    },
    changeLang(state, action) {
      state.lang = action.payload || 'en';
    },
  },
});

export const { showToast, hideToast, showLoader, hideLoader, changeLang } = settingsSlice.actions;
export default settingsSlice.reducer;
