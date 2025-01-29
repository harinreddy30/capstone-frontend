import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    availability: [], // Store all availability data
    loading: false, // Loading state for API Calls
    error: null, // Error messages
}

const availabilitySlice = createSlice({
    name: 'availability',
    initialState,
    reducers: {
        // Action to handle when the request is pending
        availabilityPending: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Action to handle when the request is successfully
        availabilitySuccess: (state, action) => {
            state.loading = false;
            state.availability = action.payload; // Update the availability data
        },
        // Action to handle when the request fails
        availabilityFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Store the error message
            console.log(action.payload)
        }

    }

})

export const {
    availabilityPending,
    availabilitySuccess,
    availabilityFailure,
  } = availabilitySlice.actions;

export default availabilitySlice.reducer;
