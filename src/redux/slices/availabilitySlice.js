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
        },
        // Action to handle when fetching a availability by ID is successful
        availabilityByIdSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload; // Store the fetched user by ID
        },
        // Action to handle when creating a availability is successful
        availabilityCreateSuccess: (state, action) => {
            state.loading = false;
            state.availability.push(action.payload); // Add the new user to the users array
        },
         // Action to handle when updating availability is successful
         availabilityUpdateSuccess: (state, action) => {
            state.loading = false;
            state.users = state.users.map((user) =>
                availability._id === action.payload._id ? action.payload : availability
            ); // Update the user in the users array
        },
        // Action to handle when deleting a availability is successful
        availabilityDeleteSuccess: (state, action) => {
            state.loading = false;
            state.availability = state.availability.filter((user) => user._availability !== action.payload); // Remove the deleted user
        },

    }

})

export const {
    availabilityPending,
    availabilitySuccess,
    availabilityFailure,
    availabilityByIdSuccess, 
    availabilityCreateSuccess, 
    availabilityUpdateSuccess, 
    availabilityDeleteSuccess 
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
