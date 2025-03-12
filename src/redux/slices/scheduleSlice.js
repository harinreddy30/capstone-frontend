import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    schedules: [], // Store all schedule data
    loading: false, // Loading state for API Calls
    error: null, // Error messages
}

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        // Action to handle when the request is pending
        schedulePending: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Action to handle when the request is successful
        scheduleSuccess: (state, action) => {
            state.loading = false;
            state.schedules = action.payload;
            state.error = null;
        },

        // Action to handle when the request fails
        scheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.schedules = [];
            console.log(action.payload)
        },

        // Action to handle when creating a schedule is successful
        scheduleCreateSuccess: (state, action) => {
            state.loading = false;
            state.schedules = [...state.schedules, action.payload];
            state.error = null;
        },

        // Action to handle when updating schedule is successful
        scheduleUpdateSuccess: (state, action) => {
            state.loading = false;
            state.schedules = state.schedules.map((schedule) =>
                schedule._id === action.payload._id ? action.payload : schedule
            );
            state.error = null;
        },

        // Action to handle when deleting a schedule is successful
        scheduleDeleteSuccess: (state, action) => {
            state.loading = false;
            state.schedules = state.schedules.filter(
                (schedule) => schedule._id !== action.payload
            );
            state.error = null;
        },

        // Action to handle when getting user schedules is successful
        userSchedulesSuccess: (state, action) => {
            state.loading = false;
            state.schedules = action.payload;
            state.error = null;
        },
    }
});

export const {
    schedulePending,
    scheduleSuccess,
    scheduleFailure,
    scheduleCreateSuccess,
    scheduleUpdateSuccess,
    scheduleDeleteSuccess,
    userSchedulesSuccess
} = scheduleSlice.actions;

export default scheduleSlice.reducer; 