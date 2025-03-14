import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    schedule: JSON.parse(localStorage.getItem("schedule")) || [], // Store all schedule data
    loading: false, // Loading state for API Calls
    error: null, // Error messages
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        // Action to handle when the request is pending
        schedulePending: (state) => {
            console.log("Redux: schedulePending triggered");
            state.loading = true;
            state.error = null;
        },


        scheduleSuccess: (state, action) => {
            console.log("Redux: scheduleSuccess triggered with data:", action.payload);
            state.loading = false;
            state.schedule = action.payload; // Make sure this is correctly modifying the state
        },


        scheduleFailure: (state, action) => {
            console.log("Redux: scheduleFailure triggered with error:", action.payload);
            state.loading = false;
            state.error = action.payload;

        },

        // Action to handle when creating a schedule is successful
        scheduleCreateSuccess: (state, action) => {
            state.loading = false;
            state.schedule = [...state.schedule, action.payload]; // Append new schedule
            localStorage.setItem("schedule", JSON.stringify(state.schedule));
        },

        // Action to handle when updating a schedule is successful
        scheduleUpdateSuccess: (state, action) => {
            state.loading = false;
            state.schedule = state.schedule.map((schedule) =>
                schedule.schedules_id === action.payload.schedules_id ? action.payload : schedule
            );
            localStorage.setItem("schedule", JSON.stringify(state.schedule));
        },

        // Action to handle when deleting a schedule is successful
        scheduleDeleteSuccess: (state, action) => {
            state.loading = false;
            state.schedule = state.schedule.filter(
                (schedule) => schedule.schedules_id !== action.payload
            );
            localStorage.setItem("schedule", JSON.stringify(state.schedule));
        },
    },






});

export const {
    schedulePending,
    scheduleSuccess,
    scheduleFailure,
    scheduleUpdateSuccess,
    scheduleDeleteSuccess,
    scheduleCreateSuccess

} = scheduleSlice.actions;

export default scheduleSlice.reducer;