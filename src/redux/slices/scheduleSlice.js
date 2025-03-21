// src/redux/slices/scheduleSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Validate localStorage data to ensure it's an array.
const storedSchedule = JSON.parse(localStorage.getItem("schedule"));
const initialSchedule = Array.isArray(storedSchedule) ? storedSchedule : [];

const initialState = {
  schedule: initialSchedule, // Store all schedule data
  loading: false,            // Loading state for API calls
  error: null,               // Error messages
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    schedulePending: (state) => {
      console.log("Redux: schedulePending triggered");
      state.loading = true;
      state.error = null;
    },
    scheduleSuccess: (state, action) => {
      console.log("Redux: scheduleSuccess triggered with data:", action.payload);
      state.loading = false;
      // Expecting action.payload to be an array of schedules.
      state.schedule = action.payload;
    },
    scheduleFailure: (state, action) => {
      console.log("Redux: scheduleFailure triggered with error:", action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    scheduleCreateSuccess: (state, action) => {
      state.loading = false;
      state.schedule = [...state.schedule, action.payload];
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
    scheduleUpdateSuccess: (state, action) => {
      state.loading = false;
      state.schedule = state.schedule.map((sched) =>
        sched._id === action.payload._id ? action.payload : sched
      );
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
    scheduleDeleteSuccess: (state, action) => {
      state.loading = false;
      state.schedule = state.schedule.filter(
        (sched) => sched._id !== action.payload
      );
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
  },
});

export const {
  schedulePending,
  scheduleSuccess,
  scheduleFailure,
  scheduleCreateSuccess,
  scheduleUpdateSuccess,
  scheduleDeleteSuccess,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
