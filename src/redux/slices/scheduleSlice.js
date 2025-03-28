// src/redux/slices/scheduleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storedSiteSchedules = JSON.parse(localStorage.getItem("siteSchedules"));
const storedGlobalSchedules = JSON.parse(localStorage.getItem("globalSchedules"));
const initialState = {
  siteSchedules: Array.isArray(storedSiteSchedules) ? storedSiteSchedules : [],
  globalSchedules: Array.isArray(storedGlobalSchedules) ? storedGlobalSchedules : [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    schedulePending: (state) => {
      state.loading = true;
      state.error = null;
    },
    siteSchedulesSuccess: (state, action) => {
      state.loading = false;
      state.siteSchedules = action.payload;
      localStorage.setItem("siteSchedules", JSON.stringify(state.siteSchedules));
    },
    globalSchedulesSuccess: (state, action) => {
      state.loading = false;
      state.globalSchedules = action.payload;
      localStorage.setItem("globalSchedules", JSON.stringify(state.globalSchedules));
    },
    scheduleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    scheduleCreateSuccess: (state, action) => {
      state.loading = false;
      // Add the newly created schedule to both lists.
      state.siteSchedules.push(action.payload);
      state.globalSchedules.push(action.payload);
      localStorage.setItem("siteSchedules", JSON.stringify(state.siteSchedules));
      localStorage.setItem("globalSchedules", JSON.stringify(state.globalSchedules));
    },
    scheduleUpdateSuccess: (state, action) => {
      state.loading = false;
      state.siteSchedules = state.siteSchedules.map((s) =>
        s._id === action.payload._id ? action.payload : s
      );
      state.globalSchedules = state.globalSchedules.map((s) =>
        s._id === action.payload._id ? action.payload : s
      );
      localStorage.setItem("siteSchedules", JSON.stringify(state.siteSchedules));
      localStorage.setItem("globalSchedules", JSON.stringify(state.globalSchedules));
    },
    scheduleDeleteSuccess: (state, action) => {
      state.loading = false;
      state.siteSchedules = state.siteSchedules.filter(
        (s) => s._id !== action.payload
      );
      state.globalSchedules = state.globalSchedules.filter(
        (s) => s._id !== action.payload
      );
      localStorage.setItem("siteSchedules", JSON.stringify(state.siteSchedules));
      localStorage.setItem("globalSchedules", JSON.stringify(state.globalSchedules));
    },
  },
});

export const {
  schedulePending,
  scheduleFailure,
  siteSchedulesSuccess,
  globalSchedulesSuccess,
  scheduleCreateSuccess,
  scheduleUpdateSuccess,
  scheduleDeleteSuccess,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
