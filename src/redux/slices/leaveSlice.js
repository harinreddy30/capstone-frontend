import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    leaveRequests: [], // Stores all leave requests
    loading: false,    // Loading state for API calls
    error: null,       // Error messages
}

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        // Action to handle when the request is pending
        leavePending: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Action to handle when the request is successful
        leaveSuccess: (state, action) => {
            state.loading = false;
            state.leaveRequests.push(action.payload); // Add the new leave request to the array
        },
        // Action to handle when the request fails
        leaveFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Store the error message
            // console.error("Leave request failed:", action.payload); // Log the error

        },
    }
})

// Export actions to be dispatched
export const { leavePending, leaveSuccess, leaveFailure } = leaveSlice.actions;

// Export the reducer to be used in the store
export default leaveSlice.reducer;